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
unprefix(navigator, "getUserMedia");
//Load the permissions from localStorage
//It's a global variable.
accessRequest = JSON.parse(localStorage.getItem("peer_permissions"));
// PeerJS object
//host: "rollcallbroker.herokuapp.com",
// secure: true,
// port: 80,
// path: "/",
// debug: 3
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