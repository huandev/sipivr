export class XPath {
    private readonly separator: string = "/";
    private readonly xml: XML;

    constructor(xml: XML) {
        this.xml = xml;
    }

    selectNodes(xpath: string): XML[] {
        let parts = xpath.split(this.separator);
        let child: XML = this.xml;
        for (let i = 0; i < parts.length; i++) {
            child = child.getChild(parts[i]);
        }

        let res = [];
        while (child) {
            res.push(child);
            child = child.next();
        }

        return res;
    }

    selectSingleNode(xpath: string): XML {
        let parts = xpath.split(this.separator);
        let child: XML = this.xml;
        for (let i = 0; i < parts.length; i++) {
            child = child.getChild(parts[i]);
        }
        return child;
    }
}