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
            var permObj = {
                video: $("#video-yesno").attr("checked") == "checked",
                audio: $("#audio-yesno").attr("checked") == "checked",
                notification: $("#notification-yesno").attr("checked") == "checked"
            };
            localStorage.setItem("peer_permissions", JSON.stringify(permObj));
            // firebase.child("users").child(username).child(setupParams).set({});
            firebase.child("users").child(username).child("setupParams").child("permissions").set(permObj);

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