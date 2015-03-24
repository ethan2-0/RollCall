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
if(typeof(isMainPage) != "boolean") {
    isMainPage = false;
}
var uname = window.location.href.split("=")[1]; //TODO: Improve
menu = (function() {
    var items = [];
    var node = null;
    var menuNode = null;
    var itemsNode = null;
    function registerItem(elm, onclick) {
        items.push({
            elm: elm,
            onclick: onclick
        });
        regen();
    }
    function regen() {
        itemsNode.empty();
        items.forEach(function(item) {
            itemsNode.append(item.elm);
            item.elm.on("click", item.onclick);
        });
    }
    function showMenu() {
        menuNode.css("right", "0px")
            .addClass("sidebar-shown")
            .removeClass("sidebar-hidden");
    }
    function hideMenu() {
        // TODO: About/Credits
        menuNode.css("right", "-15vw")
            .removeClass("sidebar-shown")
            .addClass("sidebar-hidden");
    }
    function createNode() {
        node = $("<div>")
            .attr("id", "menu-icon")
            .append($("<span>")
                .addClass("glyphicon glyphicon-menu-hamburger"))
            .appendTo($(document.body))
            .on("click", showMenu);
        menuNode = $("<div>")
            .addClass("sidebar")
            .addClass("sidebar-hidden")
            .appendTo($(document.body))
            .append($("<span>")
                .addClass("sidebar-close")
                .addClass("glyphicon glyphicon-remove")
                .on("click", hideMenu));
        itemsNode = $("<div>")
            .addClass("sidebar-items")
            .appendTo(menuNode);
        try {
            menuNode.append($("<div>")
                .addClass("logged-in-title")
                .html(login.getUser().email));
            menuNode.append($("<div>")
                .addClass("sidebar-logout")
                .on("click", function() {
                    login.logout();
                    window.location.href = window.location.href;
                }));
        } catch(e) {
            //Don't append it
        }
    }
    function navigate(url) {
        if(isMainPage) {
            window.open(url, "_blank_" + Math.random());
        } else {
            window.location.href = url;
        }
    }
    createNode();
    return {
        register: registerItem,
        show: showMenu,
        hide: hideMenu,
        regen: regen,
        navigate: navigate
    }
})();
menu.register($("<div>")
    .addClass("sidebar-item")
    .html("Home"), function() {
        menu.navigate("index.html?username=" + uname);
        menu.hide();
    });
menu.register($("<div>")
    .addClass("sidebar-item")
    .html("About"), function() {
        menu.navigate("about.html?username=" + uname);
        menu.hide();
    });
menu.register($("<div>")
    .addClass("sidebar-item")
    .html("License"), function() {
        menu.navigate("license.html?username=" + uname);
        menu.hide();
    });
menu.register($("<div>")
    .addClass("sidebar-item")
    .html("Privacy"), function() {
        menu.navigate("privacy.html?username=" + uname);
        menu.hide();
    });
menu.register($("<div>")
    .addClass("sidebar-item")
    .html("Credits"), function() {
        alert("Not implemented yet.");
        menu.navigate("credits.html");
    });
menu.register($("<div>")
    .addClass("sidebar-item")
    .html("Source (github)"), function() {
        menu.navigate("http://github.com/ethan2-0/RollCall");
    });
try {
    login.getEmail();
} catch(e) {
    menu.register($("<div>")
        .addClass("sidebar-item")
        .html("Log in", function() {
            menu.navigate("login.html");
        }));
}