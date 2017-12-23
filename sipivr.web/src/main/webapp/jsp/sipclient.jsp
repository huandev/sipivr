<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<style>
    #sipclient .phone { width: 150px; position:fixed; z-index: 1000; right:10px; bottom: 10px; }
    #sipclient .phone input { width: 131px; margin:4px; font-size: 16px; }
    #sipclient .phone button { width: 145px; height: 28px; margin:2px; font-size: 20px; padding:0; line-height: 22px;
                                border-radius: 0;}

    #sipclient .dialer { width: 150px; height: 160px; }
    #sipclient .dialer > div { float:left; width:48px; height: 38px; line-height: 38px;
                    background: #fff;
                    text-align:center; cursor: pointer;
        border:1px solid #ccc;
        /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#ffffff+0,e0e0e0+100 */
        background: #ffffff; /* Old browsers */
        background: -moz-linear-gradient(top, #ffffff 0%, #e0e0e0 100%); /* FF3.6+ */
        background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#ffffff), color-stop(100%,#e0e0e0)); /* Chrome,Safari4+ */
        background: -webkit-linear-gradient(top, #ffffff 0%,#e0e0e0 100%); /* Chrome10+,Safari5.1+ */
        background: -o-linear-gradient(top, #ffffff 0%,#e0e0e0 100%); /* Opera 11.10+ */
        background: -ms-linear-gradient(top, #ffffff 0%,#e0e0e0 100%); /* IE10+ */
        background: linear-gradient(to bottom, #ffffff 0%,#e0e0e0 100%); /* W3C */
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='#e0e0e0',GradientType=0 ); /* IE6-9 */}

    #sipclient .dialer > div:active {
        /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#ffffff+0,e0e0e0+100 */
        background: #f0f0f0; /* Old browsers */
        background: -moz-linear-gradient(top, #f0f0f0 0%, #d0d0d0 100%); /* FF3.6+ */
        background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#f0f0f0), color-stop(100%,#d0d0d0)); /* Chrome,Safari4+ */
        background: -webkit-linear-gradient(top, #f0f0f0 0%,#d0d0d0 100%); /* Chrome10+,Safari5.1+ */
        background: -o-linear-gradient(top, #f0f0f0 0%,#d0d0d0 100%); /* Opera 11.10+ */
        background: -ms-linear-gradient(top, #f0f0f0 0%,#d0d0d0 100%); /* IE10+ */
        background: linear-gradient(to bottom, #f0f0f0 0%,#d0d0d0 100%); /* W3C */
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f0f0f0', endColorstr='#d0d0d0',GradientType=0 ); /* IE6-9 */
    }
</style>

<audio id="sipclient-audio" autoplay="autoplay"></audio>

<div id="sipclient" style="display: none;" data-bind="visible: true">
    <div class="phone" style="display:none;" data-bind="visible: visible">
        <div>
            <input type="text" data-bind="value: number"/>
        </div>
        <div class="dialer" data-bind="foreach: [1,2,3,4,5,6,7,8,9,'*',0, '#']">
            <div data-bind="text: $data, click: function(){ $root.onDigitClick($data); }"></div>
        </div>
        <!-- ko if: $data.currentCall() -->
        <button class="red" data-bind="click: function() { currentCall().session.terminate(); }">
            <span data-bind="text: currentCall().duration"></span>
            <span class="icon-phone-squared"></span>
        </button>
        <!-- /ko -->
        <!-- ko if: !$data.currentCall() -->
        <button class="green icon-phone-squared" data-bind="enable: connected(), click: function() { makeCall(number()); }"></button>
        <!-- /ko -->
    </div>
</div>

<script type="text/javascript">
    $(function() {
        require(["knockout", "widgets/sipclient"], function (ko, sipclient) {
            ko.applyBindings(sipclient, document.getElementById("sipclient"));
        });
    });
</script>