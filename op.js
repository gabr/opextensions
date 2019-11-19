/*
   chrome://extensions
   1. Prawy klawisz myszy na przycisku odświeżania rozszerzenia i "Zbadaj"
   2. Prawy klawisz myszy na elemencie w designerze i wybierz "Store as global variable"
   3. Teraz zmodyfikuj poniższą funkcję wpisują pod "temp1" utworzoną zmienną globalną.
   4. Teraz wklej i wykonaj poniższy kod w konsoli designera:

          const refreshExtensions = function () {
            temp1.click();
            setTimeout(refreshExtensions, 1500);
          }
          refreshExtensions();
*/

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

if (document.URL.includes('openproject')) {
    const waitForId = function (id, delay, numberOfTries, callback) {
        const check = function () {
            const element = document.getElementById(id);

            if (numberOfTries != null) {
                numberOfTries -= 1;
            }

            if (element) {
                callback(element);
            } else if (numberOfTries == null || numberOfTries) {
                setTimeout(check, delay);
            }
        }

        setTimeout(check, delay);
    }


    const isOnWorkPackageView = function () {
        return !!document.URL.match(/work_packages[/\\]\d+?/);
    }

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

    const addShortcuts = function () {
        document.addEventListener("keydown", function(e) {
            // ctrl + s
          if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && e.keyCode == 83) {
            if (isOnWorkPackageView() === false) {
                return;
            }

            const saveButton = document.querySelector('.inplace-edit--control--save a[href][title="Description: Save"]');
            if (!saveButton) {
                return;
            }

            e.preventDefault();
            saveButton.click();
          }

          if (e.keyCode == 27) {
            const cancelSaveButton = document.querySelector('.inplace-edit--control--cancel a[href][title="Description: Cancel"]');
            if (!cancelSaveButton) {
                return;
            }

            e.preventDefault();
            cancelSaveButton.click();
          }
        }, false);
    }

    const sendPostRequest = function (url, body, successCallback, errorCallback) {
        var r = new XMLHttpRequest();
        r.open("POST", url, true);
        r.timeout = 30000; // ms
        r.onerror = errorCallback;
        r.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
        r.setRequestHeader("Accept", "text/javascript, text/html, application/xml, text/xml, */*");

        r.onreadystatechange = function () {
            if (r.readyState != 4) {
                return;
            }

            if (r.status >= 200 && r.status < 300) {
                successCallback(r);
            } else {
                errorCallback(r);
            }
        };

        r.send(body);
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

        // make so header link goes to the My page
        var titleHeaderLink = document.querySelector('.home-link[href="https://10.0.0.101/openproject/"]')
        if (titleHeaderLink) {
            titleHeaderLink.setAttribute('href', 'https://10.0.0.101/openproject/my/page')
        }

    }

    monitorUrlChange();
    addShortcuts();
}

