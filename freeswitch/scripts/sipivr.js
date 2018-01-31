use("CURL");
var curl = new CURL();

var log = {
    __log: function (type, message) {
        console_log(type, message + "\r\n");
    },

    info: function (message) {
        this.__log('info', message);
    },

    error: function (message) {
        this.__log('err', message);
    }
}

var manager = {
    answer: function () {
        log.info("answer");
        session.answer();
    },
    bridge: function (value) {
        log.info("bridge: " + value);
        session.execute("bridge", value);
    },
    conference: function(name) {
        log.info("conference: " + name);
        session.execute("conference", name + "-$@default");
    },
    getInput: function (duration, length) {
        log.info("getInput: " + duration + ", " + length);
        var input = session.getDigits(length, "", duration);
        log.info("input: " + input);
        return input;
    },
    record: function(folder, duration){
        if(session.ready()) {
            session.execute("record", folder + "/${sip_call_id}.wav " + duration + " 200 3");
            return true;
        }
        return false;
    },
    request: function (url, data, cred) {
        log.info("request " + url + (data ? "?" + data : ""));
        var response = new CURL().run("GET", url, data, function() {
            return arguments[0];
        }, null, cred);
        log.info("response " + response);
        log.info("response length " + (response ? response.length : 0));
        return response;
    },
    setVariable: function(name, value){
        log.info("setVariable " + name + "=" + value);
        session.setVariable(name, value);
    },
    shout: function (url) {
        log.info("shout: " + url);
        session.streamFile("shout://" + url + ".mp3");
    },
    script: function(file, arguments){
        log.info("script: " + file + " " + arguments);
        session.execute("javascript", file + " " + arguments);
    },
    sleep: function (duration) {
        log.info("sleep: " + duration);
        session.execute("sleep", duration);
    },
    sound: function (name) {
        log.info("sound: " + name);
        var input = null;
        session.streamFile(name, function(session, type, digits, arg ){
            input = digits.digit;
            log.info("sound input: " + input);
            return false;
        }, false);
        return input;
    },
    transfer: function (number) {
        log.info("transfer: " + number);
        session.execute("transfer", number);
    }
}

var settings = {
    host: "https://127.0.0.1:443",
    cred: "${user}:${password}",
    callId: null,
    sipCallId: session.getVariable("sip_call_id"),
    callerId: session.getVariable("caller_id_number"),
    calledId: session.getVariable("destination_number"),
    number: argv[0]
};

var inputRunned = false;
var input = null;
var soundInput = null;
var transferNumber = null;

log.info("start");

function disconnect(){
    log.info("Disconnect cause: " + session.cause);
    if(settings.callId){
        var url = settings.host + "/service/disconnect/" + settings.callId;
        var data = transferNumber ? "transferNumber=" + transferNumber : null;
        manager.request(url, data, settings.cred);
    }
    log.info('disconnect');
}

function transition(menuId) {
    inputRunned = false;

    if (session.ready()) {
        log.info("transition: " + menuId);

        var url = settings.host + "/service";
        var data = "sipCallId=" + settings.sipCallId + "&callerId=" + settings.callerId + "&calledId=" + settings.calledId;
        if(settings.callId){
            data += "&callId=" + settings.callId;
        }
        if(input) {
            data += "&input=" + input;
        }

        if (menuId) {
            url += "/menu/" + menuId
        } else {
            url += "/" + settings.number;
        }

        var response = manager.request(url, data, settings.cred);

        if(response && response != "undefined"){
            var model = JSON.parse(response);

            if(model.status == 200) {
                if (!menuId) {
                    manager.answer();
                }
                settings.callId = model.callId;
                performModel(model.modules);
            } else {
                log.error(model.status + " " + model.message);
            }
        } else {
            log.error("empty response");
        }
    }
}

function compare(mask, input) {
    var index = 0;

    for (var i = 0; i < mask.length; i++) {
        if (mask[i] == '_' ) {
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

function performModule(item) {
    if (session.ready()){
        log.info("Type: " + item.type);
        switch (item.type) {
            case "Bridge":
                log.info("Value: " + item.value);
                transferNumber = item.value;
                manager.bridge(item.value);
                break;
            case "Condition":
                log.info("Value: " + item.value);
                if(!inputRunned) {
                    performModule({ type: "Input", duration: 5000, length: 1 });
                }
                if (compare(item.value, input)) {
                    if(item.nextMenuId) {
                        transition(item.nextMenuId);
                        return true;
                    }
                }
                break;
            case "Conference":
                manager.conference(item.name);
                return true;
                break;
            case "Input":
                inputRunned = true;
                if(soundInput){
                    input = soundInput;
                    soundInput = null;
                } else {
                    input = manager.getInput(item.duration, item.length);
                }
                break;
            case "Record":
                if(manager.record(item.folder, item.duration) && item.url){
                    manager.request(settings.host + item.url, "callId=" + settings.callId, settings.cred);
                }
                break;
            case "Script":
                manager.script(item.path, item.arguments);
                break;
            case "SetVariable":
                manager.setVariable(item.name, item.value);
                break;
            case "Sleep":
                manager.sleep(item.duration);
                break;
            case "Sound":
                if(!soundInput) {
                    soundInput = manager.sound(item.path);
                }
                break;
            /*case "HttpSoundResult":
             manager.shout(settings.host + item.Url.replace("~", ""));
             break;*/
            case "Transfer":
                manager.transfer(item.number);
                return true;
                break;
            case "Transition":
                if(item.nextMenuId) {
                    transition(item.nextMenuId);
                    return true;
                }
                break;
            case "Tts":
                break;
        }

        return false;
    } else {
        return true;
    }
}

session.setHangupHook(disconnect);

function performModel(modules) {
    for (var i = 0; i < modules.length; i++) {
        if (performModule(modules[i]))
            break;
    }
}

transition();

log.info("end");

if (session.ready()) {
    disconnect();
}

exit();