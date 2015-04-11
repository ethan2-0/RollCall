/**
 * Copyright (c) 2015 Ethan White. All rights reserved.
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 *   1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 *   2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation
 *      and/or other materials provided with the distribution.
 *   3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
$("div.yesno").each(function() {
    var elm = $(this); //It seems more semantic to me
    elm[0].setAttribute("checked", elm[0].getAttribute("checked") == "true" ? "true" : "false");
    var width = parseInt(elm.attr("width")) || 50;
    elm.css("width", width).css("height", width);
    var inactiveColor = "rgb(216, 39, 83)";
    var activeColor = "green";
    function getColor() {
        return elm[0].getAttribute("checked") == "true" ? activeColor : inactiveColor;
    }
    elm.css("background-color", getColor())
        .css("transition", "background-color 1s")
        .css("border-radius", "4px")
        .on("click", function() {
            elm[0].setAttribute("checked", elm[0].getAttribute("checked") == "true" ? "false" : "true");
            elm.css("background-color", getColor());
        });
});
$(".scrollto").each(function() {
    $(this).on("click", function() {
        $($(this).attr("elm")).velocity("scroll", {
            duration: 1000,
            easing: "ease-in-out"
        });
    });
});
$(".loading-icon").each(function() {
    var getNewColor = function() {
        var red = Math.floor(Math.random() * 255);
        var blue = Math.floor(Math.random() * 255);
        var green = Math.floor(Math.random() * 255);
        return "rgb(" + red + ", " + green + ", " + blue + ")";
    }
    $(this).css("height", "20px").css("border-radius", "20px").css("width", "20px").css("overflow", "hidden");
    var part0 = $("<div>").attr("data-index", "0").addClass("loading-0")
        .css("background-color", "black").css("transition-name", "all")
        .css("transition-duration", "0.8s").css("transition-timing-function", "linear");
    var part1 = $("<div>").attr("data-index", "1").addClass("loading-1").css("height", "20px").css("transition-name", "all")
        .css("transition-duration", "0.8s").css("transition-timing-function", "linear");
    $(this).append(part0);
    $(this).append(part1);
    var topCovers = false;
    var updateOnce = function() {
        if(!topCovers) {
            part0.css("height", "20px");
            part0.css("background-color", getNewColor());
        } else {
            part0.css("height", "0px");
            part1.css("background-color", getNewColor());
        }
        topCovers = !topCovers;
        setTimeout(updateOnce, 800);
    }
    updateOnce();
});