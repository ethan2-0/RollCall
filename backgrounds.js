var imgThisTime = 0;
fetch("/backgrounds/images.json").then(function(response) {
    return response.json();
}).then(function(json) {
    var chooseNewImage = function() {
        imgThisTime = json[Math.floor(Math.random() * json.length)];
        $("#email-top").css("background-image", "url(" + imgThisTime + ")");
        console.log("Chose", imgThisTime);
    }
    setInterval(chooseNewImage, 60000);
    chooseNewImage();
});
function updateScrolling() {
    requestAnimationFrame(updateScrolling);
    if($("#email-layer").is(":visible")) {
        var y = +($("#email-top").offset().top);
        $("#email-top").css("background-position", "0px " + (y * 0.38) + "px")
    }
}
updateScrolling();