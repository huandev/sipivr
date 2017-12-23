declare namespace session {
    export function answer(): void;

    export function execute(application: string, data?: any): any;

    export function getDigits(length: number, symbol: string, duration: number): string;

    export function sleep(duration: number): void;

    /** https://wiki.freeswitch.org/wiki/Session_streamFile */
    export function streamFile(
        name: string,
        callback?: (session: { name: string }, type: ("dtmf"), digits: { digit: string, duration: number }, arg: any) => (string | boolean),
        callback_args?: any,
        starting_sample_count?: number): void;

    export function getVariable(name: string): string;
    export let cause: string;
    export function ready(): boolean;
    export function setHangupHook(callback: () => void): void;
    export function hangup(code: number);
} 