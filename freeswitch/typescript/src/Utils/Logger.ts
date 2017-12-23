export class Logger implements ILogger {
    private log(level: any, message: string, args: any[]): void {
        console_log(level, this.format(message, args) + "\r\n");
    };

    private format(message: any, args: any[]) {
        return new String(message).replace(/{(\d+)}/g, function (match, number) {
            //return typeof args[number] !== 'undefined' ? args[number] : match;
            return args[number];
        });
    }

    info(message?: any, ...args): void {
        this.log("info", message, args);
    };

    error(message?: any, ...args): void {
        this.log('err', message, args);
    };
}