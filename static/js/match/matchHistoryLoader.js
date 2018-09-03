define(['server'], function (server) {
    let page = 0;
    let history = null;
    let playerId = null;
    let dataCallback = null;
    let maxPages = null;
    let historyList = null;

    function loadData(callback) {
        server.asyncJsonGet(playerId + '/history/' + page.toString(), callback);
    }

    function createToggleCallback(elements) {
        let disabled_class = "pure-button-disabled";
        return function (elementToToggle) {
            for (let i = 0; i < elements.length; i++) {
                let element = elements[i];
                if (element.classList.contains(disabled_class)) {
                    element.classList.remove(disabled_class);
                } else if (elementToToggle === element){
                    element.classList.add(disabled_class);
                }
            }
        }
    }

    function addNextPageListener(element, h, toggleCallback) {
        history = h;
        element.addEventListener('click', function (ev) {
            if (page >= maxPages) {
                return;
            }
            page += 1;
            loadData(processPage, history);
            if (page <= maxPages) {
                toggleCallback(element);
            }
        });
    }

    function addPreviousPageListener(element, h, toggleCallback) {
        history = h;
        element.addEventListener('click', function (ev) {
            if (page <= 0) {
                return;
            }
            page -= 1;
            loadData(processPage, history);
            if (page <= 0) {
                toggleCallback(element);
            }
        });
    }

    function processPage(data) {
        while (history.firstChild) {
            history.removeChild(history.firstChild);
        }
        console.debug('added new html');
        history.innerHTML = data['html'];

        eval(document.getElementById('historyScript').innerHTML);
        eval(document.getElementById('graphScript').innerHTML);

        setTimeout(function () {
            if (dataCallback != null) {
                console.debug('calling script');
                dataCallback();
                if (historyList != null) {
                    historyList();
                }
                dataCallback = null;
            }
        }, 100);
    }

    function initializePage(playerPageId, maxPage) {
        playerId = playerPageId;
        maxPages = maxPage;
        console.debug('creating pages', playerPageId, maxPages);
        let nextpage = document.getElementById('nextpage');
        let prevpage = document.getElementById('prevpage');
        let history = document.getElementsByClassName('matchhistory')[0];
        let callbacks = createToggleCallback([nextpage, prevpage]);
        addNextPageListener(nextpage, history, callbacks);
        addPreviousPageListener(prevpage, history, callbacks);
        if (dataCallback != null) {
            dataCallback();
            if (historyList != null) {
                historyList();
            }
        } else {
            console.debug("Callback is null no data graph data was initialized");
        }

        callbacks(prevpage);
    }

    function setHistoryCallback(callback) {
        dataCallback = callback;
    }

    function setHistoryList(callback) {
        historyList = callback;
    }

    return {
        initializeMatchHistory: initializePage,
        setHistoryCallback: setHistoryCallback,
        setHistoryList: setHistoryList
    }
});
