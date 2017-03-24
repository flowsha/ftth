/**
 * File: app/project/ui/Projects.js
 * Author: liusha
 */
 
Ext.define('xtdx.project.ui.Projects', {
    extend: 'Ext.panel.Panel',

    id: 'Projects',
    layout: {
        type: 'border'
    },
    closable: true,
    iconCls: 'project_tabs',
    title: '协揽总览',

    initComponent: function() {
        var me = this;
        me.items = [
            {
                xtype: 'form',
                height: 110,
                defaults: {
                    labelWidth: 60
                },
                layout: {
                    type: 'column'
                },
                bodyPadding: 10,
                bodyStyle: 'background-color:#d8e6f4',
                collapsed: true,
                collapsible: true,
                titleCollapse: true,
                floatable: false,
                title: '查询项目',
                region: 'north',
                items: [
                    {
                        xtype: 'textfield',
                        margin: '2 20 10 0',
                        width: 200,
                        name: 'V_SERVICE_NUM',
                        fieldLabel: '业务号码'
                    },
                    {
                        xtype: 'textfield',
                        margin: '2 20 10 0',
                        width: 150,
                        name: 'V_PERSON',
                        fieldLabel: '协揽人'
                    },
                    {
                        xtype: 'combobox',
                        margin: '2 20 10 0',
                        width: 220,
                        name: 'V_DEPT',
                        fieldLabel: '协揽部门',
                        editable: false,
                        queryMode: 'local',
                        store: 'DeptStore',
                        displayField: 'V_COMBOX_NAME_VIEW',
                        valueField: 'V_COMBOX_VALUE_VIEW'
                    },
                    {
                        xtype: 'textfield',
                        margin: '2 20 10 0',
                        name: 'V_ZONE',
                        fieldLabel: '小区名称'
                    },
                    {
                        xtype: 'combobox',
                        margin: '2 20 10 0',
                        width: 150,
                        labelWidth: 80,
                        name: 'V_IDENTIFY',
                        fieldLabel: '是否收身份证',
                        editable: false,
                        queryMode: 'local',
                        store: 'YesOrNoStore',
                        displayField: 'V_COMBOX_NAME_VIEW',
                        valueField: 'V_COMBOX_VALUE_VIEW'
                    },
                    {
                        xtype: 'datefield',
                        margin: '2 20 10 0',
                        name: 'D_TIDAN_TIME_START',
                        fieldLabel: '提单时间',
                        vtype: 'dateRange',
                        dateRange: {begin: 'D_TIDAN_TIME_START', end: 'D_TIDAN_TIME_END', parent: me},
                        format: 'Y年m月d日',
                        submitFormat: 'Y-m-d',
                        editable: false
                    },
                    {
                        xtype: 'datefield',
                        margin: '2 20 10 0',
                        name: 'D_TIDAN_TIME_END',
                        fieldLabel: '到',
                        vtype: 'dateRange',
                        dateRange: {begin: 'D_TIDAN_TIME_START', end: 'D_TIDAN_TIME_END', parent: me},
                        labelWidth: 20,
                        format: 'Y年m月d日',
                        submitFormat: 'Y-m-d',
                        editable: false
                    },
                    {
                        xtype: 'datefield',
                        margin: '2 10 10 0',
                        name: 'D_SHOULI_TIME_START',
                        fieldLabel: '受理时间',
                        vtype: 'dateRange',
                        dateRange: {begin: 'D_SHOULI_TIME_START', end: 'D_SHOULI_TIME_END', parent: me},
                        format: 'Y年m月d日',
                        submitFormat: 'Y-m-d',
                        editable: false
                    },
                    {
                        xtype: 'datefield',
                        margin: '2 20 10 0',
                        name: 'D_SHOULI_TIME_END',
                        fieldLabel: '到',
                        vtype: 'dateRange',
                        dateRange: {begin: 'D_SHOULI_TIME_START', end: 'D_SHOULI_TIME_END', parent: me},
                        labelWidth: 20,
                        format: 'Y年m月d日',
                        submitFormat: 'Y-m-d',
                        editable: false
                    },
                    {
                        xtype: 'button',
                        margin: '2 10 10 0',
                        iconCls: 'search_btn',
                        text: '查找'
                    },
                    {
                        xtype: 'button',
                        margin: '2 20 10 0',
                        iconCls: 'reset_btn',
                        text: '重置'
                    }
                ]
            },
            {
                xtype: 'gridpanel',
                region: 'center',
                store: me.projStore,
                columns: [
                    {
                        xtype: 'gridcolumn',
                        hidden: true,
                        dataIndex: 'ID_VIEW',
                        hideable: false,
                        text: 'ID'
                    },
                    {
                        xtype: 'gridcolumn',
                        width: 100,
                        dataIndex: 'V_SERVICE_NUM_VIEW',
                        text: '业务号码',
                        editor: {
                        	xtype: 'textfield',
                        	allowBlank: false,
                        	regex: /^[\d]*$/,
                            regexText: '输入格式不正确！',
	                        enforceMaxLength: true,
	                        minLength: 8,
	                        maxLength: 8
                        }
                    },
                    {
                        xtype: 'gridcolumn',
                        width: 120,
                        dataIndex: 'V_ZONE_VIEW',
                        text: '小区名称',
                        editor: {
                            xtype: 'combobox',
                            allowBlank: false,
                            forceSelection: true,
                            queryParam: 'V_ZONE',
                            queryMode: 'remote',
                            minChars: 1,
                            queryDelay: 200,
                            store: me.zoneStore,
                            displayField: 'V_ZONE_VIEW',
                            valueField: 'V_ZONE_VIEW'
                        }
                    },
                    {
                        xtype: 'gridcolumn',
                        width: 120,
                        dataIndex: 'V_CUST_NAME_VIEW',
                        text: '客户姓名',
                        editor: {
                        	xtype: 'textfield',
                        	//allowBlank: false,
	                        enforceMaxLength: true,
	                        maxLength: 20
                        }
                    },
                    {
                        xtype: 'gridcolumn',
                        width: 100,
                        dataIndex: 'V_PHONE_VIEW',
                        text: '用户联系电话',
                        editor: {
                        	xtype: 'textfield',
                        	//allowBlank: false,
                        	regex: /^[\d]*$/,
                            regexText: '输入格式不正确！',
	                        enforceMaxLength: true,
	                        maxLength: 11
                        }
                    },
                    {
                        xtype: 'gridcolumn',
                        width: 200,
                        dataIndex: 'V_ADDRESS_VIEW',
                        text: '装机地址',
                        editor: {
                        	xtype: 'textfield',
                        	//allowBlank: false,
	                        enforceMaxLength: true,
	                        maxLength: 50
                        }
                    },
                    {
                        xtype: 'gridcolumn',
                        width: 100,
                        dataIndex: 'V_IDENTIFY_VIEW',
                        text: '是否收身份证',
                        editor: {
                            xtype: 'combobox',
                            editable: false,
                            allowBlank: false,
                            queryMode: 'local',
                            store: 'YesOrNoStore',
                            displayField: 'V_COMBOX_NAME_VIEW',
                            valueField: 'V_COMBOX_VALUE_VIEW'
                        }
                    },
                    {
                        xtype: 'numbercolumn',
                        width: 100,
                        dataIndex: 'N_MONEY_VIEW',
                        text: '已收金额(元)',
                        align: 'right',
                        editor: {
                        	xtype: 'numberfield',
                        	allowBlank: false,
                        	minValue: 0
                        }
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'V_PERSON_NO_VIEW',
                        text: '协揽工号',
                        editor: {
                        	xtype: 'textfield',
                        	allowBlank: false,
	                        enforceMaxLength: true,
	                        maxLength: 10
                        }
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'V_PERSON_VIEW',
                        text: '协揽人',
                        editor: {
                        	xtype: 'textfield',
                        	allowBlank: false,
	                        enforceMaxLength: true,
	                        maxLength: 10
                        }
                    },
                    {
                        xtype: 'gridcolumn',
                        width: 150,
                        dataIndex: 'V_DEPT_VIEW',
                        text: '协揽部门'
                    },
                    {
                        xtype: 'datecolumn',
                        width: 180,
                        dataIndex: 'D_TIDAN_TIME_VIEW',
                        text: '提单时间',
                        format: 'Y年m月d日 H时i分s秒'
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'V_TIDAN_REN_VIEW',
                        text: '提单人'
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'V_REMARK_VIEW',
                        text: '备注',
                        width: 150,
                        editor: {
                        	xtype: 'textfield',
	                        enforceMaxLength: true,
	                        maxLength: 100
                        }
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'V_FIBER_INFO_VIEW',
                        text: '工程布纤信息',
                        width: 150,
                        editor: {
                        	xtype: 'textfield',
	                        enforceMaxLength: true,
	                        maxLength: 100
                        }
                    },
                    {
                        xtype: 'datecolumn',
                        width: 120,
                        dataIndex: 'D_SHOULI_TIME_VIEW',
                        text: '提交受理时间',
                        format: 'Y年m月d日',
                        editor: {
                        	xtype: 'datefield',
                        	editable: false,
                        	format: 'Y年m月d日',
                        	submitFormat: 'Y-m-d'
                        }
                    }
                ],
                viewConfig: {

                },
                plugins: [
                    me.rowEditing
      			],
                dockedItems: [
                    {
                        xtype: 'toolbar',
                        dock: 'top',
                        items: [
                            {
                                xtype: 'button',
                                iconCls: 'add_btn',
                                text: '增加协揽'
                            },
                            {
                                xtype: 'tbseparator'
                            },
                            {
                                xtype: 'button',
                                iconCls: 'modify_btn',
                                text: '批量导入'
                            },
                            {
                                xtype: 'tbseparator'
                            },
                            {
                                xtype: 'button',
                                iconCls: 'remove_btn',
                                text: '删除协揽'
                            },
                            {
                                xtype: 'tbseparator'
                            },
                            {
                                xtype: 'button',
                                iconCls: 'ext_xls',
                                text: '导出'
                            }
                        ]
                    },
                    {
                        xtype: 'pagingtoolbar',
                        displayInfo: true,
                        store: me.projStore,
                        dock: 'bottom'
                    }
                ]
            }
        ];
        me.callParent(arguments);
    }
});