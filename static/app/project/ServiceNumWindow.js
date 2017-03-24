/**
 * File: app/project/ServiceNumWindow.js
 * Author: liusha.
 */
 
Ext.define('xtdx.project.ServiceNumWindow', {
    extend: 'xtdx.project.ui.ServiceNumWindow',

    data: null,
    
    initComponent: function() {
        var me = this;
        
        me.numsStore = Ext.create('xtdx.project.store.NumsJsonStore');
        me.numsStore.loadData(me.data);
        me.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
        	errorSummary: false
        });
        me.callParent(arguments);
    }
});