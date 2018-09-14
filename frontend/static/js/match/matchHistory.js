define(['overallReplayGraph'], function (replayGraphs) {

    const graphClass = '.graph-list-container';
    let lastClickedElement = null;


    function addAction(actionElementId, hostId, labelData, replayData) {
        let touched = false;
        document.getElementById(actionElementId).addEventListener("click", (ev) => {
            touched = true;
            let elements = document.getElementById(hostId).querySelectorAll("canvas");
            if (elements.length <= 0) {
                replayGraphs.showOverallReplayGraphs(hostId, graphClass, labelData, replayData);
                console.log('creating canvas');
            }
        });

        let observer = new MutationObserver((mutations) => {
            let element = document.getElementById(hostId);
            for(let mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    let hidden = !element.classList.contains('show');
                    if (hidden && !touched) {
                        console.log('removing canvs');
                        replayGraphs.removeGraphs(hostId);
                    } else if (touched) {
                        touched = false;
                    }
                }
            }
        });
        observer.observe(document.getElementById(hostId), { attributes:true});
    }

    function addMatchHandler(matches) {
        for (let i = 0; i < matches.length; i++) {
            matches[i].addEventListener('click', function(ev) {
                if (lastClickedElement != null) {
                    lastClickedElement.classList.remove('active');
                    lastClickedElement.nextElementSibling.classList.remove('show');
                }
                let data = !this.classList.contains('active') && lastClickedElement !== this;
                /* if we are not active */
                if (data) {
                    lastClickedElement = this;
                    this.classList.add("active");
                    this.nextElementSibling.classList.add("show");
                } else {
                    lastClickedElement = null;
                }
            });
        }


    }

    function propSet(element, prop) {
        element.classList.remove(prop);
    }


    return {
        addAction: addAction,
        addMatchHandler: addMatchHandler
    }
});
