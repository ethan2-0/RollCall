var menucss = "/*START MENU*/.menu {background-color: white;box-shadow: 0px 0px 1px 1px rgba(0, 0, 0, 0.1);position: absolute;left: 0px;top: 0px;}.menuitem {padding-top: 4px;padding-bottom: 4px;padding-right: 8px;padding-left: 6px;cursor: pointer;font-size: 16px;transition: background-color 0.4s;background-color: white;}.menuitem:hover {background-color: #EEE;}.menusep {width: 90%;margin-left: 5%;height: 1px;background-color: #EEE;}";
$(document.head).append($("<style>")
    .attr("type", "text/css")
    .html(menucss));
var menus = {
    ".data-name": function() {
        var uname = selectedElm.html();
        var ret = {};
        ret["Unfriend " + uname] = function() {
            bootbox.confirm("Unfriend " + uname + "?", function(res) {
                if(!res) {
                    return;
                }
                userRef.child("friends").once("value", function(snapshot) {
                    value = snapshot.val();
                    for(var key in value) {
                        
                    }
                });
            });
        }
        return ret;
    },
    "*": function() {
        return {
            "blah": function() {
                console.log("blah");
            }
        }
    }
}
var menu = $("<div>")
    .addClass("menu")
    .hide()
    .appendTo($(document.body));
function createMenu(x, y, spec) {
    menu.velocity("fadeIn")
        .css("left", x + 2)
        .css("top", y + 2);
    menu.empty();
    for(var key in spec) {
        if(key == "__sep__") {
            menu.append($("<div>")
                .addClass("menusep"));
        } else {
            menu.append($("<div>")
                .addClass("menuitem")
                .html(key)
                .on("click", spec[key]));
        }
    }
}
var selectedElm;
$(document.body).on("contextmenu", function(evt) {
    var currentElm = $(evt.originalEvent.target);
    while(!currentElm.is("body")) {
        for(var selector in menus) {
            if(currentElm.is(selector)) {
                selectedElm = currentElm;
                createMenu(evt.pageX, evt.pageY, menus[selector]());
                evt.preventDefault();
                return false;
            }
        }
        currentElm = currentElm.parent();
    }
    // evt.preventDefault();
    // return false;
});
$(document.body).on("click", function() {
    menu.velocity("fadeOut");
});