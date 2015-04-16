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
var firebase = new Firebase(localStorage.getItem("peer_isTesting") == "yes" ? "https://ew-gdocsclone.firebaseio.com/" : "https://cedi.firebaseio.com/");
var run = true;
var audio = false;

function inst(obj, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14, arg16, arg16) {
    return new obj(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14, arg16, arg16);
}
function $defined(obj) {
    return obj !== undefined;
}
// Production steps of ECMA-262, Edition 5, 15.4.4.14
// Reference: http://es5.github.io/#x15.4.4.14
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement, fromIndex) {

        var k;

        // 1. Let O be the result of calling ToObject passing
        //    the this value as the argument.
        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }

        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get
        //    internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If len is 0, return -1.
        if (len === 0) {
            return -1;
        }

        // 5. If argument fromIndex was passed let n be
        //    ToInteger(fromIndex); else let n be 0.
        var n = +fromIndex || 0;

        if (Math.abs(n) === Infinity) {
            n = 0;
        }

        // 6. If n >= len, return -1.
        if (n >= len) {
            return -1;
        }

        // 7. If n >= 0, then Let k be n.
        // 8. Else, n<0, Let k be len - abs(n).
        //    If k is less than 0, then let k be 0.
        k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        // 9. Repeat, while k < len
        while (k < len) {
            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the
            //    HasProperty internal method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            //    i.  Let elementK be the result of calling the Get
            //        internal method of O with the argument ToString(k).
            //   ii.  Let same be the result of applying the
            //        Strict Equality Comparison Algorithm to
            //        searchElement and elementK.
            //  iii.  If same is true, return k.
            if (k in O && O[k] === searchElement) {
                return k;
            }
            k++;
        }
        return -1;
    };
}
// if(!Array.prototype.contains) {
//     Array.prototype.contains = function(obj) {
//         return this.indexOf(obj) !== -1;
//     }
// }
function isIn(obj, key) {
    return obj[key] !== undefined;
}
function exists(obj) {
    return $defined(obj);
}
function dbgprint(str) {
    console.log(str);
}
function hasExistingCall() {
    return existingCall !== undefined;
}
navigator.userMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia || navigator.mozGetUserMedia;
var j = $;
function urlObject(options) {
    "use strict";
    /*global window, document*/

    var url_search_arr,
        option_key,
        i,
        urlObj,
        get_param,
        key,
        val,
        url_query,
        url_get_params = {},
        a = document.createElement('a'),
        default_options = {
            'url': window.location.href,
            'unescape': true,
            'convert_num': true
        };

    if (typeof options !== "object") {
        options = default_options;
    } else {
        for (option_key in default_options) {
            if (default_options.hasOwnProperty(option_key)) {
                if (options[option_key] === undefined) {
                    options[option_key] = default_options[option_key];
                }
            }
        }
    }

    a.href = options.url;
    url_query = a.search.substring(1);
    url_search_arr = url_query.split('&');

    if (url_search_arr[0].length > 1) {
        for (i = 0; i < url_search_arr.length; i += 1) {
            get_param = url_search_arr[i].split("=");

            if (options.unescape) {
                key = decodeURI(get_param[0]);
                val = decodeURI(get_param[1]);
            } else {
                key = get_param[0];
                val = get_param[1];
            }

            if (options.convert_num) {
                if (val.match(/^\d+$/)) {
                    val = parseInt(val, 10);
                } else if (val.match(/^\d+\.\d+$/)) {
                    val = parseFloat(val);
                }
            }

            if (url_get_params[key] === undefined) {
                url_get_params[key] = val;
            } else if (typeof url_get_params[key] === "string") {
                url_get_params[key] = [url_get_params[key], val];
            } else {
                url_get_params[key].push(val);
            }

            get_param = [];
        }
    }

    urlObj = {
        protocol: a.protocol,
        hostname: a.hostname,
        host: a.host,
        port: a.port,
        hash: a.hash.substr(1),
        pathname: a.pathname,
        search: a.search,
        parameters: url_get_params
    };

    return urlObj;
}
function isAgent(testAgent) {
    var userAgent = navigator.userAgent;
    if(testAgent == "chromium") {
        return userAgent.toLowerCase().contains("chrome");
    } else if(testAgent == "chrome") {
        return userAgent.toLowerCase().contains("chrome") && !userAgent.toLowerCase().contains("opera"); //Is chromium but not Opera
    } else if(testAgent == "opera") {
        return userAgent.toLowerCase().contains("opr");
    } else if(testAgent == "safari") {
        return userAgent.toLowerCase().contains("safari");
    } else if(testAgent == "webkit") {
        return userAgent.toLowerCase().contains("applewebkit") && !userAgent.toLowerCase().contains("chrome");
    } else if(testAgent == "firefox") {
        return userAgent.toLowerCase().contains("firefox");
    } else if(testAgent == "gecko") {
        return userAgent.toLowerCase().contains("gecko");
    }
}
var urlObj = urlObject({
    url: window.location
});
try {
    urlObj = {
        parameters: {
            username: encodeUsername(login.getUser().email)
        }
    }
    username = urlObj.parameters["username"];
    console.log(encodeUsername(login.getUser().email));
} catch(e) {
    window.location.href = "login.html";
}
if (!Date.now) {
    Date.now = function() {
        return (new Date()).getTime();
    }
}
function sha3(msg) {
    return CryptoJS.SHA3(msg, {
        outputLength: 512
    });
}
// Array Remove - By John Resig (MIT Licensed)
//Modified by me - still MIT licensed
//TODO: Convert away from using "this", make standalone
// arrayRemove = function(from, to) {
//     var rest = this.slice((to || from) + 1 || this.length);
//     this.length = from < 0 ? this.length + from : from;
//     return this.push.apply(this, rest);
// };