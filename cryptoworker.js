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
importScripts("BigInt.js");
self.addEventListener("message", function(msg) {
    console.log("Generating primes...");
    console.log("Generating p...");
    var p = randTruePrime(516);
    console.log("Generating q...");
    var q = randTruePrime(510);
    self.postMessage([p, q]);
});