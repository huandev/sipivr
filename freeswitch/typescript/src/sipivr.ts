import { SipIvr } from "./Utils/SipIvr";

use("CURL");
console_log("info", "start");

let manager = new SipIvr({
    Host: "https://127.0.0.1:443",
    Cred: "${user}:${password}",
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