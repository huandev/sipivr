import { Logger } from "./Utils/Logger";
import { Manager } from "./Utils/Manager";
import { Currency } from "./Utils/Speech/Enums";
import { SpeechManager } from "./Utils/Speech/SpeechManager";

let logger = new Logger();

let manager = new Manager(logger);

manager.answer();

//manager.script("glassfish.ts.js")

let speechManager = new SpeechManager(manager);
speechManager.percent(42);
speechManager.number(0.1123);
speechManager.date(new Date());
speechManager.currency(123.23, Currency.RUB);


exit();

