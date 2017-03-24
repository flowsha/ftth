/**
 * File: app/project/store/ZoneArrayStore.js
 * Author: liusha
 */
 
Ext.define('xtdx.project.store.ZoneArrayStore', {
    extend: 'Ext.data.Store',

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            pageSize: 50,
            proxy: {
                type: 'ajax',
                url: '../ftth/getZone',
                reader: {
                    type: 'array'
                }
            },
            fields: [
                {
                    name: 'V_ZONE_VIEW',
                    type: 'string'
                }
            ]
        }, cfg)]);
    }
});