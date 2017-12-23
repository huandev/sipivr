export class Manager {
    readonly Logger: ILogger;

    constructor(logger: ILogger) {
        this.Logger = logger;
    }

    answer() {
        this.Logger.info("answer");
        session.answer();
    }
    bridge(value: string) {
        this.Logger.info("bridge: " + value);
        session.execute("bridge", value);
    }
    getInput(duration: number, length: number) {
        this.Logger.info("getInput: " + duration + ", " + length);
        var input = session.getDigits(length, "", duration);
        this.Logger.info("input: " + input);
        return input;
    }
    record(folder: string, duration: string) {
        if (session.ready()) {
            session.execute("record", folder + "/${sip_call_id}.wav " + duration + " 200 3");
            return true;
        }
        return false;
    }
    getRequest(url: string, data?: string, cred?: string) {
        this.Logger.info("request " + url + (data ? "?" + data : ""));
        var response = new CURL().run("GET", url, data, function () {
            return arguments[0];
        }, null, cred);
        this.Logger.info("response " + response);
        this.Logger.info("response length " + (response ? response.length : 0));
        return response;
    }
    script(file: string) {
        this.Logger.info("script: " + file);
        session.execute("javascript", file);
    }
    sleep(duration) {
        this.Logger.info("sleep: " + duration);
        session.execute("sleep", duration);
    }
    sound(name: string, inputMode?: boolean) {
        if (inputMode === undefined) {
            inputMode = true;
        }
        this.Logger.info("sound: {0}, inputMode {1}", name, inputMode);
        let input: string = null;
        session.streamFile(name, (session, type, digits, arg) => {
            if (inputMode) {
                input = digits.digit;
                this.Logger.info("sound input: " + input);
            }
            return !inputMode;
        }, false);
        return input;
    }
    transfer(number) {
        this.Logger.info("transfer: " + number);
        session.execute("transfer", number);
    }
}