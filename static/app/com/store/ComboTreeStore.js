/**
 * File: app/com/store/ComboTreeStore.js
 * Author: liusha
 */
 
Ext.define('xtdx.com.store.ComboTreeStore', {
    extend: 'Ext.data.TreeStore',

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            root: {
            	expanded: true
            },
            fields: [
            	{
                    name: 'ID_VIEW',
                    type: 'string'
                },
                {
                    name: 'V_NODE_NAME_VIEW',
                    type: 'string'
                }
            ]
        }, cfg)]);
    }
});