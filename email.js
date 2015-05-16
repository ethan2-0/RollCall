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
        return {
            getCodeMirror: getCodeMirror,
            generatePreview: generatePreview
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
                //firebase.child("users").child(encodeUsername(uname)).child("email").push(enc);
                console.log(enc);
                window.res = enc;
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
    return {
        writer: writer,
        sender: sender,
        switchToTab: switchToTab,
        generateHtml: generateHtml
    };
})();
(function() {
    $("#preview-button")
        .on("mouseenter", function() {
            email.writer.generatePreview();
            $("#email-preview")
                .show()
                .css("opacity", 0)
                .velocity({
                    opacity: 1
                });
        })
        .on("mouseleave", function() {
            $("#email-preview")
                .velocity({
                    opacity: 0
                }, function() {
                    $("#email-preview").hide();
                });
        });
    $("#email-preview").hide();
    $(".email-tab").hide();
    $(".email-tab-shown").show();
})();