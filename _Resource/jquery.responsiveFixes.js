// JavaScript Document

// fixes media querries in Internet Explorer
if (navigator.userAgent.match(/IEMobile/)) {
	var msViewportStyle = document.createElement("style")
	msViewportStyle.appendChild(
		document.createTextNode(
			"@-ms-viewport{width:auto!important}"
		)
	)
	document.getElementsByTagName("head")[0].appendChild(msViewportStyle)
}
