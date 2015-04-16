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
unprefix(document, "hidden");
//Firebase is defined in helper.js.
var userRef = firebase.child("users").child(username);
var activeUser = ""; //The viewed user
var activeId = "will be populated later (in core.js); this is OUR id";
var incomingCallAudio = new Audio("IncomingCall2.wav");
var messageAudio = new Audio("message2.wav");
// $("#dialog").hide();
$("#btn-call").hide()
    .on("click", function() {
        loading();
        firebase.child("users").child(encodeUsername(activeUser)).once("value", function(snapshot) {
            stopLoading();
            var theirId = snapshot.child("active-id").val();
            call(theirId);
        });
    });

function updateActiveIdInFb() {
    userRef.child("active-id").set(activeId);
}

function forceSetup() {
    localStorage.setItem("peer_setupDone", 0);
}
$.fn.transitionHtmlTo = function(val) {
    var rep = $(this).clone();
    var offset = $(this).offset();

    var direction = ["right", "top", "bottom"][Math.floor(Math.random() * 3)];

    var posX = offset.left;
    var posY = offset.top;
    if (direction == "left") {
        posX = -$(this).width();
    } else if (direction == "right") {
        posX = window.innerWidth;
    } else if (direction == "top") {
        posY = -$(this).height();
    } else {
        posY = window.innerHeight;
    }

    rep.css("position", "absolute")
        .css("left", posX)
        .css("top", posY);
    rep.html(val);
    $(document.body).append(rep);
    var thiz = this;
    $(thiz).velocity({
        opacity: 0
    }, 400, function() {
        $(thiz).css("opacity", 1);
        $(thiz).html(val);
    });
    rep.velocity({
        top: offset.top,
        left: offset.left
    }, 400, function() {
        rep.remove();
    });
}
$.fn.expr = function(expr, fn) {
    if (typeof(expr) == "function") {
        if (expr()) {
            fn(this);
        }
    } else {
        if (expr) {
            fn(this);
        }
    }
}
$.fn.transitionTo = function(elm) {
    var rep = $(this).clone().html("").append(elm);
    var offset = $(this).offset();

    var direction = ["right", "top", "bottom"][Math.floor(Math.random() * 3)];

    var posX = offset.left;
    var posY = offset.top;
    if (direction == "left") {
        posX = -$(this).width();
    } else if (direction == "right") {
        posX = window.innerWidth;
    } else if (direction == "top") {
        posY = -$(this).height();
    } else {
        posY = window.innerHeight;
    }

    rep.css("position", "absolute")
        .css("left", posX)
        .css("top", posY);
    $(document.body).append(rep);
    var thiz = this;
    $(thiz).velocity({
        opacity: 0
    }, 300, function() {
        $(thiz).css("opacity", 1);
        $(thiz).html("").append(elm);
    });
    rep.velocity({
        top: offset.top,
        left: offset.left
    }, 300, function() {
        rep.remove();
    });
}
var prevOnline = false;

function updateButtons(online) {
    if (online && !prevOnline) {
        $("#btn-call").css("opacity", 0)
            .css("position", "absolute");
        $("#btn-ignore")
            .css("margin-left", 0)
            .velocity({
                "margin-left": $("#btn-call").width() + 30
            }, 275, function() {
                $(this).css("margin-left", 0);
                $("#btn-call")
                    .css("position", "static")
                    .show()
                    .velocity({
                        opacity: 1
                    }, 125);
            });
    } else if (!online && prevOnline) {
        $("#btn-call")
            .show()
            .velocity({
                opacity: 0
            }, 275, function() {
                $("#btn-call").hide();
                $("#btn-ignore")
                    .css("margin-left", $("#btn-call").width() + 30)
                    .velocity({
                        "margin-left": 0
                    }, 125, function() {
                        //Do nothing
                    });
            })
    }
    prevOnline = online;
}

function updateOnline(online) {
    online = true; //TODO: This is a hack.
    $("#home-status").transitionTo($("<div>").addClass("status").addClass(online ? "status-online" : "status-offline"));
    updateButtons(online);
}

function requestCallAnswer(callback) {
    if(document.hidden) {
        showNotification("Incoming call", "You're getting called.");
    }
    var incomingCallFunc = function() {
        incomingCallAudio.play();
    }
    var intervalId = setInterval(incomingCallFunc, 2000);
    incomingCallFunc();
    bootbox.dialog({
        title: "You're getting a call.",
        message: "Answer it?",
        buttons: {
            yes: {
                label: "Sure thing!",
                className: "btn-primary",
                callback: function() {
                    callback();
                    loadLayer("call");
                    $("#their-video").hide();
                    clearInterval(intervalId);
                }
            },
            no: {
                className: "btn-link btn-none",
                label: "No thanks.",
                callback: function() {
                    //TODO: Let the other guy know we just rejected their call.
                    clearInterval(intervalId);
                }
            }
        }
    });
}
var _firstTime = true;
function loadDetails(username) {
    if(!_firstTime) {
        loading();
    } else {
        _firstTime = false;
    }
    firebase.child("users").child(encodeUsername(username)).once("value", function(snapshot) {
        stopLoading();
        $("#home-name").transitionTo($("<span>").html(username));
        var online = false;
        if(getUnixTimestamp() - snapshot.child("last-online").val() < 9) {
            online = true;
        }
        updateOnline(online);
    });
}

function reposition() {
    // $(".screen-width").css("width", window.innerWidth);
    // $(".screen-height").css("height", window.innerHeight);
}
$(window).on("resize", reposition);
reposition();

function repositionActiveBox() {
    var elm = $(".selectable-active");
    if (elm.length >= 1) {
        var offset = elm.offset();
        var height = elm.height();
        $("#active-box").css("left", offset.left - $("#active-box").width() - 3)
            .css("top", offset.top)
            .css("height", height);
    }
}

function regenerateSelectables() {
    $(".selectable").on("click", function() {
        $(".selectable-active").removeClass("selectable-active");
        $(this).addClass("selectable-active");
        $(this).trigger("x-selected");
        repositionActiveBox();
    });
    repositionActiveBox();
}
regenerateSelectables();

username = urlObj.parameters["username"];
var callee = "*"; //That shouldn't be anyone's username
theirVideo = $("#their-video")[0];
$("#my-name").html(username);

var activeLayer = $("#home-layer");

function loadLayer(name, ignoreWarnings) {
    var doIt = function() {
        var elm = $("#" + name + "-layer");
        activeLayer.velocity("fadeOut");
        elm.velocity("fadeIn");
        activeLayer = elm;
        if (name == "home") {
            $("#active-box").show();
        } else {
            $("#active-box").hide();
        }
    }
    if(activeLayer.attr("id").indexOf("call") != -1 && !ignoreWarnings) {
        //TODO: Make this more OO/configurable.
        bootbox.dialog({
            message: "This will hang up on the call.",
            title: "Are you sure?",
            buttons: {
                yes: {
                    label: "Yes",
                    className: "btn-primary",
                    callback: function() {
                        doIt();
                    }
                },
                no: {
                    className: "btn-link btn-none",
                    label: "No",
                    callback: function() {
                        //Do nothing
                    }
                }
            }
        });
    } else {
        doIt();
    }
}
$(".layer").hide();
loadLayer("home");

function call(person) {
    callee = person;
    $("#their-name").html(callee);
    loadLayer("call");
    $("#their-video").hide();
    core_beginCall(person);
}

function addMessage(sender, message, animate) {
    if (animate == null || animate == undefined) {
        animate = false;
    }
    var div = $("<div>")
        .addClass("chat-message")
        .append($("<span>")
            .addClass("chat-message-sender")
            .html(sender))
        .append($("<span>")
            .addClass("chat-message-content")
            .html(message));
    div.css("opacity", 0);
    $("#home-chat").append(div);
    div.css("margin-top", -div.height())
    div.velocity({
        opacity: 1,
        "margin-top": 0
    }, animate ? 400 : 0, function() {
        $("#home-chat").css("bottom", 5);
    });
}

function getUnixTimestamp() {
    return Date.now() / 1000 | 0;
}
/*setInterval(function() {
    firebase.child("users").child(username).child("last-online").set(getUnixTimestamp());
    //Poll the online status of the current user.
    //Optimization: Use a .on event handler and store the last time it's triggered in a variable; then occasionally poll that variable.
    var prevOnline = $("#home-status").find(".status").attr("class").indexOf("online") >= 0;
    firebase.child("users").child(encodeUsername(activeUser)).child("last-online").once("value", function(snapshot) {
        var online = getUnixTimestamp() - snapshot.val() < 9;
        if (online != prevOnline) {
            updateOnline(online);
        }
    });
}, 7000);*/

function rf(func, params) {
    return func(params);
}
function generateSidebar(usernameListCallback) {
    userRef.once("value", function(snapshot) {
        var children = snapshot.child("friends").val();
        //Get the active item.
        var activeName = children[0];
        {
            var elm = $(".selectable-active");
            if (elm.find) {
                var aN = elm.find(".data-name").html();
                if (aN != "" && aN) {
                    activeName = aN;
                }
            }
        }
        activeUser = activeName;
        $("#username-list").empty();
        for (index in children) {
            var child = children[index];
            var elm = $("<div>")
                .addClass("better-list-item")
                .addClass("selectable")
                .append($("<span>")
                    .addClass("data-name")
                    .html(decodeUsername(child)))
                .appendTo($("#username-list"))
                .on("x-selected", function() {
                    loadDetails($(this).find(".data-name").html());
                    activeUser = $(".selectable-active").find(".data-name").html();
                    console.log("updating chat");
                    updateChat();
                });
            if (child == activeName) {
                elm.addClass("selectable-active");
            }
        }
        //TODO: Delete friends
        $("#username-list").append($("<div>")
            .addClass("better-list-item")
            .append($("<span>")
                .html("Add a friend...")
                .addClass("left-sidebar-faded"))
            .on("click", function() {
                //TODO: Use my special button that is just the text until hover.
                bootbox.prompt("What's their name?", function(result) {
                    if(result == null) {
                        return;
                    }
                    loading();
                    firebase.child("users").child(username).child("friends").once("value", function(snapshot) {
                        stopLoading();
                        var newList = snapshot.val();
                        newList.push(encodeUsername(result));
                        firebase.child("users").child(username).child("friends").set(newList);
                        generateSidebar();
                    });
                });
            }));
        regenerateSelectables();
        if (usernameListCallback) {
            usernameListCallback(children);
        }
    });
}
$(function() {
    generateSidebar();
    $("#username-list").hide().velocity("fadeIn");
});
userRef.child("friends").once("value", function(snapshot) {
    var friends = snapshot.val();
    if (friends.length > 0 && friends != null) {
        //Select the first friend.
        loadDetails(friends[0]);
    } else {
        alert("You have no friends...");
    }
});
function requestNotificationAccess() {
    if (!("Notification" in window)) {
        console.log("WARNING: No notifications support.");
    } else if (Notification.permission == "granted") {
        //We can create notifications as we wish
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function(permission) {
            if (permission === "granted") {
                
            }
        });
    }
}
requestNotificationAccess();
function showNotification(title, value) {
    if (accessRequest.notification == true && "Notification" in window && Notification.permission == "granted") {
        var notification = new Notification(title, {
            body: value
        });
    }
}
function validateEmail(email) {
    return /...+\@...+\...+/.test(email);
}
function dealWithHangUp() {
    console.log("got hang up");
    loadLayer("home", true);
}
$("#hang-up").on("click", function() {
    window.currentCall.close();
});
//This is just a useful debug feature
$(window).on("keypress", function(evt) {
    if(evt.key == "F4") {
        var nodes = [];
        var elms = document.getElementsByTagName("link");
        for(var key in elms) {
            var element = elms[key];
            if(element.rel == "stylesheet") {
                nodes.push(element);
            }
        }
        nodes.forEach(function(node) {
            var href = node.href;
            if(/.*nocache.*/.test(href)) {
                href = href.substr(0, href.lastIndexOf("?"));
                console.log(href);
            }
            href += "?nocache=" + Math.floor(Math.random() * 100000);
            var newNode = $("<link>")
                .attr("type", "text/css")
                .attr("rel", "stylesheet")
                .attr("href", href);
            $(node).remove();
            $(document.head).append(newNode);
        });
    }
});
function loading() {
    $("#the-loading-icon").velocity("fadeIn");
}
function stopLoading() {
    $("#the-loading-icon").velocity("fadeOut");
}