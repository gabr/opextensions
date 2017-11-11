var docLoaded = setInterval(function () {
	// if not ready try again later
	if(document.readyState !== "complete") {
		return;
	}

	// probably ready, dont try again
	clearInterval(docLoaded);

	// try to find expected "Back" button below diff view
	var diffView = document.querySelectorAll('#content > .text-diff')[0];

	// probably not Open Project page - abort plugin execution
	if (!diffView) {
		return;
	}

	// for logging messages from extension
	var opLog = function (text) {
		console.log("OPExtensions: " + text);
	}

	// found Open Project Diff View
	opLog("Detected OpenProject Diff View - adding buttons");

	// create buttons holder
	var btnHolder = document.createElement("p");
	btnHolder.style.margin = "0";
	btnHolder.style.padding = "0";

	// add buttons to buttons holder
	var addButton = function (holder, text, handler) {
		var button = document.createElement("a");
		var text = document.createTextNode(text);

		button.style.paddingRight = "7px";
		button.style.paddingLeft  = "7px";
		button.appendChild(text);
		
		if (handler) {
			button.addEventListener('click', handler);
		}

		holder.appendChild(button);
	};

	var modifyDiffView = function (showBefore, showAfter) {
		diffView.querySelectorAll('ins.diffmod').forEach((el) => {
			el.style.display = showAfter ? "" : "none";
		});
		diffView.querySelectorAll('del.diffmod').forEach((el) => {
			el.style.display = showBefore ? "" : "none";
		});
	};

	addButton(btnHolder, "Before",   () => { modifyDiffView(true,  false); });
	addButton(btnHolder, "After",    () => { modifyDiffView(false, true);  });
	addButton(btnHolder, "Mix view", () => { modifyDiffView(true,  true);  });

	// add buttons holder with buttons before diff view
	diffView.parentNode.insertBefore(btnHolder, diffView);
}, 30);
