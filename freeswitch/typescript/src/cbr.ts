import { Logger } from "./Utils/Logger";
import { XPath } from "./Utils/XPath";
import { Manager } from "./Utils/Manager";
import { SpeechManager } from "./Utils/Speech/SpeechManager";

use("CURL");
use('XML');

let logger: ILogger = new Logger();
let manager = new Manager(logger);
let speechManager = new SpeechManager(manager);


let curl = new CURL();


let response = curl.run("GET", "http://cbr.ru/scripts/XML_daily.asp", null, (response, callback_arg) => {
    return response;
}, null, null, null, "text/xml")

logger.info(response);

var xml = new XML(response);

let data: any = new XPath(xml).selectSingleNode("ValCurs/Valute/NumCode").data;
speechManager.number(data * 1);
