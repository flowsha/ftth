/**
 * File: app/user/ui/UsersManager.js
 * Author: liusha
 */
 
Ext.define('xtdx.user.ui.UsersManager', {
    extend: 'Ext.panel.Panel',

    id: 'UsersManager',
    layout: {
        type: 'border'
    },
    closable: true,
    iconCls: 'person_tabs',
    title: '用户管理',

    initComponent: function() {
        var me = this;
        me.items = [
            {
                xtype: 'gridpanel',
                id: 'RightsGrid',
                width: 352,
                collapsible: true,
                title: '权限信息',
                titleCollapse: true,
                region: 'west',
                split: true,
                multiSelect: true,
                selType: 'checkboxmodel',
                store: me.rightStore,
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
                        width: 150,
                        dataIndex: 'V_RIGHT_NAME_VIEW',
                        text: '权限名称'
                    },
                    {
                        xtype: 'gridcolumn',
                        width: 200,
                        dataIndex: 'V_RIGHT_DESC_VIEW',
                        text: '权限描述'
                    },
                    {
                        xtype: 'gridcolumn',
                        hidden: true,
                        dataIndex: 'V_RIGHT_GROUP_VIEW',
                        hideable: false,
                        text: '权限组'
                    }
                ],
                viewConfig: {
                	
                },
                features: [
                    {
                        ftype: 'grouping',
                        groupHeaderTpl: '{name} ({rows.length})',
                        enableGroupingMenu: false,
                        enableNoGroups: false,
                        hideGroupedHeader: true
                    }
                ],
                dockedItems: [
                    {
                        xtype: 'toolbar',
                        height: 27,
                        dock: 'bottom',
                        items: [
                            {
                                xtype: 'button',
                                iconCls: 'reset_btn',
                                text: '刷新'
                            }
                        ]
                    }
                ]
            },
            {
                xtype: 'container',
                layout: {
                    type: 'border'
                },
                region: 'center',
                items: [
                    {
                        xtype: 'form',
                        height: 80,
                        defaults: {
                            labelWidth: 60
                        },
                        layout: {
                            type: 'absolute'
                        },
                        bodyPadding: 10,
                        bodyStyle: 'background-color:#d8e6f4',
                        collapsed: true,
                        collapsible: true,
                        title: '查询用户',
                        titleCollapse: true,
                        floatable: false,
                        region: 'north',
                        items: [
                            {
                                xtype: 'textfield',
                                margin: '2 20 10 0',
                                name: 'V_TRUE_NAME',
                                fieldLabel: '用户姓名',
                                enforceMaxLength: true,
                                maxLength: 60
                            },
                            {
                                xtype: 'combobox',
                                margin: '2 20 10 0',
                                width: 200,
                                name: 'V_DEPT',
                                fieldLabel: '所属部门',
                                editable: false,
                                queryMode: 'local',
                                store: 'DeptStore',
                                displayField: 'V_COMBOX_NAME_VIEW',
                                valueField: 'V_COMBOX_VALUE_VIEW',
    	                        x: 240,
    	                        y: 10
                            },
                            {
                                xtype: 'button',
                                iconCls: 'search_btn',
                                text: '查找',
                                x: 480,
                                y: 10
                            },
                            {
                                xtype: 'button',
                                iconCls: 'reset_btn',
                                text: '重置',
                                x: 540,
                                y: 10
                            }
                        ]
                    },
                    {
                        xtype: 'gridpanel',
                        id: 'UsersGrid',
                        floatable: false,
                        region: 'center',
                        split: true,
                        store: me.userStore,
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
                                dataIndex: 'V_USER_ID_VIEW',
                                text: '用户名',
                                editor: {
                                	xtype: 'textfield',
                                	allowBlank: false,
        	                        enforceMaxLength: true,
        	                        maxLength: 20
                                }
                            },
                            {
                                xtype: 'gridcolumn',
                                width: 150,
                                dataIndex: 'V_TRUE_NAME_VIEW',
                                text: '姓名',
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
                                text: '所属部门',
                                editor: {
                                    xtype: 'combobox',
                                    width: 200,
                                    editable: false,
                                    allowBlank: false,
                                    queryMode: 'local',
                                    store: 'DeptStore',
                                    displayField: 'V_COMBOX_NAME_VIEW',
                                    valueField: 'V_COMBOX_VALUE_VIEW'
                                }
                            },
                            {
                                xtype: 'gridcolumn',
                                width: 100,
                                dataIndex: 'V_MOBILE_VIEW',
                                text: '手机',
                                editor: {
                                	xtype: 'textfield',
                                	allowBlank: false,
                                	regex: /^[\d]*$/,
                                    regexText: '输入格式不正确！',
        	                        enforceMaxLength: true,
        	                        maxLength: 11
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
							            text: '增加用户'
							        },
							        {
							            xtype: 'tbseparator'
							        },
							        {
							            xtype: 'button',
							            iconCls: 'remove_btn',
							            text: '删除用户'
							        },
							        {
							            xtype: 'tbseparator'
							        },
							        {
							            xtype: 'button',
							            iconCls: 'reset_btn',
							            text: '重置密码'
							        },
							        {
							            xtype: 'tbseparator'
							        }
							    ]
							},
                            {
                                xtype: 'pagingtoolbar',
                                displayInfo: true,
                                store: me.userStore,
                                dock: 'bottom'
                            }
                        ]
                    },
                    {
                        xtype: 'gridpanel',
                        id: 'UserRightsGrid',
                        height: 300,
                        collapsible: true,
                        title: '用户权限',
                        floatable: false,
                        region: 'south',
                        split: true,
                        multiSelect: true,
                        selType: 'checkboxmodel',
                        store: me.userightStore,
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
                                width: 150,
                                dataIndex: 'V_RIGHT_NAME_VIEW',
                                text: '权限名称'
                            },
                            {
                                xtype: 'gridcolumn',
                                width: 200,
                                dataIndex: 'V_RIGHT_DESC_VIEW',
                                text: '权限描述'
                            },
		                    {
		                        xtype: 'gridcolumn',
		                        hidden: true,
		                        dataIndex: 'V_RIGHT_GROUP_VIEW',
		                        hideable: false,
		                        text: '权限组'
		                    }
                        ],
                        viewConfig: {
                        	
                        },
		                features: [
		                    {
		                        ftype: 'grouping',
		                        groupHeaderTpl: '{name} ({rows.length})',
		                        enableGroupingMenu: false,
		                        enableNoGroups: false,
		                        hideGroupedHeader: true
		                    }
		                ],
                        dockedItems: [
                            {
                                xtype: 'toolbar',
                                dock: 'top',
                                items: [
                                    {
                                        xtype: 'button',
                                        iconCls: 'add_btn',
                                        text: '增加权限'
                                    },
                                    {
                                        xtype: 'tbseparator'
                                    },
                                    {
                                        xtype: 'button',
                                        iconCls: 'remove_btn',
                                        text: '删除权限'
                                    }
                                ]
                            },
                            {
                                xtype: 'pagingtoolbar',
                                displayInfo: true,
                                store: me.userightStore,
                                dock: 'bottom'
                            }
                        ]
                    }
                ]
            }
        ];
        me.callParent(arguments);
    }
});