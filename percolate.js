var newElm = $("<div>")
    .css("position", "absolute")
    .css("width", "100vw")
    .css("height", "100vh")
    .css("left", "0px")
    .css("top", "0px")
    .css("background-color", "white");
newElm.append($("<div>")
    .css("margin-top", "40vh")
    .addClass("opensans text-center")
    .css("font-size", "32px")
    .html("Percolating...")
    .css("z-index", "4000000000"));
newElm.append($("<center>")
    .append($("<div>")
        .addClass("loading-icon")))
$("#home-layer").css("transform", "translate(10000px, 10000px)");
newElm.appendTo($(document.body));
console.log(newElm);
loading();
//stopLoading will take place later.
setTimeout(function() {
    $("#home-layer").css("transform", "none");
    newElm.velocity("fadeOut", 600, function() {
        newElm.remove();
    });
}, 1000);