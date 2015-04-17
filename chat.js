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
//BigInt.js from http://www.leemon.com/crypto/BigInt.html
var keyCache = {};
var prevChatLength = 0;
var _firstChatGet = true;
var expectingUpdate = false;
$("#chat-message").keyup(function(e) {
    if (e.keyCode == 13) {
        var thiz = this;
        var doNext = function(publickey) {
            publickey = rsa.unstringifyPublicKey(publickey);
            //Get a new AES key
            var key = aes.getKey();
            //Encrypt it with RSA
            var encryptedKey = rsa.encryptAESKey(key, publickey);
            //Encrypt the message with AES
            var encrypted = aes.encrypt(thiz.value, key);
            var chat = firebase.child("users").child(encodeUsername(activeUser)).child("chat").child(username);
            chat.child(new Date().getTime() + "").set({
                msg: encrypted,
                from: username,
                key: encryptedKey
            });
            thiz.value = "";
        }
        if(typeof(keyCache[activeUser]) == "undefined") {
            //Get their public key
            firebase.child("users").child(encodeUsername(activeUser)).child("rsa").once("value", function(snapshot) {
                var val = snapshot.val();
                keyCache[activeUser] = val;
                doNext(val);
            });
        } else {
            doNext(keyCache[activeUser]);
        }
        (function() {            
            var key = aes.getKey();
            //Encrypt it with RSA
            var encryptedKey = rsa.encryptAESKey(key, rsa.keypair);
            //Encrypt the message with AES
            var encrypted = aes.encrypt(thiz.value, key);
            var chat = firebase.child("users").child(username).child("chat").child(encodeUsername(activeUser));
            expectingUpdate = true;
            chat.child(new Date().getTime() + "").set({
                msg: encrypted,
                from: username,
                key: encryptedKey
            });
        })();
    }
});
function pause() {
    try {
        throw "This is just to make the VM update the UI.";
    } catch(e) {
        //Do nothing
    }
}
var messageCache = {};
var handle = function(snapshot) {
    try {
        $("#chat-messages").empty();
        var val = snapshot.val();
        var length = 0;
        var index = 0;
        var keys = [];
        for(var key in val) {
            keys.push(key);
        }
        keys.reverse();
        function doNext() {
            if(index >= keys.length) {
                if(!_firstChatGet && document.hidden && prevChatLength != length) {
                    messageAudio.play();
                    showNotification("Message", "From " + activeUser);
                } else if(_firstChatGet) {
                    _firstChatGet = false;
                }
                prevChatLength = length;
            } else {
                var key = keys[index++];
                length++;
                //For now, we're not worrying about any RSA stuff; that comes later.
                var entry = val[key];
                var from = entry["from"];
                var msgEnc = entry["msg"];
                var msgHash = sha1(msgEnc.data);
                var msg;
                if(typeof messageCache[msgHash] == "undefined") {
                    //Decrypt the message
                    pause();
                    var key = rsa.decryptAESKey(entry["key"]);
                    pause();
                    msg = aes.decrypt(msgEnc, key);
                    pause();
                    messageCache[msgHash] = msg;
                    setTimeout(doNext, 8);
                } else {
                    msg = messageCache[msgHash];
                    setTimeout(doNext, 1);
                }
                $("#chat-messages").append($("<div>")
                    .addClass("chat-message")
                    .append($("<span>")
                        .addClass("chat-message-sender")
                        .html(decodeUsername(from)))
                    .append($("<span>")
                        .addClass("chat-message-content")
                        .html(msg)))[0];
            }
        }
        doNext();
    } catch(e) {
        console.log(e);
        throw e;
    }
}
var handlerFb = null;
function updateChat() {
    //#chat-messages
    //.chat-message
    if(handlerFb != null) {
        handlerFb.off("value", handle);
    }
    handlerFb = firebase.child("users").child(username).child("chat").child(encodeUsername(activeUser));
    handlerFb.on("value", handle);
}