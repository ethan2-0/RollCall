/**
 * Adapted from http://cdn.peerjs.com/demo/videochat/. This is released under PeerJS's license available at https://github.com/peers/peerjs/blob/master/LICENSE.
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
    console.warn("An error occurred", err);
    // Return to step 2 if error occurs
    step2();
});
// Click handlers setup
function core_beginCall(id) {
    console.log(window.localStream);
    var call = peer.call(id, window.localStream, {
        hi: "hi"
    });
    step3(call);
}
if(localStorage.getItem("peer_setupDone") != null) {
    $(function() {
        // Get things started
        step1();
    });
}
function step1() {
    var umGotten = false;
    // Get audio/video stream
    navigator.getUserMedia({
        audio: accessRequest.audio,
        video: accessRequest.video
    }, function(stream) {
        umGotten = true;
        console.log(stream);
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
        setTimeout(function() {
            $("#video-toggle").click();
        }, 500);
        step2();
    }, function(err) {
        alert("getUserMedia error");
        console.log(err);
    });
    setTimeout(function() {
        if(!umGotten) {
            bootbox.dialog({
                title: "Hey!",
                message: "Did you forget (or refuse) to allow access to your webcam and microphone?<br/>If you did not intend the access we requested, you can redo setup in the menu.",
                buttons: {
                    main: {
                        className: "btn-danger",
                        label: "Reload and try again",
                        callback: function() {
                            location.href = location.href;
                        }
                    }
                }
            })
        }
    }, 8000);
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
    console.log(call.metadata);
    // Wait for stream on the call, then set peer video display
    call.on('stream', function(stream) {
        window.theirStream = stream;
        $('#their-video').attr('src', URL.createObjectURL(stream));
        $("#their-video").fadeIn();
    });
    dealWithCall(call);
    // UI stuff
    window.existingCall = call;
    call.on('close', step2);
}