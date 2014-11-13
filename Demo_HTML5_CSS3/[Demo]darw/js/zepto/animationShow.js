//     Zepto.js
//     (c) 2010-2014 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.


define(function(require, exports, module) {
  var Zepto = require('./zepto');
  module.exports = Zepto;

  ;(function($){

      $.fn.animationShow = function (callback) {
        this.each(function (i, item) {
          var $item = $(item);
          $item.show().removeClass('f-hide').addClass('animationShow').off('webkitAnimationEnd').on('webkitAnimationEnd', function (e) {
            if(e.target == item){
              $item.addClass('z-show').removeClass('animationShow');
              if(callback){
                callback();
              }
            }
          });
        });
      };

      $.fn.animationHide = function (callback) {
        this.each(function (i, item) {
          var $item = $(item);
          $item.hide().removeClass('z-show').addClass('animationHide').off('webkitAnimationEnd').on('webkitAnimationEnd', function (e) {
            if(e.target == item){
              $item.addClass('f-hide').removeClass('animationHide').hide();
              if(callback){
                callback();
              }
            }
          });
        });
      };

  })(Zepto)

});
