/**
 * File: app/project/ui/LoadProjWindow.js
 * Author: liusha.
 */
 
Ext.define('xtdx.project.ui.LoadProjWindow', {
    extend: 'Ext.window.Window',

    height: 150,
    width: 515,
    resizable: false,
    layout: {
        type: 'fit'
    },
    iconCls: 'project_tabs',
    title: '批量导入',
    modal: true,

    initComponent: function() {
        var me = this;
        me.items = [
            {
                xtype: 'form',
                defaults: {
                    labelWidth: 60
                },
                layout: {
                    type: 'column'
                },
                bodyPadding: 10,
                bodyStyle: 'background-color:#d8e6f4;border:0px',
                items: [
                    {
                        xtype: 'filefield',
                        margin: '5 25 10 0',
                        width: 455,
                        name: 'V_ATTACH_FILE',
                        fieldLabel: '导入文件',
                        allowBlank: false,
                        blankText: '导入文件不能为空！',
                        emptyText: '请选择要导入的文件',
                        buttonText: '导入文件...'
                    },
                    {
                        xtype: 'button',
                        margin: '20 10 10 325',
                        width: 60,
                        iconCls: 'ok_btn',
                        text: '提交'
                    },
                    {
                        xtype: 'button',
                        margin: '20 25 10 0',
                        width: 60,
                        iconCls: 'stop_btn',
                        text: '关闭'
                    }
                ]
            }
        ];
        me.callParent(arguments);
    }
});