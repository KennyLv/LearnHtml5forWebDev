requirejs.config({
    baseUrl: "./",
    paths: {
        almond: "core/lib/almond/almond",
        jquery: "core/lib/jquery/jquery",
        jsperanto: "core/lib/jsperanto/jquery.jsperanto",
        underscore: "core/lib/underscore/underscore",
        uuid: "core/lib/node-uuid/uuid",
        moment: "core/lib/moment/moment-with-locales.min"
    },
    deps: ["almond", "jquery", "jsperanto", "underscore", "uuid", "moment"],
    //shim属性，专门用来配置不兼容的模块。具体来说，每个模块要定义
    //（1）exports值（输出的变量名），表明这个模块外部调用时的名称；
    //（2）deps数组，表明该模块的依赖性。
    shim: {
        'underscore':{
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    },
    findNestedDependencies: true,
    useStrict: true,
    removeCombined: true,
    packages: [{
            name: "aq",
            location: "core/src"
        }, {
            name: "shared",
            location: "core/modules/shared"
        }, {
            name: 'common',
            location: '../common'
        }]
});
