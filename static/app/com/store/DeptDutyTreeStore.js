/**
 * File: app/com/store/DeptDutyTreeStore.js
 * Author: liusha
 */
 
Ext.define('xtdx.com.store.DeptDutyTreeStore', {
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
                    name: 'V_PARENT_ID_VIEW',
                    type: 'string'
                },
                {
                    name: 'N_NODE_LEVEL_VIEW',
                    type: 'number'
                },
                {
                	name: 'N_NODE_TYPE_VIEW',
                	type: 'number'
                },
                {
                    name: 'V_NODE_NAME_VIEW',
                    type: 'string'
                }
            ]
        }, cfg)]);
    }
});