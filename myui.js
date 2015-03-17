/*
 * RollCall: Peer-to-peer communications and encrypted messaging in HTML5
 * Copyright (C) 2015 Ethan White.
 * 
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation, version 2; no
 * other versions or revisions may be used under any circumstances.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program, likely available in license.txt; if not, write to the
 * Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
 * Boston, MA  02110-1301, USA.
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
            easing: "easeOutQuad"
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
    var test = function() {
        if(!topCovers) {
            part0.css("height", "20px");
            part0.css("background-color", getNewColor());
        } else {
            part0.css("height", "0px");
            part1.css("background-color", getNewColor());
        }
        topCovers = !topCovers;
        setTimeout(test, 800);
    }
    test();
});