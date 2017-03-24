/*
 * File: app/com/ui/LoginWindow.js
 * Date: Tue Oct 11 2011 16:37:33 GMT+0800 (ÖÐ¹ú±ê×¼Ê±¼ä)
 *
 * This file was generated by Ext Designer version 1.2.0.
 * http://www.sencha.com/products/designer/
 *
 * This file will be auto-generated each and everytime you export.
 *
 * Do NOT hand edit this file.
 */

Ext.define('xtdx.com.ui.LoginWindow', {
    extend: 'Ext.window.Window',

    height: 350,
    width: 500,
    id: 'LoginWin',
    resizable: false,
    layout: {
        type: 'fit'
    },
    title: '湘潭电信公司FTTH协揽管理系统',
    modal: false,

    initComponent: function() {
        var me = this;
        me.items = [
            {
                xtype: 'form',
                cls: '',
                layout: {
                    type: 'absolute'
                },
                bodyPadding: 10,
                bodyStyle: 'background:transparent',
                title: '',
                method: 'post',
                items: [
                    {
                        xtype: 'image',
                        height: 100,
                        width: 496,
                        src: './resources/images/logo1.png',
                        x: -7,
                        y: -8
                    },
                    {
                        xtype: 'textfield',
                        width: 270,
                        name: 'V_USER_ID',
                        fieldLabel: '用户名',
                        labelWidth: 50,
                        allowBlank: false,
                        blankText: '用户名不能为空！',
                        enforceMaxLength: true,
                        maxLength: 30,
                        enableKeyEvents: true,
                        x: 100,
                        y: 120
                    },
                    {
                        xtype: 'textfield',
                        width: 270,
                        inputType: 'password',
                        name: 'V_PASSWORD',
                        fieldLabel: '密码',
                        labelWidth: 50,
                        allowBlank: false,
                        blankText: '密码不能为空！',
                        minLength: 6,
                        minLengthText: '密码不能少于6位！',
                        enableKeyEvents: true,
                        x: 100,
                        y: 160
                    },/*
                    {
                        xtype: 'textfield',
                        name: 'CheckCode',
                        hidden: true,
                        width: 150,
                        fieldLabel: '验证码',
                        labelWidth: 50,
                        allowBlank: false,
                        blankText: '验证码不能为空！',
                        enforceMaxLength: true,
                        maxLength: 6,
                        maxLengthText: '验证码不正确！',
                        minLength: 4,
                        minLengthText: '验证码不正确！',
                        submitValue: false,
                        x: 100,
                        y: 200
                    },
                    {
                        xtype: 'image',
                        hidden: true,
                        height: 40,
                        width: 100,
                        src: 'http://www.sencha.com/img/sencha-large.png',
                        x: 270,
                        y: 190
                    },*/
                    {
                        xtype: 'button',
                        height: 30,
                        width: 70,
                        iconCls: 'login_btn',
                        text: '登录',
                        x: 210,
                        y: 240
                    },
                    {
                        xtype: 'button',
                        height: 30,
                        width: 70,
                        iconCls: 'exit_btn',
                        text: '退出',
                        x: 300,
                        y: 240
                    }
                ],
                dockedItems: [
                    {
                        xtype: 'toolbar',
                        height: 22,
                        dock: 'bottom',
                        items: [
                            {
                                xtype: 'tbtext',
                                text: 'Copyright © 湘潭电信公司 2012'
                            }
                        ]
                    }
                ]
            }
        ];
        me.callParent(arguments);
    }
});