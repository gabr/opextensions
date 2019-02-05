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
    const addArrowButton = function ([leftPanel, rightPanel]) {
        if (leftPanel.innerHTML.includes('op-extensions-hide-side-panel-arrow-container')) {
            return;
        }

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

                rightPanel.classList.remove('hide-right-panel');
                leftPanel.classList.remove('hide-right-panel');
            } else {
                rightArrow.classList.remove('icon-double-arrow-right');
                rightArrow.classList.add('icon-double-arrow-left');

                rightPanel.classList.add('hide-right-panel');
                leftPanel.classList.add('hide-right-panel');
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

    if (diffView.innerHTML.includes('op-extensions-diff-button')) {
        return;
    }

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
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) {
        return;
    }

    if (sidebar.innerHTML.includes('syntax-reference')) {
        return;
    }

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

    sidebar.innerHTML = syntaxReferenceHtml;
}

let wrapperClassChangeOberver = null;
const shrinkLeftMenu = function () {
    const wrapper = document.getElementById('wrapper');
    if (!wrapper) {
        return;
    }

    const addRemoveShrinkClass = function () {
        const classes = wrapper.getAttribute('class');
        if (classes.includes('hidden-navigation')) {
            if (!classes.includes('shrink-left-menu')) {
                return;
            }
            wrapper.classList.remove('shrink-left-menu');
        } else {
            if (classes.includes('shrink-left-menu')) {
                return;
            }
            wrapper.classList.add('shrink-left-menu');
        }
    }

    addRemoveShrinkClass();

    wrapperClassChangeOberver = new MutationObserver(addRemoveShrinkClass);
    wrapperClassChangeOberver.observe(wrapper, {
      attributes: true,
      attributeFilter: ['class'],
      childList: false,
      characterData: false
    });
}

const shrinkRightPanel = function () {
    const body = document.getElementsByTagName('body')[0];
    if (body.getAttribute('class').includes('shrink-right-panel')) {
        return;
    }

    body.classList.add('shrink-right-panel');
}

const fixEditButton = function () {
    const moveEditButtonOutsideEditor = function ([editButton, editor]) {
        if (editButton.getAttribute('class').includes('edti-button-outside-editor')) {
            return;
        }

        const parent = editButton.parentNode;
        editButton.removeChild(editor);

        parent.removeChild(editButton);
        editor.removeChild(editor.getElementsByClassName('inplace-edit--icon-wrapper')[0]);

        parent.appendChild(editor);
        parent.appendChild(editButton);

        editButton.classList.add('edit-button-outside-editor');
    }

    const editorSelectors = [
        '#work-package-description .inplace-editing--container',
        '#work-package-description .inplace-editing--trigger-link'
    ];
    waitForElements(editorSelectors, 200, 50, moveEditButtonOutsideEditor);
}

const addCtrlSSupport = function () {
    document.addEventListener("keydown", function(e) {
      if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && e.keyCode == 83) {
        if (isOnWorkPackageView() === false) {
            return;
        }

        const saveButton = document.querySelector('.inplace-edit--controls .inplace-edit--control--save a');
        if (!saveButton) {
            return;
        }

        e.preventDefault();
        saveButton.click();
      }
    }, false);
}

// when url changes
let prevUrl = null;
const monitorUrlChange = function () {
    setTimeout(monitorUrlChange, 300);
    if (document.URL === prevUrl) {
        return;
    }

    prevUrl = document.URL;
    addDiffButtons();
    if (isOnWorkPackageView()) {
        shrinkLeftMenu();
        addHideSidePanelButton();
        fixTableOfContents();
        scrollIntoAnchorOnLoad();
        addSyntaxReference();
        shrinkRightPanel();
        fixEditButton();
    }
}

monitorUrlChange();
addCtrlSSupport();

