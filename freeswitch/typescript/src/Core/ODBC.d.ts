/** https://freeswitch.org/confluence/display/FREESWITCH/ODBC+Example */
declare class ODBC {
    constructor(dsn: string, login: string, password: string);

    connect(): void;
    close(): void;

    execute(query: string): void;
    nextRow(): any;
    getData(): any;
} 