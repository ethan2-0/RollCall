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
        } catch(e) {
            //Don't append it
        }
    }
    createNode();
    return {
        register: registerItem,
        show: showMenu,
        hide: hideMenu,
        regen: regen
    }
})();
menu.register($("<div>")
    .addClass("sidebar-item")
    .html("Home"), function() {
        window.location.href = "index.html?username=" + uname;
        menu.hide();
    });
menu.register($("<div>")
    .addClass("sidebar-item")
    .html("About"), function() {
        window.location.href = "/peerjs/about.html?username=" + uname;
        menu.hide();
    });
menu.register($("<div>")
    .addClass("sidebar-item")
    .html("License"), function() {
        window.location.href = "/peerjs/license.html?username=" + uname;
        menu.hide();
    });
menu.register($("<div>")
    .addClass("sidebar-item")
    .html("Privacy"), function() {
        window.location.href = "/peerjs/privacy.html?username=" + uname;
        menu.hide();
    });
try {
    login.getEmail();
    menu.register($("<div>")
        .addClass("sidebar-item")
        .html("Log out"), function() {
            login.logout();
            window.location.href = window.location.href;
        });
} catch(e) {
    menu.register($("<div>")
        .addClass("sidebar-item")
        .html("Log in", function() {
            window.location.href = "login.html";
        }));
}