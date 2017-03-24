/**
 * File: app/project/store/ProjectsJsonStore.js
 * Author: liusha
 */
 
Ext.define('xtdx.project.store.ProjectsJsonStore', {
    extend: 'Ext.data.Store',

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            autoLoad: true,
            pageSize: 50,
            proxy: {
                type: 'ajax',
                url: '../ftth/getProj',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
            fields: [
                {
                    name: 'ID_VIEW',
                    type: 'string'
                },
                {
                    name: 'V_SERVICE_NUM_VIEW',
                    type: 'string'
                },
                {
                    name: 'V_ZONE_VIEW',
                    type: 'string'
                },
                {
                    name: 'V_CUST_NAME_VIEW',
                    type: 'string'
                },
                {
                    name: 'V_PHONE_VIEW',
                    type: 'string'
                },
                {
                    name: 'V_ADDRESS_VIEW',
                    type: 'string'
                },
                {
                    name: 'V_IDENTIFY_VIEW',
                    type: 'string'
                },
                {
                    name: 'N_MONEY_VIEW',
                    type: 'number'
                },
                {
                    name: 'V_PERSON_NO_VIEW',
                    type: 'string'
                },
                {
                    name: 'V_PERSON_VIEW',
                    type: 'string'
                },
                {
                    name: 'V_DEPT_VIEW',
                    type: 'string'
                },
                {
                    name: 'D_TIDAN_TIME_VIEW',
                    type: 'date',
                    dateFormat: 'Y-m-d H:i:s'
                },
                {
                    name: 'V_TIDAN_REN_VIEW',
                    type: 'string'
                },
                {
                    name: 'V_REMARK_VIEW',
                    type: 'string'
                },
                {
                    name: 'V_FIBER_INFO_VIEW',
                    type: 'string'
                },
                {
                    name: 'D_SHOULI_TIME_VIEW',
                    type: 'date',
                    dateFormat: 'Y-m-d'
                }
            ]
        }, cfg)]);
    }
});