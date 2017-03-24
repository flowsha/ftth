/**
 * File: app/project/LoadProjWindow.js
 * Author: liusha.
 */
 
Ext.define('xtdx.project.LoadProjWindow', {
    extend: 'xtdx.project.ui.LoadProjWindow',

    grid: null,
    
    initComponent: function() {
        var me = this;

        me.callParent(arguments);
        
        me.down('button[text=提交]').on('click', me.OnSubmitBtnClick, me);
        me.down('button[text=关闭]').on('click', me.OnCloseBtnClick, me);
    },
    
    OnSubmitBtnClick: function(self, e, options) {
    	var me = this;
    	//TODO: 提交信息
    	var form = self.up('form').getForm();
    	
    	if (!form.isValid()) return;
    	
    	form.submit({
    	    clientValidtion: true,
    	    waitMsg : '正在提交信息...',
			waitTitle : '提示',
    	    url: '../ftth/loadProj',
    	    success : function(form, action){
    	    	me.grid.getStore().load();
    	    	me.close();
    	    	if (action.result.data.length > 0) {
    	    		Ext.Msg.alert('提示','部分导入失败！(号码重复或小区名称不正确)', function (){
    	    			Ext.create('xtdx.project.ServiceNumWindow', {
            	    	    data: action.result.data
            	    	}).show();
    	    		});
    	    	} else {
    	    		Ext.Msg.alert('提示','导入成功！');
    	    	}
    	    	
			},
			failure : function(form, action){
				me.close();
				Ext.Msg.alert('提示','导入失败！');
			}
    	});
    },
    
    OnCloseBtnClick: function(self, e, options) {
    	var me = this;
    	me.close();
    }
});