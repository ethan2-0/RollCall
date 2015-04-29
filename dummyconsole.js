//TODO: Stack trace (append to beginning of each log)
(function() {
    var console = gcon;
    var oldConsole = console;
    var willCall = false;
    var currF = null;
    var prefix = "";
    function doStuff() {
        var setArgumentsToFirstValue = false;
        if(willCall) {
            setArgumentsToFirstValue = true;
            arguments = arguments[0];
        }
        var conc = prefix;
        for(var key in arguments) {
            if(parseInt(key) == parseInt(key)) {
                var val = arguments[key];
                if((typeof val) in {"number": 0, "boolean": 0}) {
                    conc += val + " ";
                } else if(typeof val == "string") {
                    conc += '"' + val + '" ';
                } else if(typeof val == "object") {
                    conc += JSON.stringify(val);
                } else if(typeof val == "undefined") {
                    conc += val;
                } else {
                    conc += "[WARNING: UNKNOWN TYPEOF " + typeof val + "] " + val + " ";
                }
            }
        }
        console.logs += conc + "\n";
        currF.apply(oldConsole, setArgumentsToFirstValue ? [arguments] : arguments);
    }
    console = {
        logs: "",
        log: function() {
            currF = oldConsole.log;
            prefix = "";
            doStuff.apply(this, arguments);
        },
        assert: function() {
            var assertion = arguments[0];
            arguments[0] = "";
            if(!assertion) {
                console.error.apply(this, arguments);
            }
        },
        error: function() {
            currF = oldConsole.error;
            doStuff.apply(this, arguments);
        },
        warn: function() {
            currF = oldConsole.warn;
            doStuff.apply(this, arguments);
        },
        table: function() {
            currF = oldConsole.table;
            doStuff.apply(this, arguments);
        },
        getString: function() {
            return console.logs;
        }
    }
    var thingsNeedingImpl = "";
    for(var x in oldConsole) {
        if(typeof console[x] == "undefined") {
            thingsNeedingImpl += x + ",";
        }
    }
    console.warn("Still need to implement console functions: ", thingsNeedingImpl);
    //Implicit global
    gnc = console;
})();
//Implicit global
console = gnc;
//TODO: info,exception,debug,trace,dir,group,groupCollapsed,groupEnd,time,timeEnd,profile,profileEnd,count