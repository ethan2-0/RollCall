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
if(typeof(firebase) == "undefined" && (typeof(loginCreateFb) == "undefined" || loginCreateFb)) {
    firebase = new Firebase("https://cedi.firebaseio.com/");
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
                    0: "ethan" //Placeholder. TODO: Make this not ethan.
                }
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
            if(error) {
                if(callback != null && callback != undefined) {
                    callback({
                        type: "fail",
                        data: error
                    })
                };
                return console.warn("Error in login:", error); //Same thing as above: returns undefined, same as this func.
            }
            try {
                localStorage.setItem("peer_passwordHash", hash.sha512.multiple("password", 32).data)
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