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
console.warn("Still generating 512-bit primes for keypair. Not using WebCrypto.")
//RSA utils
var rsa;
if(typeof(initRsa) == "undefined") {
    console.log("Initializing RSA cryptosystem...")
    rsa = (function() {
        var p, q, n, e, d, keypair;
        var generateKeypair = function() {
            var worker = new Worker("cryptoworker.js");
            console.log("Creating keypair...");
            console.log("Choosing p and q...");
            worker.postMessage("blah");
            $(worker).on("message", function(evt) {
                evt = evt.originalEvent;
                p = evt.data[0];
                q = evt.data[1];
                console.log("Calculating n...");
                n = mult(p, q);
                //Normally, e = 65537. Is this a good idea?
                console.log("Calculating e...");
                e = int2bigInt(65537, 17, 2);
                console.log("Calculating d...");
                //For now, we'll just multiply them; however, this is VERY inifficient.
                d = inverseMod(e, mult(sub(p, int2bigInt(1, 1, 1)), sub(q, int2bigInt(1, 1, 1)))); //TODO: Is this right?
                console.log("Done!");
                var rsaRef = firebase.child("users").child(username).child("rsa");
                rsaRef.child("eStr").set(bigInt2str(e, 10));
                rsaRef.child("nStr").set(bigInt2str(n, 10));
                rsaRef.child("e").set(e);
                rsaRef.child("n").set(n);

                keypair = {
                    p: p,
                    q: q,
                    n: n,
                    e: e,
                    d: d
                }
                rsa.keypair = keypair;
                var keyHashed = hash.sha512.multiple(localStorage.getItem("peer_passwordHash"), 32).data;
                keyHashed = aes.getPasswordKey(keyHashed);
                firebase.child("users").child(username).child("keypair").set(aes.encryptKeypair(keypair, keyHashed));
            });
        }
        firebase.child("users").child(username).child("keypair").once("value", function(snapshot) {
            console.log("Got here!");
            var val = snapshot.val();
            if(val == null) {
                generateKeypair();
            } else {
                var keyHashed = hash.sha512.multiple(localStorage.getItem("peer_passwordHash"), 32).data;
                keyHashed = aes.getPasswordKey(keyHashed);
                keypair = aes.decryptKeypair(val, keyHashed);
                rsa.keypair = keypair;
                p = keypair.p;
                q = keypair.q;
                n = keypair.n;
                e = keypair.e;
                d = keypair.d;
            }
        });
        // if(keypair == null) {
            
        // } else {
        //     keypair = JSON.parse(keypair);
            // p = keypair.p;
            // q = keypair.q;
            // n = keypair.n;
            // e = keypair.e;
            // d = keypair.d;
        // }
        //Now, RSA is set up.
        function decrypt(c) {
            return powMod(c, d, n);
        }
        function encrypt(m, publicKey) {
            return powMod(m, publicKey.e, publicKey.n);
        }
        function encryptStr(str, publicKey) {
            //TODO: Pad with randomness
            if(str.length > n.length) {
                //m must not be greater than n; throw an exception
                throw "str.length > n.length; m must never be greater than n.";
            }
            var bigInt = [str.length];
            for(var i = 0; i < str.length; i++) {
                bigInt[i] = str.charCodeAt(i);
            }
            return encrypt(bigInt, publicKey);
        }
        function decryptStr(c1) {
            var c = decrypt(c1);
            var str = "";
            for(var i = 0; i < c.length - 1; i++) { //-1 because for some reason a random character is appended to the end; TODO: make this not a hack :(
                str += String.fromCharCode(c[i]);
            }
            return str;
        }
        function encryptAESKey(aesKey, publicKey) {
            return {
                key: encryptStr(aesKey.key, publicKey),
                iv: encryptStr(aesKey.iv, publicKey)
            };
        }
        function decryptAESKey(encrypted) {
            return {
                key: decryptStr(encrypted.key),
                iv: decryptStr(encrypted.iv)
            };
        }
        function unstringifyPublicKey(key) {
            if(typeof(key.e) !== "string" || typeof(key.n) !== "string") {
                // console.warn("Called unstringifyPublicKey on unstringified public key:", key, "with type", typeof(key.e));
                return key;
            }
            return {
                e: str2bigInt(key.e, 10, 17, 2),
                n: str2bigInt(key.n, 10, 512, 34)
            }
        }
        return {
            decrypt: decrypt,
            encrypt: encrypt,
            encryptStr: encryptStr,
            decryptStr: decryptStr,
            encryptAESKey: encryptAESKey,
            decryptAESKey: decryptAESKey,
            unstringifyPublicKey: unstringifyPublicKey,
            p: p,
            q: q,
            n: n,
            e: e,
            d: d,
            keypair: keypair
        };
    })();
}
var aes = (function() {
    function getKey() {
        var key = forge.random.getBytesSync(32);
        var iv = forge.random.getBytesSync(32);
        return {
            key: key,
            iv: iv
        };
    }
    function getKeyFromPassphrase(passphrase) {
        //The iv is the passphrase reversed.
        //Everything is quadruple-sha256'd so the keys are the right length and to protect against brute-force.
        return {
            key: hash.sha256.multiple(passphrase, 4).data,
            iv: hash.sha256.multiple(passphrase.split("").reverse().join(), 4).data
        }
    }
    function encrypt(msgIn, key) {
        //Certain types of cryptanalysis rely on the first blocks being predictable.
        //So, begin with 128 bytes of randomness.
        var msg = msgIn;
        var cipher = forge.cipher.createCipher("AES-CBC", key.key);
        cipher.start({
            iv: key.iv
        });
        cipher.update(forge.util.createBuffer(msg, "utf8"));
        cipher.finish();
        return cipher.output;
    }
    function encryptKeypair(keypair, key) {
        return {
            p: encrypt(JSON.stringify(keypair.p), key),
            q: encrypt(JSON.stringify(keypair.q), key),
            n: encrypt(JSON.stringify(keypair.n), key),
            e: encrypt(JSON.stringify(keypair.e), key),
            d: encrypt(JSON.stringify(keypair.d), key)
        };
    }
    function decryptKeypair(encrypted, key) {
        return {
            p: JSON.parse(decrypt(encrypted.p, key)),
            q: JSON.parse(decrypt(encrypted.q, key)),
            n: JSON.parse(decrypt(encrypted.n, key)),
            e: JSON.parse(decrypt(encrypted.e, key)),
            d: JSON.parse(decrypt(encrypted.d, key)),
        };
    }
    function decrypt(msg, key) {    
        var decipher = forge.cipher.createDecipher("AES-CBC", key.key);
        decipher.start({
            iv: key.iv
        });
        var buffer = forge.util.createBuffer(msg.data, "utf8");
        buffer.data = msg.data;
        decipher.update(buffer);
        decipher.finish();
        //.substr(128) to remove the 128 bits of padding (to prevent certain cryptanalyses).
        return decipher.output.data;
    }
    return {
        encrypt: encrypt,
        decrypt: decrypt,
        getKey: getKey,
        getPasswordKey: getKeyFromPassphrase,
        encryptKeypair: encryptKeypair,
        decryptKeypair: decryptKeypair
    };
})();
var hash = {
    createHasher: function(hashFunc) {
        function hash(str) {
            var md = hashFunc.create();
            md.update(str);
            return md.digest();
        }
        function hexHash(str) {
            return hash(str).toHex();
        }
        function multiple(str, iterations) {
            if(iterations <= 1) {
                return hash(str);
            }
            return multiple(hash(str).data, iterations - 1);
        }
        function hexMultiple(str, iterations) {
            return multiple(str, iterations).toHex();
        }
        return {
            hash: hash,
            hexHash: hexHash,
            multiple: multiple,
            hexMultiple: hexMultiple
        };
    },
    sha1: "This is populated directly below.",
    sha256: "This will be populated directly below.",
    sha384: "This will be populated directly below.",
    sha512: "This will be populated directly below.",
    md5: "This will be populated directly below.",
};
hash.sha1 = hash.createHasher(forge.md.sha1);
hash.sha256 = hash.createHasher(forge.md.sha256);
hash.sha384 = hash.createHasher(forge.md.sha384);
hash.sha512 = hash.createHasher(forge.md.sha512);
hash.md5 = hash.createHasher(forge.md.md5);
function sha1(msg) {
    return hash.sha1.hexHash(msg);
}