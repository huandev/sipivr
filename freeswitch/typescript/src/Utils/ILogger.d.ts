declare interface ILogger {
    info(message?: any, ...args): void;
    error(message?: any, ...args): void;
}