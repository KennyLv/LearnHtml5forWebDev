require(function(utils) {
    var PlatformServices = require('js/helper/dic-lib');
    PlatformServices.create('images');
    require('aq/kpi').init(PlatformServices);    
    require('jsperanto');    
});