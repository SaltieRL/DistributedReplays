define([], function () {
    function JsonGet(yourUrl) {
        let req = new XMLHttpRequest(); // a new request
        req.open("GET", yourUrl, false);
        req.send(null);
        return JSON.parse(req.responseText);
    }

    function asyncJsonGet(yourUrl, callback, debug=false) {
        if (!callback) {
            throw "Callback needs to be a valid function";
        }
        fetch(yourUrl)
            .then(function(res) {
                if (debug) {
                    console.debug(res);
                }
                return res.json();
            }) // next chained then will received the results of this, not original res
            .then(callback)
            .catch(console.error);
    }

    return {
        jsonGet: JsonGet,
        asyncJsonGet: asyncJsonGet
    };
});
