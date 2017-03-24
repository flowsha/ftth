/**
 * File: app/user/Rights.js
 * Author: liusha
 */
 
Ext.define('xtdx.user.Rights', {
    extend: 'Ext.Base',

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            
        }, cfg)]);
    },
    
    statics: {
    	hasRights: function(rightId, callback) {
    		var me = this;
    		
    		Ext.Ajax.request({
	    	    url: '../ftth/hasRights',
	    	    method: 'get',
	    	    params: {
	    	    	ID: rightId
	    	    },
	    	    success: function(response, opts) {
	    	    	var result = Ext.JSON.decode(response.responseText);
	    	    	if (result.bright) {
	    	    		Ext.callback(callback);
	    	    	} else {
	    	    		Ext.Msg.alert('提示', '您没有该操作的权限！');
	    	    	}
			    },
			    failure: function(response, opts) {
			    	Ext.Msg.alert('提示', '请求失败！');
			    }
	    	});
    	},
    	noRights: function(rightId, callback) {
    		var me = this;
    		
    		Ext.Ajax.request({
	    	    url: '../ftth/hasRights',
	    	    method: 'get',
	    	    params: {
	    	    	ID: rightId
	    	    },
	    	    success: function(response, opts) {
	    	    	var result = Ext.JSON.decode(response.responseText);
	    	    	if (!result.bright) {
	    	    		Ext.callback(callback);
	    	    		Ext.Msg.alert('提示', '您没有该操作的权限！');
	    	    	}
			    },
			    failure: function(response, opts) {
			    	Ext.Msg.alert('提示', '请求失败！');
			    }
	    	});
    	}
    }
});