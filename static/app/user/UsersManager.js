/**
 * File: app/user/UsersManager.js
 * Author: liusha
 */
 
Ext.define('xtdx.user.UsersManager', {
    extend: 'xtdx.user.ui.UsersManager',

    initComponent: function() {
        var me = this;

        me.rightStore = Ext.create('xtdx.user.store.RightsJsonStore');
        me.userStore = Ext.create('xtdx.user.store.UsersJsonStore');
        me.userightStore = Ext.create('xtdx.user.store.UserRightsJsonStore');
        me.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
        	errorSummary: false
        });
        
        me.callParent(arguments);
        
        //register components event.
        me.down('button[text="增加用户"]').on('click', me.OnAddUsersBtnClick, me);
        me.down('button[text="删除用户"]').on('click', me.OnDeleteUsersBtnClick, me);
        me.down('button[text="重置密码"]').on('click', me.OnResetPasswordBtnClick, me);
        me.down('button[text="增加权限"]').on('click', me.OnAddRightsBtnClick, me);
        me.down('button[text="删除权限"]').on('click', me.OnDeleteRightsBtnClick, me);
        me.down('button[text="查找"]').on('click', me.OnSearchBtnClick, me);
        me.down('button[text="重置"]').on('click', me.OnResetBtnClick, me);
        me.down('button[text="刷新"]').on('click', me.OnRefreshBtnClick, me);
        me.down('#UsersGrid').on('select', me.OnUsersGridSelect, me);
        me.down('#RightsGrid').on('select', me.OnRightsGridSelect, me);
        me.userStore.on('load', me.OnUsersStoreLoad, me);
        me.rowEditing.on('edit', me.OnUsersGridEdit, me);
        me.rowEditing.on('beforeedit', me.OnUsersGridBeforeEdit, me);
    },
    
    OnUsersGridBeforeEdit: function(editor, e, epts) {
    	xtdx.user.Rights.noRights('XTGL-YHGL-3', function() {
    		editor.cancelEdit();
    	});
    },
    
    OnUsersGridEdit: function(editor, e) {
    	var me = this;
    	
    	if (!e.record.dirty) return;
    	
    	var url = '../ftth/modifyUser';
    	if (Ext.isEmpty(e.record.get('ID_VIEW'))) {
			var rows = me.down('#UsersGrid').getSelectionModel().getSelection();
			e.record.set('ID_VIEW', rows[0].get('ID_VIEW'));
			url = '../ftth/addUser';
		}
    	e.record.commit();
    	
    	Ext.Ajax.request({
    	    url: url,
    	    method: 'post',
    	    params: {
    		    ID: e.record.get('ID_VIEW'),
    		    V_USER_ID: e.record.get('V_USER_ID_VIEW'),
    		    V_TRUE_NAME: e.record.get('V_TRUE_NAME_VIEW'),
    		    V_DEPT: e.record.get('V_DEPT_VIEW'),
    		    V_MOBILE: e.record.get('V_MOBILE_VIEW')
    	    },
    	    success: function(response, opts) {
    	    	var result = Ext.JSON.decode(response.responseText);
    	    	if (result.success) {
    	    		e.record.set(result.data);
        	    	e.record.commit();
    	    	} else {
    	    		Ext.Msg.alert('提示', result.msg);
    	    		e.record.set('V_USER_ID_VIEW', '');
    	    	}
			},
			failure: function(response, opts) {
				Ext.Msg.alert('提示','提交失败！');
			}
    	});
    },
    
    OnAddUsersBtnClick: function(self, e, options) {
    	var me = this;
    	xtdx.user.Rights.hasRights('XTGL-YHGL-2', function() {
    		me.rowEditing.cancelEdit();
    		me.userStore.insert(0, {});
    		me.rowEditing.startEdit(0, 0);
    	});
    },
    
    OnDeleteUsersBtnClick: function(self, e, options) {
    	var me = this,
    	    grid = self.up('gridpanel'),
    	    store = grid.getStore(),
    	    sm = grid.getSelectionModel(),
    	    rows = sm.getSelection();
    	    
    	xtdx.user.Rights.hasRights('XTGL-YHGL-4', function() {
	    	if (rows.length > 0) {
	    		if (Ext.isEmpty(rows[0].get('ID_VIEW'))) {
	    			var i = store.indexOf(rows[0]);
				    	    	    
	    	    	store.remove(rows);
	    	    	
	    	    	var count = store.getCount();
	    	    	
	    	    	if (count > 0) {
	    	    		sm.select((i == count)? --i : i);
	    	    	}
	    			return;
	    		}
	    		Ext.MessageBox.confirm('提示', '确定删除该用户吗？', function(id) {
	            	if (id == 'yes') {
	            		//TODO 删除用户
		    			Ext.Ajax.request({
				    	    url: '../ftth/delUser',
				    	    method: 'get',
				    	    params: {
				    	    	ID: rows[0].get('ID_VIEW')
				    	    },
				    	    success: function(response, opts) {
							    var i = store.indexOf(rows[0]);
				    	    	    
				    	    	store.remove(rows);
				    	    	
				    	    	var count = store.getCount();
				    	    	
				    	    	if (count > 0) {
				    	    		sm.select((i == count)? --i : i);
				    	    	} else {
				    	    		store.fireEvent('load');
				    	    	}
							},
							failure: function(response, opts) {
								Ext.Msg.alert('提示','删除失败！');
							}
				    	});
	                }
	            });
	    	} else {
	    		Ext.Msg.alert('提示','请选择要删除的用户！');
	    	}
    	});
    },
    
    OnResetPasswordBtnClick: function(self, e, options) {
    	var me = this,
    	    grid = self.up('gridpanel'),
    	    sm = grid.getSelectionModel(),
    	    rows = sm.getSelection();
    	    
    	xtdx.user.Rights.hasRights('XTGL-YHGL-5', function() {    
	    	if (rows.length > 0) {
	    	    Ext.Ajax.request({
		    	    url: '../ftth/resetPwd',
		    	    method: 'get',
		    	    params: {
		    	    	ID: rows[0].get('ID_VIEW')
		    	    },
		    	    success: function(response, opts) {
		    	    	Ext.Msg.alert('提示','重置密码成功！');
					},
					failure: function(response, opts) {
						Ext.Msg.alert('提示','重置密码失败！');
					}
		    	});
	    	} else {
	    		Ext.Msg.alert('提示','请选择要重置密码的员工！');
	    	}
    	});
    },
    
    OnUsersStoreLoad: function(store, records, successful, operation, eOpts) {
    	var me = this;
    	
    	Ext.apply(me.userightStore.getProxy(), {
    	    extraParams:{}
    	});
    	me.userightStore.loadPage(1);
    },
    
    OnAddRightsBtnClick: function(self, e, options) {
    	var me = this,
    	    users = me.down('#UsersGrid').getSelectionModel().getSelection(),
    	    rights = me.down('#RightsGrid').getSelectionModel().getSelection();
    	    
    	xtdx.user.Rights.hasRights('XTGL-YHGL-6', function() {
	    	if (users.length > 0 && rights.length > 0) {
	    		var ID = [];
	    		Ext.each(rights, function(item) {
	    			ID.push(item.get('ID_VIEW'));
	    		});
				Ext.Ajax.request({
		    	    url: '../ftth/addRights',
		    	    method: 'get',
		    	    params: {
		    	    	V_RIGHT_ID: Ext.encode(ID),
		    	    	V_USER_FK: users[0].get('ID_VIEW')
		    	    },
		    	    success: function(response, opts) {
		    	    	me.rightStore.remove(rights);
				    	me.userightStore.load();
			    		Ext.Msg.alert('提示','增加权限成功！');
				    },
				    failure: function(response, opts) {
				    	Ext.Msg.alert('提示', '请求失败！');
				    }
		    	});
	    	} else {
	    		Ext.Msg.alert('提示','请先选择相应的用户和权限！');
	    	}
    	});
    },
    
    OnDeleteRightsBtnClick: function(self, e, options) {
    	var me = this,
    	    grid = self.up('gridpanel'),
    	    store = grid.getStore(),
    	    sm = grid.getSelectionModel(),
    	    rights = sm.getSelection(),
    	    users = me.down('#UsersGrid').getSelectionModel().getSelection();
    	    
    	xtdx.user.Rights.hasRights('XTGL-YHGL-7', function() {    
	    	if (users.length > 0 && rights.length > 0) {
	    		Ext.MessageBox.confirm('提示', '确定删除选择的用户权限吗？', function(id) {
	            	if (id == 'yes') {
	            		var ID = [];
	            		Ext.each(rights, function(item) {
	            			ID.push(item.get('ID_VIEW'));
	            		});
		    			Ext.Ajax.request({
				    	    url: '../ftth/delUserRights',
				    	    method: 'get',
				    	    params: {
				    	    	ID: Ext.encode(ID)
				    	    },
				    	    success: function(response, opts) {
				    	    	me.userightStore.load();
				    	    	Ext.Msg.alert('提示','删除权限成功！');
						    },
						    failure: function(response, opts) {
						    	Ext.Msg.alert('提示', '请求失败！');
						    }
				    	});
	                }
	            });
	    	} else {
	    		Ext.Msg.alert('提示','请选择要删除的用户权限！');
	    	}
    	});
    },
    
    OnUsersGridSelect: function(rowModel, record, index, eOpts) {
    	var me = this;
    	
    	Ext.apply(me.userightStore.getProxy(), {
    	    extraParams:{
    	        V_USER_FK: record.get('ID_VIEW')
    	    }
    	});
    	me.userightStore.loadPage(1);
    },
    
    OnRightsGridSelect: function(rowModel, record, index, eOpts) {
    	var me = this;
    },
        
    OnSearchBtnClick: function(self, e, options) {
    	var me = this;
    	
    	var form = self.up('form').getForm();
    	if (!form.isValid()) return;
    	Ext.apply(me.userStore.getProxy(), {
    	     extraParams: form.getValues()
    	});
    	me.userStore.loadPage(1);
    },
    
    OnResetBtnClick: function(self, e, options) {
    	self.up('form').getForm().reset();
    },
    
    OnRefreshBtnClick: function(self, e, options) {
    	var me = this;
    	me.rightStore.load();
    }
});