/**
 * File: app/person/PersonInfo.js
 * Author: liusha
 */

Ext.define('xtdx.person.PersonInfo', {
    extend: 'xtdx.person.ui.PersonInfo',

    initComponent: function() {
        var me = this;
        me.callParent(arguments);

        me.down('button[text="修改密码"]').on('click', me.OnModifyPasswordBtnClick, me);
        
    },
    
    OnModifyPasswordBtnClick: function(self, e, options) {
    	var me = this;
    	
    	//xtdx.user.Rights.hasRights('GRPT-GRXX-3', function() {
	    	var form = self.up('form').getForm();
	    	
	    	if (!form.isValid()) return;
	    	
	    	var newPwd = me.down('textfield[name="V_NEW_PASSWORD"]').getValue();
	    	var newPwd2 = me.down('textfield[name="V_NEW_PASSWORD2"]').getValue();
	    	if (newPwd != newPwd2) {
	    		Ext.Msg.alert('提示','两次输入新密码不一样！');
	    		return;
	    	}
	    	
	    	form.submit({
	    	    clientValidtion: true,
	    	    waitMsg : '正在提交信息...',
				waitTitle : '提示',
	    	    url: '../ftth/modifyPwd',
	    	    success : function(form, action){
					Ext.Msg.alert('提示','修改密码成功！', function() {
						form.reset();
					});
				},
				failure : function(form, action){
					Ext.Msg.alert('提示', action.result.msg, function() {
					    me.down('textfield[name="V_OLD_PASSWORD"]').focus(true);
					});
				}
	    	});
    	//});
    }
});