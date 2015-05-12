var imgThisTime = 0;
fetch("backgrounds/images.json").then(function(response) {
    return response.json();
}).then(function(json) {
    var imgList = [];
    for(var key in json) {
        imgList.push(key);
    }
    var chooseNewImage = function() {
        imgThisTime = imgList[Math.floor(Math.random() * imgList.length)];
        $("#email-top").css("background-image", "url(" + imgThisTime + ")");
        console.log("Chose", imgThisTime);
        var formattedName = imgThisTime.split("_").join(" ").replace("by", "<br/>").replace("backgrounds/", "").replace(".jpg", "");
        $("#background-name").html(formattedName)
            .css("color", json[imgThisTime]);
    }
    window.chooseNewImage = chooseNewImage;
    setInterval(chooseNewImage, 60000);
    chooseNewImage();
});
var lastY = 0;
function updateScrolling() {
    requestAnimationFrame(updateScrolling);
    if($("#email-layer").is(":visible")) {
        var y = +($("#email-top").offset().top);
        if(y == lastY) {
            return;
        }
        lastY = y;
        $("#email-top").css("background-position", "0px " + (y * -0.3) + "px")
    }
}
updateScrolling();