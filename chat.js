//BigInt.js from http://www.leemon.com/crypto/BigInt.html
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
var keyCache = {};
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
    }
});
var handle = function(snapshot) {
    try {
        $("#chat-messages").empty();
        var val = snapshot.val();
        for(var key in val) {
            //For now, we're not worrying about any RSA stuff; that comes later.
            var entry = val[key];
            var from = entry["from"];
            var msgEnc = entry["msg"];
            //Decrypt the message
            var key = rsa.decryptAESKey(entry["key"]);
            var msg = aes.decrypt(msgEnc, key);
            $("#chat-messages").append($("<div>")
                .addClass("chat-message")
                .append($("<span>")
                    .addClass("chat-message-sender")
                    .html(decodeUsername(from)))
                .append($("<span>")
                    .addClass("chat-message-content")
                    .html(msg)))
        }
    } catch(e) {
        console.log(e);
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