/**
 * File: app/com/XtdxViewport.js
 * Author: liusha.
 */

Ext.define('xtdx.com.XtdxViewport', {
    extend: 'xtdx.com.ui.XtdxViewport',

    initComponent: function() {
        var me = this;
        me.callParent(arguments);
        
        Ext.require(['xtdx.ux.grid.Printer',
                     'xtdx.ux.form.field.ComboBoxTree',
                     'xtdx.user.Rights'
        ]);
        
        //xtdx.ux.grid.Printer.printAutomatically = false;
        //xtdx.ux.grid.Printer.print(self.up('gridpanel'));
        Ext.util.Format.decimalSeparator = '.';
        Ext.util.Format.thousandSeparator = ',';
                
        //bind menu Event.
        me.down('#PersonPadTree').on('itemclick', me.onPersonPadItemClick, me);
        me.down('#ProjectMgrTree').on('itemclick', me.onProjectMgrItemClick, me);
        me.down('#SysMgrTree').on('itemclick', me.onSysMgrItemClick, me);

        me.tabPanel = Ext.getCmp('xtdxTabPanel');
        //me.tabPanel.setActiveTab(me.tabPanel.add(Ext.create('xtdx.person.PersonPad')));
        
        //create combox store.
        me.createAllStaticStore();
        
        //validation.
        Ext.apply(Ext.form.field.VTypes, {
            dateRange: function(value, field) {
            	var beginDate = null,
            	    beginDateCmp = null,
            	    endDate = null,
            	    endDateCmp = null,
            	    validStatus = true,
            	    parent = field.dateRange.parent;
            	if (field.dateRange) {
            		if (!Ext.isEmpty(field.dateRange.begin)) {
            			beginDateCmp = parent.down('datefield[name="' + field.dateRange.begin + '"]');
            			beginDate = beginDateCmp.getValue();
            		}
            		
            		if (!Ext.isEmpty(field.dateRange.end)) {
            			endDateCmp = parent.down('datefield[name="' + field.dateRange.end + '"]');
            			endDate = endDateCmp.getValue();
            		}
            	}
            	
            	if (!Ext.isEmpty(beginDate) && !Ext.isEmpty(endDate)) {
            		validStatus = beginDate <= endDate;
            	}
            	
            	return validStatus;
            },
            dateRangeText: '起始日期不能大于结束日期，请重新选择！'
        });
    },
    
    show: function(me, options) {
    	var me = this;
    	me.setWelcomeInfo();
        me.createClock();
        me.registerQuickTip();
    },
    
    createAllStaticStore: function() {

    	Ext.regModel('Combox', {
    	    fields: [
    	        {name: 'V_COMBOX_NAME_VIEW', type: 'string'},
    	        {name: 'V_COMBOX_VALUE_VIEW', type: 'string'}
    	    ]
    	});
    	
    	new Ext.data.ArrayStore({
    	    model: 'Combox',
    	    storeId: 'DeptStore',
    	    data: [
    	        ['网络发展部', '网络发展部'],
    	        ['网络运行维护部', '网络运行维护部'],
    	        ['网络操作维护中心', '网络操作维护中心'],
    	        ['网络资源与业务调度中心', '网络资源与业务调度中心'],
    	        ['接入网与客户端装维中心', '接入网与客户端装维中心'],
    	        ['政企客户支撑中心', '政企客户支撑中心'],
    	        ['无线维护中心', '无线维护中心'],
    	        ['工程设计中心', '工程设计中心'],
    	        ['工程处', '工程处']
    	    ]
    	});
    	
    	new Ext.data.ArrayStore({
    	    model: 'Combox',
    	    storeId: 'YesOrNoStore',
    	    data: [
    	        ['是', '是'],
    	        ['否', '否']
    	    ]
    	});
    	
    },
    
    /**
     * register quick tip.
     */
    registerQuickTip: function() {
    	//register QuickTip.
        Ext.tip.QuickTipManager.register({
            target: Ext.get('DatetimeView'),
            text: Ext.Date.format(new Date(), '公元Y年n月j日')
        });
    },
    
    /**
     * set welcome information.
     */
    setWelcomeInfo: function() {
    	var me = this;
    	
    	var today = new Date();
    	
    	var h = today.getHours();
    	
    	if (h > 6 && h < 8) {
    		me.welcome = '早上好，' + me.welcome;
    	}
    	else if (h >= 8 && h < 12) {
    		me.welcome = '上午好，' + me.welcome;
    	}
    	else if (h >= 12 && h < 19) {
    		me.welcome = '下午好，' + me.welcome;
    	}
    	else {
    		me.welcome = '晚上好，' + me.welcome;
    	}
    	
    	Ext.fly('WelcomeId').dom.innerHTML = me.welcome;
    	
        var helpImg = Ext.create('Ext.Img', {
             src: 'resources/images/menu_sys_help_gray.png',
             renderTo: Ext.fly('HelpId')
        });
        
        Ext.fly('HelpId').on({
            'mouseover': {
            	fn: function() {
            		helpImg.setSrc('resources/images/menu_sys_help.png');
            	}
            },
            'mouseout': {
            	fn: function() {
            		helpImg.setSrc('resources/images/menu_sys_help_gray.png');
            	}
            },
            scope: this
        });
        
        var exitImg = Ext.create('Ext.Img', {
             src: 'resources/images/menu_sys_exit_gray.png',
             renderTo: Ext.fly('ExitSysId')
        });
        
        Ext.fly('ExitSysId').on({
            'mouseover': {
            	fn: function() {
            		exitImg.setSrc('resources/images/menu_sys_exit.png');
            	}
            },
            'mouseout': {
            	fn: function() {
            		exitImg.setSrc('resources/images/menu_sys_exit_gray.png');
            	}
            },
            'click': {
            	fn: function() {
            		Ext.MessageBox.confirm('提示', '确定退出系统吗？', function(id) {
            			if (id == 'yes') {
            				//注销用户登录信息
            				Ext.Ajax.request({
					    	    url: '../ftth/logout',
					    	    success: function(response, options) {
					    	    	var result = Ext.JSON.decode(response.responseText);
					    	    	if (result.IS_LOGOUT) {
					    	    	    location.href = './';
					    	    	} else {
					    	    		Ext.MessageBox.alert('提示', '注销失败，请重试！');
					    	    	}
					    	    },
					    	    failure: function(response, options) {
					    	    	Ext.Msg.alert('提示', '无法访问！');
					    	    }
					    	});
            				
            			}
            		});
            	}
            },
            scope: this
        });
        
        Ext.fly('DateId').dom.innerHTML = Ext.Date.format(new Date(), 'm/d');
    	Ext.fly('WeekId').dom.innerHTML = me.getDayOfWeek();
    },
    
    /**
     * create clock.
     */
    createClock: function() {
    	var task = {
    		run: function() {
    			Ext.fly('TimeId').dom.innerHTML = Ext.Date.format(new Date(), 'G:i:s');
    		},
    		interval: 1000
    	}
    	
    	var clock = new Ext.util.TaskRunner();
    	clock.start(task);
    },
    
    /**
     * 
     * @return {}
     */
    getDayOfWeek: function() {
    	var w, d = new Date();
    	switch (d.getDay()) {
    		case 0:
    		    w = '周日';
    		    break;
    		case 1:
    		    w = '周一';
    		    break;
    		case 2:
    		    w = '周二';
    		    break;
    		case 3:
    		    w = '周三';
    		    break;
    		case 4:
    		    w = '周四';
    		    break;
    		case 5:
    		    w = '周五';
    		    break;
    		case 6:
    		    w = '周六';
    		    break;    
    	}
    	return w;
    },
    
    /**
     * 
     * @param {} view
     * @param {} record
     * @param {} item
     * @param {} index
     * @param {} e
     * @param {} options
     */
    onPersonPadItemClick: function(view, record, item, index, e, options) {
    	var me = this;
    	switch (index) {
    		case 0:
    		    xtdx.user.Rights.hasRights('GRPT-GRXX-1', function() {
    	        	var currentTab = Ext.getCmp('PersonInfo');
	    		    if (currentTab == undefined) {
	    		    	me.tabPanel.setActiveTab(me.tabPanel.add(Ext.create('xtdx.person.PersonInfo')));
	    		    } else {
	    		    	me.tabPanel.setActiveTab(currentTab);
	    		    }
    	        });
    		    break;
    	}
    },
    
    /**
     * 
     * @param {} view
     * @param {} record
     * @param {} item
     * @param {} index
     * @param {} e
     * @param {} options
     */
    onProjectMgrItemClick: function(view, record, item, index, e, options) {
    	var me = this;
    	switch (index) {
    		case 0:
    	        xtdx.user.Rights.hasRights('XLGL-XLZL-1', function() {
    	        	var currentTab = Ext.getCmp('Projects');
	    		    if (currentTab == undefined) {
	    		    	me.tabPanel.setActiveTab(me.tabPanel.add(Ext.create('xtdx.project.Projects')));
	    		    } else {
	    		    	me.tabPanel.setActiveTab(currentTab);
	    		    }
    	        });
    		    break;
    	}
    },
    
    onSysMgrItemClick: function(view, record, item, index, e, options) {
    	var me = this;
    	switch (index) {
    		case 0:
    	        xtdx.user.Rights.hasRights('XTGL-YHGL-1', function() {
    	        	var currentTab = Ext.getCmp('UsersManager');  
	    		    if (currentTab == undefined) {
	    		    	me.tabPanel.setActiveTab(me.tabPanel.add(Ext.create('xtdx.user.UsersManager')));
	    		    } else {
	    		    	me.tabPanel.setActiveTab(currentTab);
	    		    }
    	        });
    		    break;
    	}
    	
    }
});