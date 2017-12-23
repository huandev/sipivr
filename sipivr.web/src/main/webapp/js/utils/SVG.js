define(function(){

    var SVG = {
        getPosition: function(ui) {
            var res = ui.getBoundingClientRect();
            return res;
        },
        getTransform: function(ui) {
            var res = {x: 0, y: 0, scale: 1};

            for(var i = 0; i < ui.transform.baseVal.length; i++){
                res.x += ui.transform.baseVal[i].matrix.e;
                res.y += ui.transform.baseVal[i].matrix.f;
                res.scale *= ui.transform.baseVal[i].matrix.a;
            }

            return res;
        },
        getTransformBy: function(ui, by) {
            if (by === undefined)
                throw new Error("Element has't container." );
            
            if (ui == by) {
                return {x: 0, y: 0, scale: 1};
            }
            var t = SVG.getTransform(ui),
                parentT = SVG.getTransformBy(ui.parentNode, by);
        
            return {x: t.x + parentT.x, y: t.y + parentT.y, scale: t.scale * parentT.scale};
        },
        getMousePositionBy: function(e, by) {
            if (by instanceof SVGSVGElement) {
                //var rect = by.getBoundingClientRect();
                //return {x: e.clientX - rect.left, y: e.clientY -rect.top}
                var rect = by.getScreenCTM();
                return {x: e.clientX - rect.e, y: e.clientY - rect.f};
            }

            var p = SVG.getMousePositionBy(e, by.parentNode),
                t = SVG.getTransform(by);

            return {x: (p.x - t.x) / t.scale, y: (p.y - t.y) / t.scale};
        },
        removeNode: function(node) {
            node.parentNode.removeChild(node);
        },
        createNode: function(parent, tag, attrs) {
            var namespace = "http://www.w3.org/2000/svg",
                node = document.createElementNS(namespace, tag);
            
            for (var key in attrs) {
                node.setAttributeNS(null, key, attrs[key]);
            }
            parent.appendChild(node);
            return node;
        }
    };
    
    return SVG;
});