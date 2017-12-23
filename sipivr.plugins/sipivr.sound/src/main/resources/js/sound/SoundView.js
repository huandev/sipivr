define(["knockout", "messages", "widgets/sipclient", "controller/api", "widgets/MediaPlayerView", "widgets/TableSeach"],
    function(ko, messages, sipclient, api, MediaPlayer, TableSeach){
        var model = new TableSeach({
            save: function (data, success) {
                api.ajaxPost("sound/update", data, success);
            },
            remove: function(data, success){
                api.ajaxPost("sound/remove/" + data.id, null, success);
            },
            search: function (data, success) {
                if(data.model.createDate){
                    data.model.createDate += " 00:00:00.000";
                }
                $.ajax({
                    url: contextPath + "sound/search",
                    data: ko.toJSON(data),
                    type: "POST",
                    contentType: 'application/json',
                    success: success
                });
            },
            filter: {
                model: {
                    createDate: null,
                    ownerId: null,
                    name: null,
                    description: null
                },
                pageSize: 50,
                sortField: "createDate",
                sortType: "Asc"
            }
        });

        model.users = ko.observableArray();
        api.users(model.users);

        model.fileDropHandler = function(files, sound) {
            var data = new FormData();

            if(sound && files.length == 1){
                var fileExtension = files[0].name.split('.').pop();

                if(fileExtension != 'wav' && fileExtension != 'mp3') {
                    $.notify(messages["model.sound.error.extension"], { className: "error", position: "right bottom" });
                    return;
                }
                data.append('file', files[0]);

                $.ajax({
                    url: contextPath + "sound/updateFile/" + sound.id,
                    type: "POST",
                    data: data,
                    cashe: false,
                    processData: false,
                    contentType: false,
                    success: function(data){
                        api.notifySuccess();
                    }
                });
            } else {
                for (var i = 0; i < files.length; i++) {
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

                $.ajax({
                    url: contextPath + "sound/save",
                    type: "POST",
                    data: data,
                    cashe: false,
                    processData: false,
                    contentType: false,
                    success: function(data){
                        ko.utils.arrayForEach(data, function (item) {
                            model.push(item);
                        });
                        api.notifySuccess();
                    }
                });
            }
        }

        model.mediaPlayer = MediaPlayer;

        model.getSrc = function(sound){
            return contextPath + "sound/play/" + sound.id;
        }

        model.mediaPlayerClick = function (src, event) {
            if(this.mediaPlayer.src() == src) {
                this.mediaPlayer.click(event);
            }
        }

        model.sipclient = sipclient;

        model.recordNew = function(){
            $.post(contextPath + "record/quick", null, function(sound){
                model.record(model.push(sound));
            });
        }
        model.record = function(sound) {
            var self = this;

            var call = sipclient.makeCall("record", {
                ended: function () {
                    if(call.id) {
                        $.post(contextPath + "record/refresh", { soundId: sound.id, uuid: call.id });
                    }
                }
            });
        }

        model.selectMode = ko.observable(false);
        model.selectMode.subscribe(function(newValue){
            if(newValue) {
                model.search();
            }
        });

        model.select = null;

        return model;
    });