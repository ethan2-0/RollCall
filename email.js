var email = (function() {
    var converter = Markdown.getSanitizingConverter();
    function generateHtml(text, title) {
        var prefix = title == "" ? "" : "<h1>" + title + "</h1>";
        var text = converter.makeHtml(text);
        return prefix + text;
    }
    var writer = (function() {
        var abc = window.CodeMirror;
        console.log("blah", abc);
        var codemirror = CodeMirror($("#email-codemirror")[0], {
            value: "Type your message here",
            mode: "markdown"
        });
        function generateWriterHtml() {
            return generateHtml(codemirror.getValue(), $("#email-subject")[0].value);
        }
        function generatePreview() {
            $("#email-preview").html(generateWriterHtml);
        }
        function getCodeMirror() {
            return codemirror;
        }
        function send() {
            var val = codemirror.getValue();
            var title = $("#email-subject")[0].value;
            chooseFriend(function(friend) {
                sender.send(val, title, friend);
                miniNote("E-mail sent", "Sent 1 e-mail to " + friend + ".");
            });
        }
        return {
            getCodeMirror: getCodeMirror,
            generatePreview: generatePreview,
            send: send
        }
    })();
    var sender = (function() {
        function send(msg, title, uname) {
            var timestamp = +new Date + "";
            var key = aes.getKey();
            firebase.child("users").child(encodeUsername(uname)).child("rsa").once("value", function(snapshot) {
                var theirPubKey = snapshot.val();
                var encryptedAESKey = rsa.encryptAESKey(key, theirPubKey);
                var encryptedMsg = aes.encrypt(msg, key);
                var encryptedTitle = aes.encrypt(title, key);
                var enc = {
                    key: encryptedAESKey,
                    msg: encryptedMsg,
                    title: encryptedTitle
                };
                firebase.child("users").child(encodeUsername(uname)).child("email").push(enc);
            });
        }
        function decrypt(enc) {
            var key = rsa.decryptAESKey(enc.key);
            var msg = aes.decrypt(enc.msg, key);
            var title = aes.decrypt(enc.title, key);
            return {
                msg: msg,
                title: title
            };
        }
        return {
            send: send,
            decrypt: decrypt
        };
    })();
    function switchToTab(tabname) {
        $(".email-tab").hide();
        $(".email-tab-shown")
            .removeClass("email-tab-shown");
        $("#email-" + tabname).show();
    }
    function chooseFriend(callback) {
        $("#email-friend-chooser").empty();
        for(var friend of window.friends) {
            $("#email-friend-chooser").append($("<div>")
                .addClass("email-friend")
                .html(decodeUsername(friend))
                .on("click", function() {
                    $(".email-friend-clicked")
                        .removeClass("email-friend-clicked")
                        .velocity({
                            "border-left-width": 0
                        }, 350);
                    $(this)
                        .addClass("email-friend-clicked")
                        .velocity({
                            "border-left-width": 10
                        }, 350);
                    $("#email-friend-chooser").attr("data-chosen", $(this).html());
                }));
        }
        $("#email-friend-chooser")
            .append($("<div>")
                .addClass("email-friend")
                .html("Accept")
                .on("click", function() {
                    $("#email-friend-chooser").velocity("fadeOut");
                    callback($("#email-friend-chooser").attr("data-chosen"));
                }));
        $("#email-friend-chooser").velocity("fadeIn", function() {
            if(typeof callback != "undefined") {
                callback();
            }
        });
    }
    $("#email-friend-chooser").hide();
    return {
        writer: writer,
        sender: sender,
        switchToTab: switchToTab,
        generateHtml: generateHtml,
        chooseFriend: chooseFriend
    };
})();
(function() {
    $("#preview-button")
        .on("mouseenter", function() {
            email.writer.generatePreview();
            $("#email-preview")
                .velocity("fadeIn");
        })
        .on("mouseleave", function() {
            $("#email-preview")
                .velocity("fadeOut");
        });
    $("#email-preview").hide();
    $(".email-tab").hide();
    $(".email-tab-shown").show();
})();