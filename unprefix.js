String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
function unprefix(object, name) {
    var vendors = ["webkit", "o", "ms", "moz"];
    for(index in vendors) {
        var vendor = vendors[index];
        if(typeof(object[vendor + name.capitalize()]) !== "undefined") {
            object[name] = object[vendor + name.capitalize()];
        }
    }
}