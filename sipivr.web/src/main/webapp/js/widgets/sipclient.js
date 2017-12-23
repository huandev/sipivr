define(["knockout", "utils/lang/int", "libs/jssip/jssip-0.7.11.min"], function(ko, langInt, JsSIP) {
    function SipClient() {
        this.ip = document.location.hostname;
        this.ssl = document.location.protocol == "https:";

        JsSIP.UA.call(this, {
            ws_servers: (this.ssl ? "wss" : "ws") + "://" + this.ip + ":" + 5066,
            uri: "sip:guest@" + this.ip,
            register: false
        });

        this.number = ko.observable("");
        this.connected = ko.observable(false);
        this.currentCall = ko.observable();
        this.visible = ko.observable(false);

        var self = this;
        this.on('connected', function (e) {
            console.log("connected");
            self.connected(true);
        });
        this.on('disconnected', function (e) {
            console.log("disconnected");
            self.connected(false);
        });
        this.on('newRTCSession', function (e) {
            console.log("newRTCSession");
            console.log(arguments);
        });

        this.start();
    };

    SipClient.prototype = Object.create(JsSIP.UA.prototype);

    SipClient.prototype.makeCall = function (number, eventHandlers) {
        console.log("makeCall " + number);
        this.number(number);

        var self = this;
        var interval = null;
        // Register callbacks to desired call events
        var callEventHandlers = {
            'accepted': function (e) {
                console.log({method: 'accepted', arguments: arguments });

                self.currentCall().timestamp = new Date();
                self.currentCall().id = e.response.call_id;

                interval = setInterval(function(){
                    var diff = Math.round((new Date().valueOf() - self.currentCall().timestamp.valueOf()) / 1000);
                    var s = langInt.addLeadingZeros(diff % 60, 2);
                    var m = langInt.addLeadingZeros(Math.round(diff / 60) % 60, 2);
                    self.currentCall().duration(m + ":" + s);
                }, 100);
            },
            'connecting': function (e) {
                console.log({method: 'connecting', arguments: arguments });
            },
            'progress': function (e) {
                console.log({method: 'progress', arguments: arguments });
            },
            'failed': function (e) {
                console.log({method: 'failed', arguments: arguments });

                if(self.currentCall()) {
                    clearInterval(interval);
                    self.currentCall(null);
                }
            },
            'ended': function (e) {
                console.log({method: 'ended', arguments: arguments });

                if(self.currentCall()) {
                    clearInterval(interval);
                    self.currentCall(null);
                }
                if(eventHandlers && eventHandlers["ended"]){
                    eventHandlers["ended"]();
                }
            },
            'update': function (e) {
                console.log({method: 'update', arguments: arguments });
                console.log(arguments);
            },
            'confirmed': function (e) {
                console.log({method: 'confirmed', arguments: arguments });
            },
            'addstream': function (e) {
                console.log({method: 'addstream', arguments: arguments });

                document.getElementById('sipclient-audio').src = window.URL.createObjectURL(e.stream);
            }
        };

        var session = this.call("sip:" + number + '@' + this.ip, {
            'eventHandlers': callEventHandlers,
            'extraHeaders': ['X-Foo: foo', 'X-Bar: bar'],
            'mediaConstraints': {'audio': true, 'video': false}
        });

        self.currentCall({ timestamp: null, number: number, duration: ko.observable("--:--"), session: session, id: null });

        return self.currentCall();
    }

    SipClient.prototype.onDigitClick = function (digit) {
        if (this.currentCall()) {
            this.currentCall().session.sendDTMF(digit);
        }
        this.number(this.number() + digit);
    };

    return new SipClient();
});