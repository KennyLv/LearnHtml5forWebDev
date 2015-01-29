function GetElementsByName(name) {
	// Workaround a bug on old versions of opera.
	if (document.getElementsByName) {
		return document.getElementsByName(name);
	} else {
		return [ document.getElementById(name) ];
	}
}

/**
 * @param {string}
 *            namePrefix The prefix of the body name.
 * @param {function(boolean):
 *            boolean} getVisibility Computes the new visibility state, given
 *            the current one.
 */
function ChangeVisibility(namePrefix, getVisibility) {
	var bodyName = namePrefix + '__body';
	var buttonName = namePrefix + '__button';
	var bodyElements = GetElementsByName(bodyName);
	if (bodyElements.length != 1) {
		throw Error('ShowHideByName() got the wrong number of bodyElements:  ' + bodyElements.length);
	} else {
		var bodyElement = bodyElements[0];
		var buttonElement = GetElementsByName(buttonName)[0];
		var isVisible = bodyElement.style.display != "none";
		if (getVisibility(isVisible)) {
			bodyElement.style.display = "inline";
			buttonElement.innerHTML = '▽';
		} else {
			bodyElement.style.display = "none";
			buttonElement.innerHTML = '▶';
		}
	}
}

function ShowHideByName(namePrefix) {
	ChangeVisibility(namePrefix, function(old) {
		return !old;
	});
}

function ShowByName(namePrefix) {
	ChangeVisibility(namePrefix, function() {
		return true;
	});
}

function ShowHideAll() {
	var allButton = GetElementsByName("show_hide_all_button")[0];
	if (allButton.innerHTML == '▽') {
		allButton.innerHTML = '▶';
		SetHiddenState(document.getElementsByTagName("body")[0].childNodes, "none", '▶');
	} else {
		allButton.innerHTML = '▽';
		SetHiddenState(document.getElementsByTagName("body")[0].childNodes, "inline", '▽');
	}
}

// Recursively sets state of all children
// of a particular node. keleyi.com
function SetHiddenState(root, newState, newButton) {
	for ( var i = 0; i != root.length; i++) {
		SetHiddenState(root[i].childNodes, newState, newButton);
		if (root[i].className == 'showhide_button') {
			root[i].innerHTML = newButton;
		}
		if (root[i].className == 'stylepoint_body' || root[i].className == 'link_button') {
			root[i].style.display = newState;
		}
	}
}

function EndsWith(str, suffix) {
	var l = str.length - suffix.length;
	return l >= 0 && str.indexOf(suffix, l) == l;
}

function RefreshVisibilityFromHashParam() {
	var hashRegexp = new RegExp('#([^&#]*)$');
	var hashMatch = hashRegexp.exec(window.location.href);
	var anchor = hashMatch && GetElementsByName(hashMatch[1])[0];
	var node = anchor;
	var suffix = '__body';
	while (node) {
		var id = node.id;
		var matched = id && EndsWith(id, suffix);
		if (matched) {
			var len = id.length - suffix.length;
			ShowByName(matched.substring(0, len));
			if (anchor.scrollIntoView) {
				anchor.scrollIntoView();
			}

			return;
		}
		node = node.parentNode;
	}
}

window.onhashchange = RefreshVisibilityFromHashParam;

window.onload = function() {
	// if the URL contains "?showall=y", expand the details of all children
	var showHideAllRegex = new RegExp("[\\?&](showall)=([^&#]*)");
	var showHideAllValue = showHideAllRegex.exec(window.location.href);
	if (showHideAllValue != null) {
		if (showHideAllValue[2] == "y") {
			SetHiddenState(document.getElementsByTagName("body")[0].childNodes, "inline", '▽');
		} else {
			SetHiddenState(document.getElementsByTagName("body")[0].childNodes, "none", '▶');
		}
	}
	var showOneRegex = new RegExp("[\\?&](showone)=([^&#]*)");
	var showOneValue = showOneRegex.exec(window.location.href);
	if (showOneValue) {
		ShowHideByName(showOneValue[2]);
	}

	RefreshVisibilityFromHashParam();
}