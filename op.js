const addButtons = function () {
	// for logging messages from extension
	const opLog = function (text) {
		console.log("OPExtensions: " + text);
	}

	// try to find expected "Back" button below diff view
	const diffView = document.querySelector('#content > .text-diff');

	// probably not Open Project page - abort plugin execution
	if (!diffView) {
		return;
	}

	// found Open Project Diff View
	opLog("Detected OpenProject Diff View - adding buttons");

	// create buttons holder
	const btnHolder = document.createElement("p");
	btnHolder.style.margin = "0";
	btnHolder.style.padding = "0";

	// add buttons to buttons holder
	var addButton = function (holder, text, handler) {
		const button = document.createElement("a");

		button.innerText = text
		button.style.paddingRight = "7px";
		button.style.paddingLeft  = "7px";
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
		setDisplayFor('ins.diffmod', (showAfter  ? "" : "none"))
		setDisplayFor('del.diffmod', (showBefore ? "" : "none"))
	};

	addButton(btnHolder, "Before",   modifyDiffView.bind(null, true,  false));
	addButton(btnHolder, "After",    modifyDiffView.bind(null, false, true));
	addButton(btnHolder, "Mix view", modifyDiffView.bind(null, true,  true));

	// add buttons holder with buttons before diff view
	diffView.parentNode.insertBefore(btnHolder, diffView);
};

addButtons();

