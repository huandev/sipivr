import { Sound } from "./Sound";

declare type ModuleType = "Bridge" | "Condition" | "Conference" | "IfVariable" | "Input" | "Record" | "Script" | "SetVariable" | "Sleep" | "Sound" | "Transfer" | "Transition";
declare type Module = { type: ModuleType };

export class SipIvr {
    private inputRunned = false;
    private input: string = null;
    private transferNumber: string = null;

    private callId: number = null;
    private readonly sipCallId = session.getVariable("sip_call_id");
    private readonly callerId = session.getVariable("caller_id_number");
    private readonly calledId = session.getVariable("destination_number");
    private readonly number = argv[0];

    private readonly Settings: { Host: string, Cred: string, };


    constructor(settings: { Host: string, Cred: string }) {
        this.Settings = settings;
    }

    disconnect(): void {
        console_log("info", "Disconnect cause: " + session.cause);
        if (this.callId) {
            let url = this.Settings.Host + "/service/disconnect/" + this.callId;
            let data = this.transferNumber ? "transferNumber=" + this.transferNumber : null;
            this.request(url, data, this.Settings.Cred);
        }
        console_log("info", "disconnect");
    }

    transition(menuId?: number) {
        if (session.ready()) {
            console_log("info", "transition: " + menuId);

            this.inputRunned = false;
            Sound.clearInput();

            let url = this.Settings.Host + "/service";
            let data = "sipCallId=" + this.sipCallId + "&callerId=" + this.callerId + "&calledId=" + this.calledId;
            if (this.callId) {
                data += "&callId=" + this.callId;
            }
            if (this.input) {
                data += "&input=" + this.input;
            }

            if (menuId) {
                url += "/menu/" + menuId
            } else {
                url += "/" + this.number;
            }

            let response = this.request(url, data, this.Settings.Cred);

            if (response && response != "undefined") {
                let model = JSON.parse(response);

                if (model.status == 200) {
                    if (!menuId) {
                        this.answer();
                    }
                    this.callId = model.callId;
                    this.performModel(model.modules);
                } else {
                    console_log("err", model.status + " " + model.message);
                }
            } else {
                console_log("err", "empty response");
            }
        }
    }

    compare(mask: string, input: string): boolean {
        let index = 0;

        for (let i = 0; i < mask.length; i++) {
            if (mask[i] == '_') {
                index++;
            } else if (mask[i] == '%') {
                return true;
            } else if (mask[i] != input[index]) {
                return false;
            } else {
                index++;
            }
        }

        return true;
    }

    performModule(item: Module): boolean {
        if (session.ready()) {
            console_log("info", "Type: " + item.type);
            switch (item.type) {
                case "Bridge":
                    console_log("info", "Value: " + item["value"]);
                    this.transferNumber = item["value"];
                    this.bridge(item["value"]);
                    break;
                case "Condition":
                    console_log("info", "Value: " + item["value"]);
                    if (!this.inputRunned) {
                        this.performModule({ type: "Input", duration: 5000, length: 1 } as any);
                    }
                    if (this.compare(item["value"], this.input)) {
                        if (item["nextMenuId"]) {
                            this.transition(item["nextMenuId"]);
                        }
                        return true;
                    }
                    break;
                case "Conference":
                    this.conference(item["name"]);
                    return true;
                case "IfVariable":
                    if (this.ifVariable(item["name"], item["method"], item["value"])) {
                        if (item["nextMenuId"]) {
                            this.transition(item["nextMenuId"]);
                        }
                        return true;
                    }
                    break;
                case "Input":
                    this.inputRunned = true;
                    if (Sound.hasInput()) {
                        this.input = Sound.getInput();
                    } else {
                        this.input = this.getInput(item["duration"], item["length"]);
                    }
                    break;
                case "Record":
                    if (this.record(item["folder"], item["duration"]) && item["url"]) {
                        this.request(this.Settings.Host + item["url"], "callId=" + this.callId, this.Settings.Cred);
                    }
                    break;
                case "Script":
                    this.script(item["path"], item["arguments"]);
                    break;
                case "SetVariable":
                    this.setVariable(item["name"], item["value"]);
                    break;
                case "Sleep":
                    this.sleep(item["duration"]);
                    break;
                case "Sound":
                    Sound.play(item["path"]);
                    break;
                case "Transfer":
                    this.transfer(item["number"]);
                    return true;
                case "Transition":
                    if (item["nextMenuId"]) {
                        this.transition(item["nextMenuId"]);
                    }
                    return true;
            }

            return false;
        } else {
            return true;
        }
    }

    performModel(modules: Module[]): void {
        for (let i = 0; i < modules.length; i++) {
            if (this.performModule(modules[i]))
                break;
        }
    }

    answer() {
        console_log("info", "answer");
        session.answer();
    }
    bridge(value: string) {
        console_log("info", "bridge: " + value);
        session.execute("bridge", value);
    }
    conference(name: string) {
        console_log("info", "conference: " + name);
        session.execute("conference", name + "-$@default");
    }
    getInput(duration: number, length: number) {
        console_log("info", "getInput: " + duration + ", " + length);
        let input = session.getDigits(length, "", duration);
        console_log("info", "input: " + input);
        return input;
    }
    ifVariable(name: string, method: "Equal" | "NotEqual" | "LessThan" | "LessThanOrQqual" | "GreaterThan" | "GreaterThanOrQqual" | "Match" | "NotMatch", value: string) {
        let res = false;
        switch (method) {
            case "Equal":
                res = value == session.getVariable(name);
                break;
            case "NotEqual":
                res = value != session.getVariable(name);
                break;
            case "LessThan":
                res = session.getVariable(name) < value;
                break;
            case "LessThanOrQqual":
                res = session.getVariable(name) <= value;
                break;
            case "GreaterThan":
                res = session.getVariable(name) > value;
                break;
            case "GreaterThanOrQqual":
                res = session.getVariable(name) >= value;
                break;
            case "Match":
                res = new RegExp(value).test(session.getVariable(name));
                break;
            case "NotMatch":
                res = !new RegExp(value).test(session.getVariable(name));
                break;
            default:
                console_log("err", "Unknown method " + method);
                break;
        }

        console_log("info", name + " " + method + " " + value + " is " + res);
        return res;
    }
    record(folder: string, duration: string) {
        if (session.ready()) {
            session.execute("record", folder + "/${sip_call_id}.wav " + duration + " 200 3");
            return true;
        }
        return false;
    }
    request(url: string, data?: string, cred?: string) {
        console_log("info", "request " + url + (data ? "?" + data : ""));
        var response = new CURL().run("GET", url, data, (arg0) => {
            return arg0;
        }, null, cred);
        console_log("info", "response " + (response ? "(" + response.length + "): " : "") + response);
        return response;
    }
    setVariable(name: string, value: string) {
        console_log("info", "setVariable " + name + "=" + value);
        session.setVariable(name, value);
    }
    script(file: string, args: string) {
        console_log("info", "script: " + file);
        session.execute("javascript", file + (args ? " " + args : ""));
    }
    sleep(duration: number) {
        console_log("info", "sleep: " + duration);
        session.execute("sleep", duration);
    }
    transfer(number: string) {
        console_log("info", "transfer: " + number);
        session.execute("transfer", number);
    }
};