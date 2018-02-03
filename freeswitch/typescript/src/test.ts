import { DateSpeller } from "./Utils/Speech/DateSpeller";

let sound = (name: string, inputMode = true) => {
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
};

let input: string = null;
DateSpeller.spellWithoutYear(new Date()).every(f => {
    input = sound(f.getFileName());
    return input === null;
});