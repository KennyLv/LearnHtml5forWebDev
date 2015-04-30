// JavaScript Document

// possibly find this when the ul gets a max height of 0.
var mobileWidth = 639;

// fixes drop downs in Android & iOS
if (((navigator.userAgent.toLowerCase().indexOf("android") > -1) || (navigator.userAgent.match(/(iPad)/g))) && jQuery(window).width() > mobileWidth) {
	jQuery(document).ready(function() {
		jQuery("#navWrapper nav ul li ul, #navWrapper nav ul li ul li ul").parent("li").children("a").each(function() {
			var touched = false;
			jQuery(this).click(function(e) {
				if (touched == true) {
				} else {
					e.preventDefault();
					touched = true;
				};
			});
			jQuery(this).mouseleave(function() {
				touched = false;
			});
		});
		// things to note:
		// 1. If a user has a mouse attached to an Android device, this may
		//    not work as expected. More research is required to determine
		//    if I can check between Android click events and hover events.
	});
};

// fixes drop downs in Windows (Internet Explorer)
function ariaHaspopupEnabler() {
	if (!navigator.userAgent.match(/IEMobile/)) {
		jQuery("#navWrapper nav ul li ul, #navWrapper nav ul li ul li ul").each(function() {
			jQuery(this).parent("li").children("a").attr("aria-haspopup","true");
		});
	};
}
function ariaHaspopupDisabler() {
	if (!navigator.userAgent.match(/IEMobile/)) {
		jQuery("#navWrapper nav ul li ul, #navWrapper nav ul li ul li ul").each(function() {
			jQuery(this).parent("li").children("a").attr("aria-haspopup","false");
		});
	};
}
jQuery(document).ready(function() {
	ariaHaspopupEnabler();
});
jQuery(window).resize(function() {
	if (jQuery(window).width() > mobileWidth) {
		ariaHaspopupEnabler();
	} else {
		ariaHaspopupDisabler();
	}
});

// opening/closing nav

jQuery("#navWrapper nav button").click(function(e) {
    e.preventDefault();
    jQuery("html").toggleClass("navopen");
    var scrollPosition = [
        self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
        self.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
    ];
    if (jQuery("html").hasClass("navopen")) {
        var html = jQuery('html');
        html.data('scroll-position', scrollPosition);
        html.data('previous-overflow', html.css('overflow'));
        html.css('overflow', 'hidden');
        window.scrollTo(scrollPosition[0], scrollPosition[1]);
    } else {
        // un-lock scroll position
        var html = jQuery('html');
        var scrollPosition = html.data('scroll-position');
        html.css('overflow', html.data('previous-overflow'));
        window.scrollTo(scrollPosition[0], scrollPosition[1])
    }
});
jQuery(window).resize(function() {
    if (jQuery(window).width() > 639 && jQuery("html").hasClass("navopen")) {
        jQuery("html").removeClass("navopen");
        var html = jQuery('html');
        var scrollPosition = html.data('scroll-position');
        html.css('overflow', html.data('previous-overflow'));
        window.scrollTo(scrollPosition[0], scrollPosition[1])
    }
})
jQuery(document).on("click", "#mobileNavWrapper #mobileNav nav ul li button", function(e) {
    e.preventDefault();
    jQuery(this).parent("li").toggleClass("open");
});

// opening/closing search

jQuery("#navWrapper nav form input[type=submit]").click(function(e) {
    if (jQuery(window).width() < 960 && !jQuery(this).parent("form").hasClass("open")) {
        e.preventDefault();
        jQuery(this).parent("form").addClass("open");
        jQuery(this).parent("form").children("div").children("input").focus();
    }
});
jQuery("#navWrapper nav form div input").blur(function() {
    if (jQuery(window).width() < 960 && !jQuery(this).parent("form").hasClass("open")) {
        jQuery(this).parent("div").parent("form").removeClass("open");
    }
});
