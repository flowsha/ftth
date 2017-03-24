/**
 * This file is part of FTTH Project.
 * 
 * Copyright (c) 2011 XTDX Inc.
 */
 
/**
 * XTDX application entry.
 */
Ext.Loader.setConfig({enabled: true});

Ext.application({
    name: 'xtdx',
    appFolder: 'app',
    
    launch: function() {
    	Ext.QuickTips.init();
    	Ext.create('xtdx.com.LoginWindow');
    }
});

