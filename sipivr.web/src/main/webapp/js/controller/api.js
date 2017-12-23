define(["messages"], function(messages) {
    var controller = {
        ajaxPost: function (url, data, success, error) {
            $.ajax({
                type: "POST",
                url: contextPath + url,
                data: data,
                success: success,
                error: error
            });
        },
        notifySuccess: function(){
            $.notify("<i class='icon-ok'></i> " + messages["ui.done"], {className: "base", position: "right bottom"});
        },

        campaigns: function(success)
        {
            controller.ajaxPost("api/campaigns", null, success);
        },
        changePassword: function(newPassword, oldPassword, success) {
            controller.ajaxPost("api/changePassword", { newPassword: newPassword, oldPassword: oldPassword }, success);
        },
        saveCampaign: function(model, success)
        {
            controller.ajaxPost("api/saveCampaign", model, function (data) {
                success(data);
                controller.notifySuccess();
            });
        },
        saveUser: function(model, success)
        {
            controller.ajaxPost("api/saveUser", model, function (data) {
                success(data);
                controller.notifySuccess();
            });
        },
        users: function(success)
        {
            controller.ajaxPost("api/users", null, success);
        }
    };

    return controller;
});