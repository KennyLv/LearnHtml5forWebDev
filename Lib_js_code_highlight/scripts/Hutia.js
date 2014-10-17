/**********************
 Author: Hutia

 *********************/

window.onload = init;

//------------------
// Static Variable
//------------------

var KEYWORDS = "abstract break byte case catch char class const continue default delete do double else extends false final finally float for function goto if implements import in instanceof int interface long native null package private protected public reset return short static super switch synchronized this throw transient true try var void while with";

var OBJECTS = "Anchor Applet Area Arguments Array Boolean Button Checkbox Collection Crypto Date Dictionary Document Drive Drives Element Enumerator Event File FileObject FileSystemObject FileUpload Folder Folders Form Frame Function Global Hidden  History HTMLElement Image Infinity Input JavaArray JavaClass JavaObject JavaPackage JSObject Layer Link Math MimeType  Navigator Number Object Option Packages Password Plugin PrivilegeManager Random RegExp Screen Select String Submit Text  Textarea URL VBArray Window WScript";

var METHODS_PROPERTIES = "above abs acos action activeElement alert alinkColor all altKey anchor anchors appCodeName applets  apply appName appVersion arguments arity asin assign atan atan2 atob  availHeight availLeft availTop availWidth ActiveXObject  back background below bgColor big blink blur bold border borderWidths bottom btoa button call callee caller cancelBubble captureEvents ceil charAt charCodeAt charset checked children classes className clear clearInterval clearTimeout click clientInformation  clientX clientY close closed colorDepth compile complete concat confirm constructir contains contextual cookie cos crypto ctrlKey current data defaultCharset defaultChecked defaultSelected defaultStatus defaultValue description disableExternalCapture disablePrivilege document domain E Echo  element elements embeds enabledPlugin enableExternalCapture enablePrivilege encoding escape eval event exec exp expando FromPoint fgColor fileName find fixed floor focus fontColor fontSize form forms forward frames fromCharCode fromElement  getAttribute get getClass getDate getDay getFullYear getHours getMember getMilliseconds getMinutes getMonth getSeconds getSelection getSlot getTime getTimezoneOffset  getUTCDate getUTCDay getUTCFullYear getUTCHours getUTCMilliseconds getUTCMinutes getUTCMonth getUTCSeconds getWindow getYear global go HandleEvent Height  hash hidden history home host hostName href hspace id ids ignoreCase images index indexOf inner innerHTML innerText innerWidth insertAdjacentHTML insertAdjacentText isFinite isNAN italics java javaEnabled join keyCode Links LN10 LN2 LOG10E LOG2E  lang language lastIndex lastIndexOf lastMatch lastModified lastParen layers layerX layerY left leftContext length link linkColor load location locationBar log lowsrc MAX_VALUE MIN_VALUE  margins match max menubar method mimeTypes min modifiers moveAbove moveBelow moveBy moveTo moveToAbsolute multiline NaN NEGATIVE_INFINITY  name navigate navigator netscape next number offscreenBuffering offset offsetHeight offsetLeft offsetParent offsetTop offsetWidth offsetX offsetY onabort onblur onchange onclick ondblclick ondragdrop onerror onfocus  onHelp onkeydown onkeypress onkeyup onload onmousedown onmousemove onmouseout onmouseover onmouseup onmove onreset onresize onsubmit onunload open opener options outerHeight  outerHTML outerText outerWidth POSITIVE_INFINITY PI  paddings pageX pageXOffset pageY pageYOffset parent parentElement parentLayer parentWindow parse parseFloat parseInt pathname personalbar pixelDepth platform plugins pop  port pow preference previous print prompt protocol prototype push random readyState reason referrer refresh releaseEvents reload removeAttribute removeMember replace resizeBy resizeTo returnValue reverse right rightcontext round SQRT1_2 SQRT2  screenX screenY scroll scrollbars scrollBy scrollIntoView scrollTo search select selected selectedIndex self setAttribute setDay setFullYear setHotkeys setHours setInterval  setMember setMilliseconds setMinutes setMonth setResizable setSeconds setSlot setTime setTimeout setUTCDate setUTCFullYear setUTCHours setUTCMillseconds setUTCMinutes  setUTCMonth setUTCSeconds setYear setZOptions shift shiftKey siblingAbove siblingBelow signText sin slice smallsort source sourceIndex splice split sqrt src srcElement srcFilter status statusbar stop strike style sub submit substr substring suffixes sun sup systemLanguage TYPE tagName tags taint taintEnabled tan target test text title toElement toGMTString toLocaleString toLowerCase toolbar top toString toUpperCase toUTCString type typeOf UTC unescape unshift untaint unwatch userAgent userLanguage  value valueOf visibility vlinkColor vspace watch which width window write writeln x y zIndex";

var OPS = "! $ % & * + - // / : < = > ? [ ] ^ | ~ is  new sizeof  typeof unchecked";

var regKW = new RegExp("(\\W" + KEYWORDS.replace(/ /g, "$)|(\\W") + "$)", "g");
var regObj = new RegExp("(\\W" + OBJECTS.replace(/ /g, "$)|(\\W") + "$)", "g");
var regMP = new RegExp("(\\W" + METHODS_PROPERTIES.replace(/ /g, "$)|(\\W") + "$)", "g");
//var regOP=new RegExp("(\\W"+OPS.replace(/ /g,"$)|(\\W")+"$)","g");

//------------------
// Global Variables
//------------------
var divJSInput, txtJSInput, divMain, divJSOutputLineNo, divJSOutputPlus, divJSOutput, divWaiting;
var spnProcess, cmdStop, divJSExport, selJSExport, divJSExportContent;
var glbStr, glbP, glbRe, curRe, glbTimer, glbBusy, glbFuntionNames;

function init() {
	// init global variables
	divJSInput = document.getElementById("divJSInput");
	txtJSInput = document.getElementById("txtJSInput");
	divMain = document.getElementById("divMain");
	divJSOutputLineNo = document.getElementById("divJSOutputLineNo");
	divJSOutputPlus = document.getElementById("divJSOutputPlus");
	divJSOutput = document.getElementById("divJSOutput");
	divWaiting = document.getElementById("divWaiting");
	spnProcess = document.getElementById("spnProcess");
	cmdStop = document.getElementById("cmdStop");
	divJSExport = document.getElementById("divJSExport");
	selJSExport = document.getElementById("selJSExport");
	divJSExportContent = document.getElementById("divJSExportContent");

	// init window state
	maximizeWindow();

	divMain.style.width = document.body.clientWidth - 4;
	divMain.style.height = document.body.clientHeight - 26;

	divJSOutput.style.width = document.body.clientWidth - 72;

	// init global events

	divJSOutputLineNo.onselectstart = divJSOutputLineNo.onselect = divJSOutputPlus.onselectstart = divJSOutputPlus.onselect=cancelEvents;

	divJSOutput.onscroll = divJSOutput_onscroll;

	divJSInput.onkeydown = divJSInput_keydown;
	divJSExport.onkeydown = divJSExport_keydown;

}

//------------------
// event scripts
//------------------

function cancelEvents(e) {
	var e = window.event ? window.event : e;
	e.returnValue = false;
	return (false);
}

function divJSInput_keydown(e) {
	var e = window.event ? window.event : e;
	var srcEle = e.srcElement ? e.srcElement : e.target;
	var sel;
	if (e.keyCode == 27)
		hideJSInput();
	if (e.keyCode == 13 && e.ctrlKey)
		execJSInput();
	if (e.keyCode == 9 && srcEle == txtJSInput) {
		document.selection.createRange().text = "\t";
		return (false);
		// not support FF
	}
}

function divJSExport_keydown(e) {
	var e = window.event ? window.event : e;
	var srcEle = e.srcElement ? e.srcElement : e.target;
	var sel;
	if (e.keyCode == 27)
		hideJSExport();
	if (e.keyCode == 13 && e.ctrlKey)
		hideJSExport();
}

function divJSOutput_onscroll() {
	divJSOutputLineNo.scrollTop = divJSOutputPlus.scrollTop = divJSOutput.scrollTop;
}

//------------------
// functional scripts
//------------------

function showJSInput() {
	if (glbBusy)
		return;
	hideJSExport();
	with (divJSInput.style) {
		display = "block";
		left = (document.body.clientWidth - divJSInput.offsetWidth) / 2;
		top = (document.body.clientHeight - divJSInput.offsetHeight) / 2;
	}

	txtJSInput.focus();

	return (false);
}

function showJSExport() {
	if (glbBusy)
		return;
	hideJSInput();
	with (divJSExport.style) {
		display = "block";
		left = (document.body.clientWidth - divJSExport.offsetWidth) / 2;
		top = (document.body.clientHeight - divJSExport.offsetHeight) / 2;
	}
	divJSExportContent.style.display = "none";
	selJSExport.style.display = "block";

	selJSExport.focus();
	return (false);
}

function hideJSInput() {
	divJSInput.style.display = "none";
}

function hideJSExport() {
	divJSExport.style.display = "none";
}

function execJSInput() {
	hideJSInput();

	divJSOutput.innerHTML = "";
	divJSOutputLineNo.innerHTML = "";
	divJSOutputPlus.innerHTML = "";

	glbStr = txtJSInput.innerText;
	// not support FF
	glbP = 0;
	glbFuntionNames = new Array();
	curRe = glbRe = document.createElement("div");

	divJSOutput.appendChild(glbRe);
	glbRe.className = "codeRoot";

	while (selJSExport.options.length > 0)
	selJSExport.options[0] = null;

	showWait(startRecalcLine);
	core_analysis();
}

function execJSExport() {
	var fns = new Array(), fcs = new Array(), str;

	for (var i = 0; i < selJSExport.options.length; i++) {
		if (selJSExport.options[i].selected) {
			fns.push(selJSExport.options[i].value);
			str = selJSExport.options[i].obj.outerHTML;
			try {
				str += selJSExport.options[i].obj.nextSibling.outerHTML;
				str += selJSExport.options[i].obj.nextSibling.nextSibling.outerHTML;
			} catch(e) {
			}
			fcs.push(str);
		}
	}
	if (fns.length == 0)
		return;

	divJSExportContent.style.display = "block";
	selJSExport.style.display = "none";

	divJSExportContent.innerHTML = fcs.join("\r\n<br>\r\n");
}

function execJSExport_Dep() {
	var fns = new Array(), fcs = new Array(), str, regFNs = new Array(), needDepthTest;

	for (var i = 0; i < selJSExport.options.length; i++) {
		if (selJSExport.options[i].selected) {
			fns.push(selJSExport.options[i].value);
			try {
				str = selJSExport.options[i].obj.nextSibling.outerHTML;
			} catch(e) {
			}
			fcs.push(str);
		}
	}
	if (fns.length == 0)
		return;

	divJSExportContent.style.display = "none";
	selJSExport.style.display = "block";

	needDepthTest = false;
	for (var i = 0; i < glbFuntionNames.length; i += 1) {
		if (!selJSExport.options[i].selected) {
			for ( j = 0; j < fcs.length; j++) {
				if (html2txt(fcs[j]).match(glbFuntionNames[i].replace(/\./g, "\\."))) {
					selJSExport.options[i].selected = true;
					needDepthTest = true;
					break;
				}
			}
		}
	}
	if (needDepthTest)
		execJSExport_Dep();
}

function showWait(onstop) {
	glbBusy = true;
	document.body.style.cursor = "wait";

	with (divWaiting.style) {
		display = "block";
		left = (document.body.clientWidth - divWaiting.offsetWidth) / 2;
		top = (document.body.clientHeight - divWaiting.offsetHeight) / 2;
	}
	spnProcess.innerHTML = "0.00%  ( 0 / 0 )";
	divWaiting.onstop = onstop;
	cmdStop.focus();
	return (false);
}

function hideWait() {
	glbBusy = false;
	document.body.style.cursor = "";
	divWaiting.style.display = "none";
	try {
		clearTimeout(glbTimer);
	} catch(e) {
	}
	try {
		divWaiting.onstop();
	} catch(e) {
	}
	return (false);
}

function stopExec() {
	hideWait();
}

function startRecalcLine() {
	var re = "", re2 = "";
	if (glbBusy)
		return;
	glbBusy = true;

	for (var i = 0; i < parseInt(divJSOutput.scrollHeight / 14 + 200); i++) {
		re += "<p>" + (i + 1) + "</p>";
		re2 += "<p> </p>";
	}

	divJSOutputLineNo.innerHTML = re;
	divJSOutputPlus.innerHTML = re2;
	divJSOutputPlus.buttons = new Array();

	glbP = 0;

	showWait();
	recalcLine();
	return (false);

}

function recalcLine() {
	var objs, j;

	objs = document.getElementsByTagName("div");
	for (var i = glbP; i < objs.length && (i - glbP < 30); i++) {
		if (objs[i].className == "indent") {
			j = parseInt(objs[i].offsetTop / 14) - 1;
			divJSOutputPlus.childNodes[j].className = "colsp";
			divJSOutputPlus.childNodes[j].innerHTML = "-";
			divJSOutputPlus.childNodes[j].linkedDIV = objs[i];
			divJSOutputPlus.childNodes[j].startIndex = j + 1;
			divJSOutputPlus.childNodes[j].endIndex = j + Math.round(objs[i].offsetHeight / 14);
			if (objs[i].innerHTML != "")
				divJSOutputPlus.childNodes[j].endIndex++;
			divJSOutputPlus.childNodes[j].switchDIV = divJSOutputPlus.childNodes[j].onclick = switchDIV;
			divJSOutputPlus.buttons.push(divJSOutputPlus.childNodes[j]);
		}
	}
	spnProcess.innerHTML = parseFloat(glbP / objs.length * 100).toFixed(2) + "%  ( " + glbP + " / " + objs.length + " )";
	if (i < objs.length) {
		glbP = i;
		glbTimer = setTimeout(recalcLine);
		return;
	}
	stopExec();
	divJSOutput_onscroll();
}

function switchDIV(disp) {
	var y, obj;
	if ((this.className == "colsp" || disp == "hide") && disp != "show") {
		this.className = "colsp2";
		this.innerHTML = "+";
		for (var i = this.startIndex; i < this.endIndex; i++) {
			divJSOutputLineNo.childNodes[i].style.display = "none";
			divJSOutputPlus.childNodes[i].style.display = "none";
		}
		this.linkedDIV.style.display = "none";
	} else {
		this.className = "colsp";
		this.innerHTML = "-";
		this.linkedDIV.style.display = "block";
		for (var i = this.startIndex; i < this.endIndex; i++) {
			divJSOutputLineNo.childNodes[i].style.display = "block";
			divJSOutputPlus.childNodes[i].style.display = "block";
			if (divJSOutputPlus.childNodes[i].className == "colsp2") {
				i = divJSOutputPlus.childNodes[i].endIndex - 1;
			}
		}
	}
	divJSOutput_onscroll();
}

function collapseAll(index) {
	index = isNaN(parseInt(index)) ? 0 : parseInt(index);
	if (!divJSOutputPlus.buttons)
		return;
	if (index < 0)
		index = 0;
	if (index > divJSOutputPlus.buttons.length)
		return;
	for (var i = index; i < divJSOutputPlus.buttons.length && i - index < 10; i++)
		divJSOutputPlus.buttons[i].switchDIV("hide");
	setTimeout("collapseAll(" + i + ")");
}

function expandAll(index) {
	index = isNaN(parseInt(index)) ? 0 : parseInt(index);
	if (!divJSOutputPlus.buttons)
		return;
	if (index < 0)
		index = 0;
	if (index > divJSOutputPlus.buttons.length)
		return;
	for (var i = index; i < divJSOutputPlus.buttons.length && i - index < 10; i++)
		divJSOutputPlus.buttons[i].switchDIV("show");
	setTimeout("expandAll(" + i + ")");
}

function core_analysis() {
	var str = " ", c = "", lastState = "", seq, intNextQuote, intTemp, intCount, intWordStart;
	spnProcess.innerHTML = parseFloat(glbP / glbStr.length * 100).toFixed(2) + "%  ( " + glbP + " / " + glbStr.length + " )";
	for (var i = glbP; i < glbStr.length; i++) {
		c = glbStr.charAt(i);
		str += htmlEncode(c);
		switch(c) {
			case "\r":
			case " ":
			case "\t":
				if (lastState == "\r\n") {
					str = " ";
					break;
				}
				str = str.substring(0, str.length - htmlEncode(c).length);
				if (lastState == "blank")
					break;
				if (c.match(/\W/) && glbStr.charAt(i - 1).match(/\w/)) {
					str = str.replace(regKW, clKW).replace(regObj, clObj).replace(regMP, clMP);
				}
				str += htmlEncode(c);
				lastState = "blank";
				break;
			case ";":
				if (str.match(/\Wfor.*?\(/i))
					break;
			// attention there's no break here
			case "\n":
				if (lastState == "\r\n") {
					str = " ";
					break;
				}
				outputLn(str);
				str = " ";
				lastState = "\r\n";
				if (i - glbP > 200) {
					glbP = i + 1;
					glbTimer = setTimeout(core_analysis);
					return;
				}
				break;
			case "\"":
				intNextQuote = i;
				while (intNextQuote != -1 && intNextQuote < glbStr.length) {
					intNextQuote = glbStr.indexOf("\"", intNextQuote + 1);
					if (intNextQuote == -1 || glbStr.charAt(intNextQuote - 1) != "\\")
						break;
					intCount = 0;
					intTemp = intNextQuote;
					while (glbStr.charAt(--intTemp) == "\\")
					intCount++;
					if (intCount % 2 == 0)
						break;
				}
				if (intNextQuote == -1)
					break;
				str += "<span class=\"quote\">" + htmlEncode(glbStr.substring(i + 1, intNextQuote)) + "<\/span>\"";
				i = intNextQuote;
				lastState = "";
				break;
			case "\'":
				intNextQuote = i;
				while (intNextQuote != -1 && intNextQuote < glbStr.length) {
					intNextQuote = glbStr.indexOf("\'", intNextQuote + 1);
					if (intNextQuote == -1 || glbStr.charAt(intNextQuote - 1) != "\\")
						break;
					intCount = 0;
					intTemp = intNextQuote;
					while (glbStr.charAt(--intTemp) == "\\")
					intCount++;
					if (intCount % 2 == 0)
						break;
				}
				if (intNextQuote == -1)
					break;
				str += "<span class=\"quote\">" + htmlEncode(glbStr.substring(i + 1, intNextQuote)) + "<\/span>\'";
				i = intNextQuote;
				lastState = "";
				break;
			case "\/":
				if (glbStr.charAt(i + 1) == "\/") {
					intNextQuote = i;
					intNextQuote = glbStr.indexOf("\r\n", intNextQuote + 1);
					if (intNextQuote == -1)
						intNextQuote = glbStr.length;
					str = str.substring(0, str.length - 1);
					str += "<span class=\"comments\">\/" + htmlEncode(glbStr.substring(i + 1, intNextQuote)) + "<\/span>";
					i = intNextQuote;
				} else if (glbStr.charAt(i + 1) == "*") {
					intNextQuote = i;
					intNextQuote = glbStr.indexOf("*\/", intNextQuote + 1);
					if (intNextQuote == -1)
						return;
					str = str.substring(0, str.length - 1);
					str += "<span class=\"comments\">\/" + htmlEncode(glbStr.substring(i + 1, intNextQuote)) + "*\/<\/span>";
					i = intNextQuote + 1;
				} else if (str.match(/[=(][ \t]*\//)) {
					intNextQuote = i;
					while (intNextQuote != -1 && intNextQuote < glbStr.length) {
						intNextQuote = glbStr.indexOf("\/", intNextQuote + 1);
						if (intNextQuote == -1 || glbStr.charAt(intNextQuote - 1) != "\\")
							break;
						intCount = 0;
						intTemp = intNextQuote;
						while (glbStr.charAt(--intTemp) == "\\")
						intCount++;
						if (intCount % 2 == 0)
							break;
					}
					if (intNextQuote == -1)
						break;
					str += "<span class=\"regexp\">" + htmlEncode(glbStr.substring(i + 1, intNextQuote)) + "<\/span>\/";
					i = intNextQuote;
					lastState = "";
				}
				lastState = "";
				break;
			case "{":
				outputLn(str);
				str = " ";
				seq = document.createElement("div");
				seq.className = "indent";
				curRe.appendChild(seq);
				curRe = seq;
				lastState = "\r\n";
				if (i - glbP > 200) {
					glbP = i + 1;
					glbTimer = setTimeout(core_analysis);
					return;
				}
				break;
			case "}":
				outputLn(str.substring(0, str.length - 1));
				str = "} ";
				lastState = "";
				curRe = curRe.parentNode;
				break;
			default:
				if (c.match(/\w/) && glbStr.charAt(i - 1).match(/\W/)) {
					intWordStart = i;
				}
				if (c.match(/\W/) && glbStr.charAt(i - 1).match(/\w/)) {
					str = str.substring(0, str.length - htmlEncode(c).length);
					str = str.replace(regKW, clKW).replace(regObj, clObj).replace(regMP, clMP) + htmlEncode(c);
				}
				lastState = "";
				break;
		}
	}

	if (i == glbStr.length) {
		if (str != "") {
			outputLn(str);
			str = " ";
		}
		stopExec();
	}

}

function outputLn(theStr) {
	var seq, txt, fn;
	if (html2txt(theStr).match(/^[ \t\r\n]*$/))
		return;
	seq = document.createElement("p");
	seq.innerHTML = theStr;
	curRe.appendChild(seq);

	txt = html2txt(theStr);
	if (!txt)
		return;
	fn = txt.match(/function[ \t\r\n]+([\.\w]+?)[ \t\r\n]*\(.*?\)[ \t\r\n]*\{/);
	if (fn) {
		glbFuntionNames.push(fn[1]);
		selJSExport.options[selJSExport.options.length] = new Option(fn[0] + "}", fn[1]);
		selJSExport.options[selJSExport.options.length - 1].obj = seq;
	}
	fn = txt.match(/([\.\w]+?)[ \t\r\n]*=[ \t\r\n]*function\W*\(.*?\)[ \t\r\n]*\{/);
	if (fn) {
		glbFuntionNames.push(fn[1]);
		selJSExport.options[selJSExport.options.length] = new Option(fn[0] + "}", fn[1]);
		selJSExport.options[selJSExport.options.length - 1].obj = seq;
	}
}

function clKW(str) {
	return (str.charAt(0) + "<span class=\"keyWord\">" + str.substring(1) + "</span>");
}

function clObj(str) {
	return (str.charAt(0) + "<span class=\"object\">" + str.substring(1) + "</span>");
}

function clMP(str) {
	return (str.charAt(0) + "<span class=\"method_property\">" + str.substring(1) + "</span>");
}

function clOP(str) {
	return (str.charAt(0) + "<span class=\"operator\">" + str.substring(1) + "</span>");
}

//------------------
// global scripts
//------------------

function maximizeWindow() {
	window.moveTo(0, 0);
	window.resizeTo(screen.availWidth, screen.availHeight);
}

function htmlEncode(strS) {
	return (strS.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/ /g, " ").replace(/ \r\n/g, "<br\/>"));
}

function html2txt(strS) {
	return (strS.replace(/<.+?>/g, "").replace(/</g, "<").replace(/>/g, ">").replace(/ /g, " ").replace(/<br\/?>/g, "\r\n").replace(/&/g, "&"));
}
