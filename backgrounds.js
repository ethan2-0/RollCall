var imgThisTime = 0;
fetch("/backgrounds/images.json").then(function(response) {
    return response.json();
}).then(function(json) {
    var chooseNewImage = function() {
        imgThisTime = json[Math.floor(Math.random() * json.length)];
        $("#email-top").css("background-image", "url(" + imgThisTime + ")");
        console.log("Chose", imgThisTime);
        var formattedName = imgThisTime.split("_").join(" ").replace("by", '<br/><span class="light">').replace("backgrounds/", "").replace(".jpg", "") + "</span>";
        $("#background-name").html(formattedName);
    }
    setInterval(chooseNewImage, 60000);
    chooseNewImage();
});
function updateScrolling() {
    requestAnimationFrame(updateScrolling);
    if($("#email-layer").is(":visible")) {
        var y = +($("#email-top").offset().top);
        $("#email-top").css("background-position", "0px " + (y * -0.3) + "px")
    }
}
updateScrolling();