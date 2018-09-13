define(['server'], function (server) {
    let activeClass = 'active';
    let nonActiveClass = 'waves-effect';
    let disabled_class = "pure-button-disabled";
    let page = 0;
    let history = null;
    let playerId = null;
    let dataCallback = null;
    let maxPages = null;
    let historyList = null;

    function loadData(callback) {
        server.asyncJsonGet(playerId + '/history/' + page.toString(), callback);
    }

    function setPageActive(allPages) {
        let activeElement = allPages.querySelector('.' + activeClass);
        let newElement = allPages.querySelector('#page-' + page);
        newElement.classList.add(activeClass);
        newElement.classList.remove(nonActiveClass);
        activeElement.classList.remove(activeClass);
        activeElement.classList.add(nonActiveClass)
    }

    function createToggleCallback(elements) {
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

    function addNextPageListener(element, toggleCallback, allPages) {
        element.addEventListener('click', function (ev) {
            if (page >= maxPages) {
                return;
            }
            page += 1;
            loadData(processPage, history);
            setPageActive(allPages);
            if (page >= maxPages - 1) {
                toggleCallback(element);
            }
        });
    }

    function addPreviousPageListener(element, toggleCallback, allPages) {
        element.addEventListener('click', function (ev) {
            if (page <= 0) {
                return;
            }
            page -= 1;
            setPageActive(allPages);
            loadData(processPage, history);
            if (page <= 0) {
                toggleCallback(element);
            }
        });
    }

    function addPageListener(allPages, previousPage, nextPage) {
        allPages.querySelectorAll('.number').forEach((element) => {
            element.addEventListener('click', function () {
                let elementPage = this.getAttribute('data-page');
                if (this.classList.contains(activeClass)) {
                    return;
                }
                page = parseInt(elementPage);
                loadData(processPage, history);
                setPageActive(allPages);
                if (page === 0) {
                    previousPage.classList.add(disabled_class);
                    nextPage.classList.remove(disabled_class);
                } else if (page + 1 === maxPages) {
                    nextPage.classList.add(disabled_class);
                    previousPage.classList.remove(disabled_class);
                } else {
                    nextPage.classList.remove(disabled_class);
                    previousPage.classList.remove(disabled_class);
                }
            });
        });
    }

    function processPage(data) {
        while (history.firstChild) {
            history.removeChild(history.firstChild);
        }
        clearHistoryCallback();
        console.debug('added new html');
        history.innerHTML = data['html'];
        setTimeout(function () {
            eval(document.getElementById('historyScript').innerHTML);
            setTimeout(function () {
                history.querySelectorAll('script.graphScript').forEach((element) => {
                    eval(element.innerHTML);
                });
                setTimeout(function () {
                    if (historyList != null) {
                        console.debug('adding match history');
                        historyList();
                    }
                    if (dataCallback != null) {
                        console.debug('calling script');
                        dataCallback();
                        dataCallback = null;
                    }
                }, 100);
            }, 100);
        }, 100);
    }

    function initializePage(playerPageId, maxPage) {
        playerId = playerPageId;
        maxPages = maxPage;
        console.debug('creating pages', playerPageId, maxPages);
        let allPages = document.getElementById("pagination");
        let nextPage = document.getElementById('nextpage');
        let prevPage = document.getElementById('prevpage');
        if (nextPage === null || prevPage === null) {
            if (historyList != null) {
                historyList();
            }
            dataCallback();
            return;
        }
        history = document.getElementById('dynamic-pages');
        let callbacks = createToggleCallback([nextPage, prevPage]);
        addNextPageListener(nextPage, callbacks, allPages);
        addPreviousPageListener(prevPage, callbacks, allPages);
        addPageListener(allPages, prevPage, nextPage);
        if (dataCallback != null) {
            dataCallback();
            if (historyList != null) {
                historyList();
            }
        } else {
            console.debug("Callback is null no data graph data was initialized");
        }

        callbacks(prevPage);
    }

    function addHistoryCallback(callback) {
        let oldDataCallback = dataCallback;
        dataCallback = function () {
            try {
                if (oldDataCallback != null) {
                    oldDataCallback();
                }
            } catch(exception) {
                console.log(exception);
            }
            callback();
        };
    }

    function clearHistoryCallback() {
        dataCallback = null;
    }

    function setHistoryList(callback) {
        historyList = callback;
    }

    return {
        initializeMatchHistory: initializePage,
        setHistoryCallback: addHistoryCallback,
        setHistoryList: setHistoryList,
        clearHistoryCallback: clearHistoryCallback
    }
});
