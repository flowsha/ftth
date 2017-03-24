/**
 * File: app/com/LoginWindow.js
 * Author: liusha.
 */

Ext.define('xtdx.com.LoginWindow', {
    extend: 'xtdx.com.ui.LoginWindow',

    initComponent: function() {
        var me = this;
        
    	me.callParent(arguments);
    	
    	me.down('button[text="登录"]').on('click', me.OnLoginBtnClick, me);
		me.down('button[text="退出"]').on('click', me.OnExitSysBtnClick, me);
		me.down('textfield[name="V_USER_ID"]').on('keypress', me.OnUserIDKeyPress, me);
		me.down('textfield[name="V_PASSWORD"]').on('keypress', me.OnLoginBtnKeyPress, me);
		
    	//TODO：该处判断用户是否已经登录
    	Ext.Ajax.request({
    	    url: '../ftth/islogin',
    	    success: function(response, options) {
    	    	var result = Ext.JSON.decode(response.responseText);
    	    	
    	    	if (result.IS_LOGINED) {
		    		var mainWin = Ext.create('xtdx.com.XtdxViewport', {
		                renderTo: Ext.getBody()
		            });
		            //send params to viewport object.
		            Ext.apply(mainWin, {
		                welcome: result.V_TRUE_NAME
		            });
		            
		            mainWin.show();
		            me.close();
		    	} else {
		            me.show().down('textfield[name="V_USER_ID"]').focus(true, 10);
		    	}
    	    },
    	    failure: function(response, options) {
    	    	Ext.Msg.alert('提示', '无法访问！');
    	    	me.close();
    	    }
    	});
    },
    
    OnLoginBtnKeyPress: function(self, e, options) {
    	var me = this;
    	
    	if(e.getKey() == e.ENTER){
		    me.down('button[text="登录"]').fireEvent('click');
		}
    },
    
    OnUserIDKeyPress: function(self, e, options) {
    	var me = this;
    	if(e.getKey() == e.ENTER){
    	    me.down('textfield[name="V_PASSWORD"]').focus();
    	}
    },
    
    OnLoginBtnClick: function(self, e, options) {
    	var me = this;
    	
    	//TODO：该处判断用户是否合法
    	var loginForm = me.down('form').getForm();
    	if (!loginForm.isValid()) return;
    	
    	loginForm.submit({
    	    clientValidtion: true,
    	    waitMsg : '正在验证登录信息，请稍后',
			waitTitle : '提示',
    	    url: '../ftth/login',
    	    method: 'post',
    	    success : function(form, action) {
    	    	me.close();
    	        var mainWin = Ext.create('xtdx.com.XtdxViewport', {
                    renderTo: Ext.getBody()
                });
                //send params to viewport object.
	            Ext.apply(mainWin, {
	                welcome: action.result.V_TRUE_NAME
	            });
                mainWin.show(); 
			},
			failure : function(form, action) {
				//msgTip.hide();
				Ext.Msg.alert('提示',action.result.msg);
			}
    	});

    },
    
    OnExitSysBtnClick: function(self, e, options) {
    	var me = this;
    	me.close();
    }
});