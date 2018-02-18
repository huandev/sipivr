declare function console_log(level: "debug" | "info" | "err", message: string): void;
declare function exit(): void;
declare function use(module: string);
declare function include(script: string);
declare function apiExecute(application: string, data?: string);

declare class CURL {
    //new CURL().run("GET", url, data, function() {
    //          return arguments[0];
    //     }, null, cred);
    /**https://wiki.freeswitch.org/wiki/Run */
    run(method: "GET" | "POST", url: string, request_data?: string, callback?: (response: string, callback_arg?: any) => any, callback_arg?: any, credentials?: string, timeout?: number, content_type?: string);
}

declare class ODBC {
    constructor(dsn: string, login: string, password: string);

    connect(): void;
    close(): void;

    execute(query: string): void;
    nextRow(): any;
    getData(): any;
}

declare var argv: string[];

declare var session: {
    cause: string;

    answer(): void;
    execute(application: string, data?: any): any;
    getDigits(length: number, symbol: string, duration: number): string;
    setVariable(name: string, value: any);
    sleep(duration: number): void;

    /** https://wiki.freeswitch.org/wiki/Session_streamFile */
    streamFile(
        name: string,
        callback?: (streamSession: { name: string }, type: "dtmf", digits: { digit: string, duration: number }, arg: any) => (string | boolean),
        callback_args?: any,
        starting_sample_count?: number): void;

    getVariable(name: string): string;
    ready(): boolean;
    setHangupHook(callback: () => void): void;
    hangup(code: 16 | "NORMAL_CLEARING");
};

declare class XML {
    name: string;
    data: string;

    constructor(xml: string);

    next(): XML;
    remove(): void;
    serialize(): string;
    copy(): XML;

    addChild(name: string): XML;
    getChild(name: string): XML;

    setAttribute(name: string, value: string): void;
    getAttribute(name: string): string;
} 