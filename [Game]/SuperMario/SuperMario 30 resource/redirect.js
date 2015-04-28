/*
>	redirect.js
>	
>	- ver 1.0
*/


(function() {
  var _redirect;

  this.Redirect = (function() {
    var checkDevice, _device;

    _device = 'pc';

    function Redirect() {
      var url;

      _device = checkDevice(navigator.userAgent);
      window._HTML_MODE = _device;
      if (_device === 'sp' || _device == 'ds' || _device == 'tb' ) {
        url = window.location.href;
        url = url.replace(/index\.html/, "");
        url = url.replace(/(about|maker|movie)/, "sp\/$1");
        url = url.replace(/#\//, "");
        if (!url.match('\/sp\/')) {
          url = url + 'sp/';
        }
        location.href = url + 'index.html';
      }
    }

    checkDevice = function(ua) {
      if (ua.indexOf('Nintendo WiiU') >= 0 || ua.indexOf('Nintendo Wii') >= 0) {
        return 'wii';
      }
      if (ua.indexOf('Nintendo DSi') >= 0 || ua.indexOf('Nintendo 3DS') >= 0) {
        return 'ds';
      }
      if (ua.indexOf('iPhone') >= 0 || ua.indexOf('iPod') >= 0) {
        return 'sp';
      }
      if (ua.indexOf('Android') >= 0 && ua.indexOf('Mobile') >= 0 && ua.indexOf('A1_07') < 0 && ua.indexOf('SC-01C') < 0) {
        return 'sp';
      }
      if (ua.indexOf('BlackBerry') >= 0 || ua.indexOf('Windows Phone') >= 0) {
        return 'sp';
      }
      if (ua.indexOf('iPad') >= 0 || ua.indexOf('Android') >= 0) {
        return 'tb';
      }
      return 'pc';
    };

    Redirect.prototype.getDevice = function() {
      return _device;
    };

    return Redirect;

  })();

  _redirect = new Redirect();

}).call(this);
