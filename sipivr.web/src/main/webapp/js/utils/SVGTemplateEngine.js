define(["knockout"], function(ko){

    function SVGTemplateEngine() {
        this.allowTemplateRewriting = false;
    }

    SVGTemplateEngine.prototype = new ko.templateEngine();
    SVGTemplateEngine.prototype.renderTemplateSource = function (templateSource, bindingContext, options) {
        var nodes = templateSource.nodes();
        if (nodes)
                return nodes;
        var div = document.createElement('div'),
            text = '<svg xmlns="http://www.w3.org/2000/svg">' + templateSource.text() + '</svg>';
        div.innerHTML = text;
        return ko.utils.arrayPushAll([], div.childNodes[0].childNodes);
    };
   
    return SVGTemplateEngine;
 });