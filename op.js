const opLog = function (text) {
    console.log("OPExtensions: " + text);
}
const opLogError = function (text) {
    console.error("OPExtensions error: " + text);
}


const waitForElements = function (selectors, delay, numberOfTries, callback) {
    const selector = selectors.join(',');

    const check = function () {
        const elements = document.querySelectorAll(selectors);

        if (numberOfTries != null) {
            numberOfTries -= 1;
        }

        if (elements.length === selectors.length) {
            callback(elements);
        } else if (numberOfTries == null || numberOfTries) {
            setTimeout(check, delay);
        }
    }

    setTimeout(check, delay);
}

const isOnWorkPackageView = function () {
    return !!document.URL.match(/work_packages[/\\]\d+?/);
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
    setTimeout(fixTableOfContents, 300);

    const editor = document.querySelector('#work-package-description');
    if (!editor) {
        return;
    }

    const toc = editor.querySelector('.toc');
    if (!toc) {
        return;
    }

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
};

const scrollIntoAnchorOnLoad = function () {
    const urlSplit = document.URL.split("#");

    if (urlSplit.Length <= 1) {
        return;
    }

    const anchor = urlSplit[1];
    waitForElements(['#work-package-description'], 400, 50, function () {
        const element = document.getElementById(anchor);
        if (element) {
            element.scrollIntoView();
        }
    });
}

const addSyntaxReference = function () {
    const syntaxReferenceHtml = String.raw`
<div id='syntax-reference'>
<h2>Syntax</h2>
<ul>
    <li>Formatting
        <ul>
            <li><strong>*strong*</strong></li>
            <li><em>_Italic_</em></li>
            <li><ins>+Underline+</ins></li>
            <li><del>-Deleted-</del></td>
            <li><cite>??Quote??</cite></td>
            <li><code>@Inline Code@</code></td>
            <li>
                <pre>&lt;pre&gt;
lines
of code
&lt;/pre&gt;</pre>
            </li>
        </ul>
    </li>
    <li>Lists
        <ul>
            <li>
                <ul>
                    <li>* Item 1</li>
                    <li>* Item 2</li>
                </ul>
            </li>
            <li>
                <ol>
                    <li># Item 1</li>
                    <li># Item 2</li>
                </ol>
            </li>
        </ul>
    </li>
    <li>
        Headings:
        <ul>
            <li>.h1 Title 1</li>
            <li>.h2 Title 2</li>
            <li>.h3 Title 3</li>
        </ul>
    </li>
    <li>Links
        <ul>
            <li><a href="http://foo.bar">http://foo.bar</a></li>
            <li><a href="http://foo.bar">"Foo"</a>:http://foo.bar</li>
        </ul>
    </li>
    <li>OP Links
        <ul>
            <li>[[Wiki page]]</li>
            <li>[[ProjectName:Wiki page]]</li>
            <li>WorkPackage #12</li>
            <li>WorkPackage ##12</li>
            <li>WorkPackage ###12</li>
            <li>Revision r13</li>
        </ul>
    </li>
</ul>
</div>
`;

    const sidebar = document.getElementById('sidebar');
    if (!sidebar) {
        return;
    }

    opLog('Detected sidebar - adding syntax reference');
    sidebar.innerHTML = syntaxReferenceHtml;
}


addDiffButtons();
if (isOnWorkPackageView()) {
    addHideSidePanelButton();
    fixTableOfContents();
    scrollIntoAnchorOnLoad();
    addSyntaxReference();
}

