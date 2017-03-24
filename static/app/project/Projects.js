/**
 * File: app/project/Projects.js
 * Author: liusha
 */
 
Ext.define('xtdx.project.Projects', {
    extend: 'xtdx.project.ui.Projects',

    initComponent: function() {
        var me = this;
        
        me.zoneStore = Ext.create('xtdx.project.store.ZoneArrayStore');
        me.projStore = Ext.create('xtdx.project.store.ProjectsJsonStore');
        
        me.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
        	errorSummary: false
        });
        
        me.callParent(arguments);
        
        me.down('button[text="增加协揽"]').on('click', me.OnAddPreProjectBtnClick, me);
        me.down('button[text="批量导入"]').on('click', me.OnLoadProjectFromFileBtnClick, me);
        me.down('button[text="删除协揽"]').on('click', me.OnDeleteProjectBtnClick, me);
        me.down('button[text="导出"]').on('click', me.OnExportProjectBtnClick, me);
        me.down('button[text="查找"]').on('click', me.OnSearchBtnClick, me);
        me.down('button[text="重置"]').on('click', me.OnResetBtnClick, me);
        me.rowEditing.on('edit', me.OnGridEdit, me);
        me.rowEditing.on('beforeedit', me.OnGridBeforeEdit, me);
    },
    
    OnGridBeforeEdit: function(editor, e, epts) {
    	xtdx.user.Rights.noRights('XLGL-XLZL-3', function() {
    		editor.cancelEdit();
    	});
    },
    
    OnGridEdit: function(editor, e) {
    	var me = this;
    	
    	if (!e.record.dirty) return;
    	
    	var url = '../ftth/modifyProj';
    	if (Ext.isEmpty(e.record.get('ID_VIEW'))) {
			url = '../ftth/addProj';
		}
		e.record.commit();
		
    	Ext.Ajax.request({
    	    url: url,
    	    method: 'post',
    	    params: {
    		    ID: e.record.get('ID_VIEW'),
    		    V_SERVICE_NUM: e.record.get('V_SERVICE_NUM_VIEW'),
    		    V_ZONE: e.record.get('V_ZONE_VIEW'),
    		    V_CUST_NAME: e.record.get('V_CUST_NAME_VIEW'),
    		    V_PHONE: e.record.get('V_PHONE_VIEW'),
    		    V_ADDRESS: e.record.get('V_ADDRESS_VIEW'),
    		    V_IDENTIFY: e.record.get('V_IDENTIFY_VIEW'),
    		    N_MONEY: e.record.get('N_MONEY_VIEW'),
    		    V_PERSON_NO: e.record.get('V_PERSON_NO_VIEW'),
    		    V_PERSON: e.record.get('V_PERSON_VIEW'),
    		    V_REMARK: e.record.get('V_REMARK_VIEW'),
                V_FIBER_INFO: e.record.get('V_FIBER_INFO_VIEW'),
                D_SHOULI_TIME: Ext.util.Format.date(e.record.get('D_SHOULI_TIME_VIEW'), 'Y-m-d')
    	    },
    	    success: function(response, opts) {
    	    	var result = Ext.JSON.decode(response.responseText);
    	    	if (result.success) {
    	    		e.record.set(result.data);
        	    	e.record.commit();
    	    	} else {
    	    		Ext.Msg.alert('提示', result.msg);
    	    		e.record.set('V_SERVICE_NUM_VIEW', '');
    	    	}
			},
			failure: function(response, opts) {
				Ext.Msg.alert('提示', '提交失败');
			}
    	});
    },
    
    OnAddPreProjectBtnClick: function(self, e, options) {
    	var me = this;
    	xtdx.user.Rights.hasRights('XLGL-XLZL-2', function() {
    		me.rowEditing.cancelEdit();
    		me.projStore.insert(0, {});
    		me.rowEditing.startEdit(0, 0);
    	});
    },
    
    OnDeleteProjectBtnClick: function(self, e, options) {
    	var me = this,
    	    grid = self.up('gridpanel'),
    	    store = grid.getStore(),
    	    sm = grid.getSelectionModel(),
    	    rows = sm.getSelection();
    	    
    	xtdx.user.Rights.hasRights('XLGL-XLZL-5', function() {
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
	    		Ext.MessageBox.confirm('提示', '确定删除该项目吗？', function(id) {
	            	if (id == 'yes') {
	            		//TODO 删除项目
		    			Ext.Ajax.request({
				    	    url: '../ftth/delProj',
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
	    		Ext.Msg.alert('提示','请选择要删除的项目！');
	    	}
    	});
    },
    
    OnLoadProjectFromFileBtnClick: function(self, e, options) {
    	xtdx.user.Rights.hasRights('XLGL-XLZL-4', function() {
    		Ext.create('xtdx.project.LoadProjWindow', {
	    	    grid: self.up('gridpanel')
	    	}).show();
    	});
    },
    
    OnExportProjectBtnClick: function(self, e, options) {
    	var me = this;
    	//导出为excel文件
    	xtdx.user.Rights.hasRights('XLGL-XLZL-6', function() {
    		//xtdx.ux.grid.Printer.printAutomatically = false;
    		//xtdx.ux.grid.Printer.print("协揽信息表", self.up('gridpanel'));
    		Ext.Ajax.request({
	    	    url: '../ftth/exportProj',
	    	    method: 'post',
	    	    params: me.projStore.getProxy().extraParams,
	    	    success: function(response, opts) {
	    	    	var result = Ext.JSON.decode(response.responseText);
	    	    	window.open(result.url)
				},
				failure: function(response, opts) {
					Ext.Msg.alert('提示','导出失败！');
				}
	    	});
    	});
    },
        
    OnSearchBtnClick: function(self, e, options) {
    	var me = this;
    	
    	var form = self.up('form').getForm();
    	if (!form.isValid()) return;
    	Ext.apply(me.projStore.getProxy(), {
    	     extraParams: form.getValues()
    	});
    	me.projStore.loadPage(1);
    },
    
    OnResetBtnClick: function(self, e, options) {
    	self.up('form').getForm().reset();
    }
});