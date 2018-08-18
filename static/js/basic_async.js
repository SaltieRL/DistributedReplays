define([], function () {
    function JsonGet(yourUrl) {
        let req = new XMLHttpRequest(); // a new request
        req.open("GET", yourUrl, false);
        req.send(null);
        return JSON.parse(req.responseText);
    }

    function asyncJsonGet(yourUrl, callback) {
        if (!callback) {
            throw "Callback needs to be a valid function";
        }
        let req = new XMLHttpRequest(); // a new request
        req.open("GET", yourUrl, true);
        req.onload = function(e) {
            if (req.readyState === 4) {
                if (req.status === 200) {
                    callback(JSON.parse(req.responseText));
                } else {
                    console.error(req.statusText);
                }
            }
        };
        req.onerror = function (e) {
            console.error(req.statusText);
        };
        req.send(null);
    }

    return {
        jsonGet: JsonGet,
        asyncJsonGet: asyncJsonGet
    };
});
