define(['server'], function (server) {
    let page = 1;
    let history = null;

    function loadData(callback) {
        server.asyncJsonGet(playerid + '/history/' + page.toString(), callback);
    }

    function addNextPageListener(element, h) {
        history = h;
        element.addEventListener('click', function (ev) {
            page += 1;
            loadData(processPage, history);
        });
    }

    function addPreviousPageListener(element, h) {
        history = h;
        element.addEventListener('click', function (ev) {
            page -= 1;
            loadData(processPage, history);
        });
    }

    function processPage(data) {
        for (let x = 0; x < handlers.length; x++) {
            document.removeEventListener("DOMContentLoaded", handlers[x]);
        }

        while (history.firstChild) {
            history.removeChild(history.firstChild);
        }
        let div = document.createElement('div');
        div.innerHTML = data['html'];
        history.appendChild(div);


        let arr = div.getElementsByTagName('script');
        for (let n = 0; n < arr.length; n++)
            eval(arr[n].innerHTML)//run script inside div

        let DOMContentLoaded_event = document.createEvent("Event");
        DOMContentLoaded_event.initEvent("DOMContentLoaded", true, true);
        window.document.dispatchEvent(DOMContentLoaded_event);

    }

    return {
        addNextPageListener: addNextPageListener,
        addPreviousPageListener: addPreviousPageListener
    }
});
