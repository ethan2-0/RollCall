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
//This file is for first-time setup
//It is loaded async as needed.
var setup = (function() {
    var currentIndex = 0;
    //next() as used here will be defined below.
    function btnNext() {
        $("#setup-next").one("click", next).removeClass("disabled");
    }
    function btnDisable() {
        $("#setup-next").addClass("disabled");
    }
    function loadPage(name) {
        $(".setup-page").hide();
        $("#setup-page-" + name).show();
    }
    function nextText(text) {
        $("#setup-next").html(text);
    }
    var stages = [
        function() {
            loadPage("start");
            btnNext();
        },
        function() {
            loadPage("access-mic");
            btnNext();
        },
        function() {
            //Save the permission prefs
            console.log($("#video-yesno").attr("checked"));
            localStorage.setItem("peer_permissions", JSON.stringify({
                video: $("#video-yesno").attr("checked") == "checked",
                audio: $("#audio-yesno").attr("checked") == "checked",
                notification: $("#notification-yesno").attr("checked") == "checked"
            }));

            //Do the next stuff
            loadPage("access-confirm");
            nextText("Finish");
            btnNext();
        },
        function() {
            localStorage.setItem("peer_setupDone", "0");
            window.location.href = window.location.href;
        }
    ];
    function getIndex() {
        return currentIndex;
    }
    function next() {
        try {
            stages[currentIndex++]();
        } catch(e) {
            return function() {
                console.log("I think I reached the end of first-time setup.");
            }
        }
    }
    return {
        getIndex: getIndex,
        next: next
    }
})();
$("#setup").show();
$(".setup-page")
    .hide();

setup.next();