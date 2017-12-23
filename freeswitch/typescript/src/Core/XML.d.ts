/** https://freeswitch.org/confluence/display/FREESWITCH/JavaScript+example+-+XML */
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