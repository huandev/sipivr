<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<tiles:insertDefinition name="defaultTemplate">
    <tiles:putAttribute name="body">
        <style>
            #wav-tree { position: absolute; width:290px; top:0; left:0; bottom:0;
                overflow-y:auto; padding: 5px; }
            #wav-tree i { color:#009cde; }
            #wav-tree label {cursor:pointer; padding:2px;}
            #wav-editor-container { position:absolute; width:1020px; left:300px; padding:5px;
                border-left: 1px solid #f0f0f0; }
        </style>

        <script type="text/html" id="wav-tree-node">
            <div>
                <label data-bind="click: function() { $root.click($data); }, css: { 'text-green': $data === $root.active() }">
                    <i data-bind="css: {
                    'icon-folder': directory && $root.toggles.indexOf($data) < 0,
                    'icon-folder-open': directory && $root.toggles.indexOf($data) >= 0,
                    'icon-file-audio': !directory }"></i>
                    <span data-bind="text: name, attr: { title: path }"></span>
                </label>
                <div style="margin-left: 10px;" data-bind="visible: $data.childs && $root.toggles.indexOf($data) >= 0, template: { name: 'wav-tree-node', foreach: childs }"></div>
            </div>
        </script>

        <div style="position: absolute; left:0; top:0; right:0; bottom:0;">
            <div id="wav-tree" style="display:none;" data-bind="visible: true, template: { name: 'wav-tree-node', foreach: childs }">
            </div>

            <div id="wav-editor-container">
                <jsp:include page="/jsp/wav/editor_partial.jsp"/>
            </div>
        </div>


        <script type="text/javascript">
            require(["knockout", "sound/wav/Editor"], function(ko, editor){
                var tree = {
                    childs: ko.observableArray(),
                    toggles: ko.observableArray(),
                    active: ko.observable(),
                    click: function (node) {
                        if(node.directory){
                            if(tree.toggles.indexOf(node) >= 0){
                                tree.toggles.remove(node);
                            } else {
                                tree.toggles.push(node);
                            }
                        } else {
                            this.active(node);
                            editor.load(node.path);
                        }
                    },
                }

                $.post(contextPath + "wav/tree", function(data) {
                    tree.childs(data);
                    ko.applyBindings(tree, document.getElementById("wav-tree"));
                });
            });
        </script>
    </tiles:putAttribute>
</tiles:insertDefinition>