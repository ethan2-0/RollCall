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
unprefix(navigator, "getUserMedia");
//Load the permissions from localStorage
//It's a global variable.
accessRequest = JSON.parse(localStorage.getItem("peer_permissions"));
// PeerJS object
var peer = new Peer({
    key: 'n1f6bv8havvaemi',
    debug: 3
});
peer.on('open', function() {
    $('#my-id').text(peer.id);
    activeId = peer.id;
    updateActiveIdInFb();
});
function dealWithCall(call) {
    call.on("close", function() {
        dealWithHangUp();
    });
    window.currentCall = call;
}
// Receiving a call
peer.on('call', function(call) {
    // Answer the call automatically (instead of prompting user) for demo purposes
    requestCallAnswer(function() {
        call.answer(window.localStream);
        dealWithCall(call);
    });
    step3(call);
});
peer.on('error', function(err) {
    alert(err.message);
    // Return to step 2 if error occurs
    step2();
});
// Click handlers setup
function core_beginCall(id) {
    console.log(window.localStream);
    var call = peer.call(id, window.localStream);
    step3(call);
}
if(localStorage.getItem("peer_setupDone") != null) {
    $(function() {
        // Get things started
        step1();
    });
}
function step1() {
    // Get audio/video stream
    navigator.getUserMedia({
        audio: accessRequest.audio,
        video: accessRequest.video
    }, function(stream) {
        // Set your video displays
        $('#my-video').attr('src', URL.createObjectURL(stream))
            .on("loadeddata", function() {
                var thiz = this;
                $(this).hide();
                setTimeout(function() {
                    $("#their-video").fadeIn();
                    // thiz.height = 200;
                    // thiz.width = (thiz.videoWidth / thiz.videoHeight) * thiz.height;
                    $(thiz).show();
                }, 100);
            });
        window.localStream = stream;
        step2();
    }, function(err) {
        alert("getUserMedia error");
        console.log(err);
    });
}
function step2() {
    $('#step1, #step3').hide();
    $('#step2').show();
}
function core_hangUp() {
    window.existingCall.close();
}
function step3(call) {
    // Hang up on an existing call if present
    if (window.existingCall) {
        window.existingCall.close();
    }
    // Wait for stream on the call, then set peer video display
    call.on('stream', function(stream) {
        $('#their-video').attr('src', URL.createObjectURL(stream));
        $("#their-video").fadeIn();
    });
    dealWithCall(call);
    // UI stuff
    window.existingCall = call;
    call.on('close', step2);
}