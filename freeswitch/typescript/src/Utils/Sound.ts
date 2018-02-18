export class Sound {
    private static readonly SoundInputVariable = "sipivr.SoundInput";

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

    static play(name: string, inputMode = true): string {
        console_log("info", "sound: " + name + ", inputMode " + inputMode + ", hasInput " + this.hasInput() + ", input " + session.getVariable(this.SoundInputVariable));
        if (!this.hasInput()) {
            session.streamFile(name, (streamSession, type, digits, arg) => {
                if (inputMode) {
                    session.setVariable(this.SoundInputVariable, digits.digit);
                    console_log("info", "sound input: " + digits.digit);
                }
                return !inputMode;
            }, false);
        }
        return session.getVariable(this.SoundInputVariable);
    }
}