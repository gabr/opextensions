// for logging messages from extension
const opLog = function (text) {
	console.log("OPExtensions: " + text);
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

const addHideSidePanelButton = function () {
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
		leftPanel.insertBefore(arrowHolder, leftPanel.firstChild]);
	}

	// check out if it may be the work package view
	if(!~window.location.href.indexOf("work_package")) {
		// not the work package view - abort
		return;
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
		[].forEach.call(diffView.querySelectorAll(selector), node => {
			node.style.display = displayValue;
		});
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

addDiffButtons();
addHideSidePanelButton();
