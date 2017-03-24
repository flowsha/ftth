/**
 * File: app/user/store/RightsJsonStore.js
 * Author: liusha
 */
 
Ext.define('xtdx.user.store.RightsJsonStore', {
    extend: 'Ext.data.Store',

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            autoLoad: true,
            groupField: 'V_RIGHT_GROUP_VIEW',
            proxy: {
                type: 'ajax',
                url: '../ftth/getRights',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
            fields: [
            	{
                    name: 'ID_VIEW',
                    type: 'string'
                },
                {
                    name: 'V_RIGHT_NAME_VIEW',
                    type: 'string'
                },
                {
                    name: 'V_RIGHT_DESC_VIEW',
                    type: 'string'
                },
                {
                    name: 'V_RIGHT_GROUP_VIEW',
                    type: 'string'
                }
            ]
        }, cfg)]);
    }
});