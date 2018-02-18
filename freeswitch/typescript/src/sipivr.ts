import { SipIvr } from "./Utils/SipIvr";

use("CURL");
console_log("info", "start");

let manager = new SipIvr({
    Host: session.getVariable("SipIvr.Url"),
    Cred: session.getVariable("SipIvr.Cred"),
});

session.setHangupHook(() => {
    manager.disconnect();
});

manager.transition();

console_log("info", "end");

if (session.ready()) {
    manager.disconnect();
}

exit();