declare function console_log(level: "debug" | "info" | "err", message: string): void;
declare function exit(): void;
declare function use(module: string);
declare function include(script: string);
declare function apiExecute(application: string, data?: string);
declare function getGlobalVariable(name: string): string;

declare class CURL {
    //new CURL().run("GET", url, data, function() {
    //          return arguments[0];
    //     }, null, cred);
    /**https://wiki.freeswitch.org/wiki/Run */
    run(method: "GET" | "POST", url: string, request_data?: string, callback?: (response: string, callback_arg?: any) => any, callback_arg?: any, credentials?: string, timeout?: number, content_type?: string): string;
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

declare class Session {
    constructor(destination: string);

    cause: string;

    answer(): void;
    execute(application: string, data?: any): any;
    getDigits(length: number, symbol: string, duration: number): string;

    sleep(duration: number): void;

    /** https://wiki.freeswitch.org/wiki/Session_streamFile */
    streamFile(
        name: string,
        callback?: (streamSession: { name: string }, type: "dtmf", digits: { digit: string, duration: number }, arg: any) => (string | boolean),
        callback_args?: any,
        starting_sample_count?: number): void;

    /** https://freeswitch.org/confluence/display/FREESWITCH/Channel+Variables */
    getVariable(name: string): string;
    setVariable(name: string, value: any);

    ready(): boolean;
    setHangupHook(callback: () => void): void;
    hangup(code: 16 | "NORMAL_CLEARING");
}

declare var session: Session;

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

declare class FileIO {
    path: string;

    /**
     * @param name - the filename including path to open
     * @param flags - are one of: r - read, w - write, c - create, a - append, t - truncate, b - binary
     */
    constructor(name: string, flags: string);

    read(size: number): void;
    write(data: string): void;
    data(): string;
}