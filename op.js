const opLog = function (text) {
    console.log("OPExtensions: " + text);
}
const opLogError = function (text) {
    console.error("OPExtensions error: " + text);
}


const waitForElements = function (selectors, delay, numberOfTries, callback) {
    const selector = selectors.join(',');

    (function check () {
        const elements = document.querySelectorAll(selectors);

        numberOfTries -= 1;

        if (elements.length === selectors.length) {
            callback(elements);
        } else if (numberOfTries) {
            setTimeout(check, delay);
        }
    })();
}

const isOnWorkPackageView = function () {
    return (window.location.href.indexOf("work_package") !== -1);
}

const addHideSidePanelButton = function () {
    if (isOnWorkPackageView() === false) {
        // not the work package view - abort
        return;
    }

    const addArrowButton = function ([leftPanel, rightPanel]) {

        // found split panels
        opLog('Detected Open Project Work Package view with split panels - adding hide right side panel button');

        // create arrow button
        const arrowHolder = document.createElement('div');
        arrowHolder.id = 'op-extensions-hide-side-panel-arrow-container';

        const rightArrow = document.createElement('a');
        rightArrow.id = 'op-extensions-hide-side-panel-arrow';
        rightArrow.classList.add(
            'navigation-toggler',
            'icon4',
            'icon-double-arrow-right'
        );

        let isRightPanelHidden = false;
        const switchRightPanelHide = function () {
            if (isRightPanelHidden) {
                rightArrow.classList.remove('icon-double-arrow-left');
                rightArrow.classList.add('icon-double-arrow-right');

                rightPanel.style.minWidth = null;
                rightPanel.style.width = null;
                leftPanel.style.width = null;
            } else {
                rightArrow.classList.remove('icon-double-arrow-right');
                rightArrow.classList.add('icon-double-arrow-left');

                rightPanel.style.minWidth = '0px';
                rightPanel.style.width = '0.001%';
                leftPanel.style.width = '100%';
            }

            isRightPanelHidden = !isRightPanelHidden;
        };
        rightArrow.addEventListener('click', switchRightPanelHide);

        // add arrow button to the panel
        arrowHolder.appendChild(rightArrow);
        leftPanel.insertBefore(arrowHolder, leftPanel.firstChild);
    }

    // probably the work package wiew - try waiting for panels to show up
    const sidePanelsSelectors = [
        '.work-packages--left-panel',
        '.work-packages--right-panel'
    ];
    waitForElements(sidePanelsSelectors, 200, 50, addArrowButton);
};

const addDiffButtons = function () {
    // try to find expected diff view
    const diffView = document.querySelector('#content > .text-diff');

    // probably not Open Project diff view page - abort plugin execution
    if (!diffView) {
        return;
    }

    // found Open Project Diff View
    opLog('Detected OpenProject Diff View - adding buttons');

    // create buttons holder
    const btnHolder = document.createElement('p');
    btnHolder.style.margin = '0';
    btnHolder.style.padding = '0';

    // add buttons to buttons holder
    const addButton = function (holder, text, handler) {
        const button = document.createElement('a');
        button.classList.add('op-extensions-diff-button');
        button.innerText = text;
        button.addEventListener('click', handler);

        holder.appendChild(button);
    };


    const setDisplayFor = function (selector, displayValue) {
        const nodes = diffView.querySelectorAll(selector);
        if (nodes) {
            for (let i = 0; i < nodes.length; i++) {
                nodes[i].style.display = displayValue;
            }
        }
    }

    const modifyDiffView = function (showBefore, showAfter) {
        setDisplayFor('ins.diffmod', (showAfter  ? '' : 'none'));
        setDisplayFor('del.diffmod', (showBefore ? '' : 'none'));
    };

    addButton(btnHolder, 'Before',   modifyDiffView.bind(null, true,  false));
    addButton(btnHolder, 'After',    modifyDiffView.bind(null, false, true));
    addButton(btnHolder, 'Mix view', modifyDiffView.bind(null, true,  true));

    // add buttons holder with buttons before diff view
    diffView.parentNode.insertBefore(btnHolder, diffView);
};

const fixTableOfContents = function () {
    const fixLinksToHeaders = function ([editor]) {
        if (!editor) {
            opLogError('Editor not found');
            return;
        }

        const toc = editor.querySelector('.toc');
        if (!toc) {
            return;
        }

        opLog('Table of Contents detected - fixing links to headers');

        const links = editor.querySelectorAll('a');
        if (!links) {
            opLogError('Editor not found');
            return;
        }

        const urlSplit = document.URL.split("#");
        const baseUrl = urlSplit[0];

        for (let i = 0; i < links.length; i++) {
            const href = links[i].getAttribute('href');
            if (!href || href.startsWith("#") === false) {
                continue;
            }

            links[i].setAttribute('href', baseUrl + href);

            const classes = links[i].getAttribute('class');
            if (classes && classes.includes('wiki-anchor')) {
                links[i].parentNode.setAttribute('id', href.substring(1))
            }
        }

        if (urlSplit.length > 1) {
            document.getElementById(urlSplit[1]).scrollIntoView();
        }
    }

    const detectEditorSelectors = ['#work-package-description'];
    waitForElements(detectEditorSelectors, 200, 50, fixLinksToHeaders);
};


addDiffButtons();
if (isOnWorkPackageView()) {
    addHideSidePanelButton();
    fixTableOfContents();
}

