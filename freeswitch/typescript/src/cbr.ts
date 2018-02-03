import { XPath } from "./Utils/XPath";
import { SpeechManager } from "./Utils/Speech/SpeechManager";

use("CURL");
use('XML');

let speechManager = new SpeechManager((name: string, inputMode = true) => {
    console_log("info", "sound: " + name + ", inputMode " + inputMode);
    let input: string = null;
    session.streamFile(name, (session, type, digits, arg) => {
        if (inputMode) {
            input = digits.digit;
            console_log("info", "sound input: " + input);
        }
        return !inputMode;
    }, false);
    return input;
});


let curl = new CURL();


let response = curl.run("GET", "http://cbr.ru/scripts/XML_daily.asp", null, (response, callback_arg) => {
    return response;
}, null, null, null, "text/xml")

console_log("info", response);

var xml = new XML(response);

let data: any = new XPath(xml).selectSingleNode("ValCurs/Valute/NumCode").data;
speechManager.number(data * 1);