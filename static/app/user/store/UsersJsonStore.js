/**
 * File: app/user/store/UsersJsonStore.js
 * Author: liusha
 */
 
Ext.define('xtdx.user.store.UsersJsonStore', {
    extend: 'Ext.data.Store',

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: '../ftth/getUsers',
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
                    name: 'V_USER_ID_VIEW',
                    type: 'string'
                },
                {
                    name: 'V_TRUE_NAME_VIEW',
                    type: 'string'
                },
                {
                    name: 'V_DEPT_VIEW',
                    type: 'string'
                },
                {
                    name: 'V_MOBILE_VIEW',
                    type: 'string'
                }
            ]
        }, cfg)]);
    }
});