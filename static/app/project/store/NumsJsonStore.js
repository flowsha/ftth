/**
 * File: app/project/store/NumsJsonStore.js
 * Author: liusha
 */
 
Ext.define('xtdx.project.store.NumsJsonStore', {
    extend: 'Ext.data.Store',

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            pageSize: 50,
            proxy: {
                type: 'ajax',
                url: '../ftth/getProj',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
            fields: [
                {
                    name: 'V_SERVICE_NUM_VIEW',
                    type: 'string'
                },
                {
                    name: 'V_ZONE_VIEW',
                    type: 'string'
                }
            ]
        }, cfg)]);
    }
});