export class Sound {
    private static readonly SoundInputVariable = "sipivr.SoundInput";
    private static readonly SoundInputModeVariable = "sipivr.SoundInputMode";

    static clearInput(): void {
        session.setVariable(this.SoundInputVariable, "");
    }

    static getInput(): string {
        var res = session.getVariable(this.SoundInputVariable);
        this.clearInput();
        return res;
    }

    static hasInput(): boolean {
        var input = session.getVariable(this.SoundInputVariable);
        return input !== null && input !== undefined && input !== "";
    }

    static inputOn(): void {
        session.setVariable(this.SoundInputModeVariable, true);
    }

    static inputOff(): void {
        session.setVariable(this.SoundInputModeVariable, false);
    }

    static play(name: string, inputMode?: boolean): string {
        if (inputMode === undefined) {
            inputMode = session.getVariable(this.SoundInputModeVariable) !== "false";
        }

        console_log("info", "sound: " + name + ", inputMode " + inputMode + ", hasInput " + this.hasInput() + ", input " + session.getVariable(this.SoundInputVariable));
        if (session.ready()) {
            if (!this.hasInput()) {
                session.streamFile(name, (streamSession, type, digits, arg) => {
                    if (inputMode) {
                        session.setVariable(this.SoundInputVariable, digits.digit);
                        console_log("info", "sound input: " + digits.digit);
                    }
                    return !inputMode;
                });
            }
        }
        return session.getVariable(this.SoundInputVariable);
    }
}