/**
 * File: app/project/ui/ServiceNumWindow.js
 * Author: liusha.
 */
 
Ext.define('xtdx.project.ui.ServiceNumWindow', {
    extend: 'Ext.window.Window',

    height: 500,
    width: 300,
    resizable: false,
    layout: {
        type: 'fit'
    },
    iconCls: 'project_tabs',
    title: '未导入号码(号码重复或小区名称不正确！)',
    modal: true,

    initComponent: function() {
        var me = this;
        me.items = [
            {
                xtype: 'gridpanel',
                region: 'center',
                store: me.numsStore,
                columns: [
                    {
                        xtype: 'gridcolumn',
                        width: 100,
                        dataIndex: 'V_SERVICE_NUM_VIEW',
                        text: '业务号码',
                        editor: {
                        	xtype: 'textfield',
                        	readOnly: true
                        }
                    },
                    {
                        xtype: 'gridcolumn',
                        width: 120,
                        dataIndex: 'V_ZONE_VIEW',
                        text: '小区名称',
                        editor: {
                        	xtype: 'textfield',
                        	readOnly: true
                        }
                    }
                ],
                viewConfig: {

                },
	            plugins: [
	                me.rowEditing
	        	]
	        }
        ];
        me.callParent(arguments);
    }
});