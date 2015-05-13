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
if(typeof(firebase) == "undefined" && (typeof(loginCreateFb) == "undefined" || loginCreateFb)) {
    var firebase = new Firebase(localStorage.getItem("peer_isTesting") == "yes" ? "https://ew-gdocsclone.firebaseio.com/" : "https://cedi.firebaseio.com/");
}
function encodeUsername(email) {
    return encodeURIComponent(email.replace(/\./g, ":"));
}
function decodeUsername(email) {
    return unescape(email).replace(/:/g, ".");
}
var login = (function() {
    function createUser(email, password, callback) {
        $("#status").html("Creating user...");
        firebase.createUser({
            email: email,
            password: password
        }, function(error, userData) {
            if(error) {
                if(callback != null && callback != undefined) {
                    callback({
                        type: "fail",
                        data: error
                    });
                }
                return console.warn("Error in createUser:", error); //We can return it since it returns undefined, and shorter. (Of course, this comment is longer.)
            }
            //Yay! We've created the e-mail user.
            //TODO: [Minor Optimization] Do these (createUser/firebase access) in paralell instead of one after another.
            console.log(email);
            console.log(encodeURIComponent(email.replace(/\./g, ":")));
            firebase.child("users").child(encodeUsername(email)).set({
                placeholder: "My goal in life is to make sure my parent element exists. I have served my purpose. Yay me!",
                friends: {
                    0: "PLACEHOLDER" //TODO: Make this not a placeholder.
                },
                setupParams: "not_done"
            });
            if(callback != null && callback != undefined) {
                callback({
                    type: "success",
                    data: userData
                });
            }
        });
    }
    function login(email, password, callback) {
        firebase.authWithPassword({
            email: email,
            password: password
        }, function(error, authData) {
            //Minor optimization: Make this parallel to authWithPassword
            if(error) {
                if(callback != null && callback != undefined) {
                    callback({
                        type: "fail",
                        data: error
                    })
                };
                return console.warn("Error in login:", error); //Same thing as above: returns undefined.
            }
            firebase.child("users").child(encodeUsername(email)).once("value", function(snapshot) {
                try {
                    localStorage.setItem("peer_passwordHash", hash.sha512.multiple("password", 32).data)
                    var setupParams = snapshot.child("setupParams").val();
                    if(typeof setupParams == "string" || typeof setupParams == "undefined" || setupParams == null) {
                        console.log("Will need setup.");
                        localStorage.removeItem("peer_setupDone");
                    } else {
                        localStorage.setItem("peer_permissions", JSON.stringify(setupParams["permissions"]));
                    }
                } catch(e) {
                    console.log(e);
                }
                if(callback != null && callback != undefined) {
                    callback({
                        type: "success",
                        rawData: authData,
                        data: {
                            uid: authData.uid,
                            email: email
                        }
                    });
                }
            });
        });
    }
    function logout(email) {
        firebase.unauth();
    }
    function getUser() {
        var auth = firebase.getAuth();
        return {
            email: auth.password.email,
            uid: auth.uid,
            expires: auth.expires
        };
    }
    function getEmail() {
        return getUser().email;
    }
    return {
        createUser: createUser,
        login: login,
        logout: logout,
        getUser: getUser,
        getEmail: getEmail
    };
})();