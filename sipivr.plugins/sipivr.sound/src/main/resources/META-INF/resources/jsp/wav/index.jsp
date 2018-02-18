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

            #wav-tree form { left:0; top:0; width: 100%; height: 100%; opacity: 0.5; position:absolute; z-index: -1; }
            #wav-tree .drag > form { background: #64a70b; z-index: 100; }
            #wav-tree form > input[type=file] { display: block; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
        </style>

        <script type="text/html" id="wav-tree-node">
            <div style="position: relative;" data-bind="fileDrop: directory ? { handler: function(files){ $root.fileDropHandler(path, files); } } : undefined">
                <form data-bind="visible: directory">
                    <input type="file" accept=".mp3,.wav,audio/*" multiple/>
                </form>

                <label data-bind="css: { 'text-green': $data.path === $root.active() }">
                    <!-- ko if: $data === $root.renamed() -->
                    <i data-bind="css: {
                        'icon-folder': directory && $root.toggles.indexOf($data.path) < 0,
                        'icon-folder-open': directory && $root.toggles.indexOf($data.path) >= 0,
                        'icon-file-audio': !directory }"></i>
                    <input type="text" data-bind="value: $data.name.replace('.wav', '')"/>.wav
                    <i class="icon-ok" data-bind="click: function() { $root.rename($data.path, $($element).prev().val() + '.wav'); }"></i>
                    <i class="icon-cancel" data-bind="click: function() { $root.renamed(null); }"></i>
                    <!-- /ko -->
                    <!-- ko ifnot: $data === $root.renamed() -->
                    <span data-bind="click: function() { $root.click($data); }">
                        <i data-bind="css: {
                        'icon-folder': directory && $root.toggles.indexOf($data.path) < 0,
                        'icon-folder-open': directory && $root.toggles.indexOf($data.path) >= 0,
                        'icon-file-audio': !directory }"></i>
                        <span data-bind="text: name, attr: { title: path }"></span>
                    </span>
                    <i class="icon-edit" data-bind="visible: !directory, click: function() { $root.renamed($data); }"></i>
                    <!-- /ko -->
                </label>
                <div style="margin-left: 10px;" data-bind="visible: $data.childs && $root.toggles.indexOf($data.path) >= 0, template: { name: 'wav-tree-node', foreach: childs }"></div>
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
            require(["knockout", "sound/wav/Editor", "messages", "app/ko.binding.fileDrop"], function(ko, editor, messages){
                var tree = {
                    childs: ko.observableArray(),
                    toggles: ko.observableArray(),
                    active: ko.observable(),
                    renamed: ko.observable(),
                    click: function (node) {
                        if(node.directory){
                            if(tree.toggles.indexOf(node.path) >= 0){
                                tree.toggles.remove(node.path);
                            } else {
                                tree.toggles.push(node.path);
                            }
                        } else {
                            this.active(node.path);
                            editor.load(node.path);
                        }
                    },
                    fileDropHandler: function(path, files) {
                        if(files.length == 0) {
                            return;
                        }

                        var data = new FormData();
                        data.append('path', path);

                        for(var i = 0; i < files.length; i++) {
                            var fileExtension = files[i].name.split('.').pop();

                            if (fileExtension != 'wav' && fileExtension != 'mp3') {
                                $.notify(messages["model.sound.error.extension"], {
                                    className: "error",
                                    position: "right bottom"
                                });
                                return;
                            }

                            data.append('files', files[i]);
                        }

                        var self = this;
                        $.ajax({
                            url: contextPath + "wav/uploadFiles",
                            type: "POST",
                            data: data,
                            cashe: false,
                            processData: false,
                            contentType: false,
                            success: function (data) {
                                self.load();
                            }
                        });
                    },
                    load: function(callback){
                        var self = this;
                        $.post(contextPath + "wav/tree", function(data) {
                            self.childs(data);
                            if(callback){
                                callback();
                            }
                        });
                    },
                    rename: function(path, newName){
                        var self = this;
                        $.post(contextPath + "wav/rename", { path: path, newName: newName }, function() {
                            self.load();
                        });
                    },
                    delete: function(path){
                        if(confirm(messages["ru.sipivr.sound.ui.delete.fileConfirm"])){
                            var self = this;
                            $.post(contextPath + "wav/delete", { path: path }, function() {
                                self.load();
                            });
                        }
                    },
                }

                $(function() {
                    tree.load(function() {
                        ko.applyBindings(tree, document.getElementById("wav-tree"));
                    });
                });
            });
        </script>
    </tiles:putAttribute>
</tiles:insertDefinition>