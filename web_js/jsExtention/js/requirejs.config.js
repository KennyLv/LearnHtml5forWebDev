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
    //shim���ԣ�ר���������ò����ݵ�ģ�顣������˵��ÿ��ģ��Ҫ����
    //��1��exportsֵ������ı����������������ģ���ⲿ����ʱ�����ƣ�
    //��2��deps���飬������ģ��������ԡ�
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
