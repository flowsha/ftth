/**
 * File: app/person/ui/PersonInfo.js
 * Author: liusha
 */

Ext.define('xtdx.person.ui.PersonInfo', {
    extend: 'Ext.panel.Panel',

    id: 'PersonInfo',
    layout: {
        type: 'border'
    },
    closable: true,
    iconCls: 'person_tabs',
    title: '个人信息',

    initComponent: function() {
        var me = this;
        me.items = [
            {
                xtype: 'form',
                layout: {
                    type: 'fit'
                },
                bodyPadding: 5,
                bodyStyle: 'background-color:#d8e6f4',
                region: 'center',
                items: [
                    {
                        xtype: 'fieldset',
                        layout: {
                            type: 'absolute'
                        },
                        collapsible: false,
                        title: '密码修改',
                        items: [
                            {
                                xtype: 'textfield',
                                width: 260,
                                name: 'V_OLD_PASSWORD',
                                fieldLabel: '旧密码',
                                inputType: 'password',
                                allowBlank: false,
                                blankText: '不能为空！',
                                emptyText: '请输入旧密码',
                                enforceMaxLength: true,
                                maxLength: 20,
                                x: 20,
                                y: 10
                            },
                            {
                                xtype: 'textfield',
                                width: 260,
                                name: 'V_NEW_PASSWORD',
                                fieldLabel: '新密码',
                                inputType: 'password',
                                allowBlank: false,
                                blankText: '不能为空！',
                                enforceMaxLength: true,
                                maxLength: 20,
                                minLength: 6,
                                minLengthText: '密码不能小于6位字符！',
                                x: 20,
                                y: 40
                            },
                            {
                                xtype: 'textfield',
                                width: 260,
                                name: 'V_NEW_PASSWORD2',
                                fieldLabel: '再输一次',
                                inputType: 'password',
                                allowBlank: false,
                                blankText: '不能为空！',
                                submitValue: false,
                                enforceMaxLength: true,
                                maxLength: 20,
                                minLength: 6,
                                minLengthText: '密码不能小于6位字符！',
                                x: 20,
                                y: 70
                            },
                            {
                                xtype: 'button',
                                height: 30,
                                width: 80,
                                iconCls: 'person_tabs',
                                text: '修改密码',
                                x: 200,
                                y: 100
                            }
                        ]
                    }
                ]
            }
        ];
        me.callParent(arguments);
    }
});