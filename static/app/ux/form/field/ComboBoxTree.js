/**
 * File: app/ux/form/field/ComboBoxTree.js
 * Author: liusha
 */
 
Ext.define('xdfn.ux.form.field.ComboBoxTree', {
    extend: 'Ext.form.field.Picker',

    alias: 'widget.combotree', 
    triggerCls: Ext.baseCSSPrefix + 'form-arrow-trigger',
    
    treeHeight : 200,
    treeStore : null,
    treeRoot: null,
    useArrows: false,
    allowUnLeafClick: false,
    displayField: 'text',
    expanded: true,
        
    initComponent: function() {
        var me = this;
        
        if (!me.valueField) me.valueField = me.displayField;
        me.setSubmitValue(null);
        
        me.callParent(arguments);
    },
    
    createPicker: function() {
    	var me = this;
    	
    	me.picker = Ext.create('Ext.tree.Panel', {
            height: me.treeHeight,
            displayField: me.displayField,
            autoScroll : true,
            floating : true,
            rootVisible: false,
            useArrows: me.useArrows,
            ownerCt: me.ownerCt,
            focusOnToFront: false,
            store: me.treeStore,
            listeners: {
            	select: {
            		fn: function(rowModel, record, index, eOpts) {
				    	if (me.allowUnLeafClick == true) {
							me.setValue(record.get(me.displayField));
							me.setSubmitValue(record.get(me.valueField));
							me.collapse();
						}
						else if (record.raw.leaf == true) {
							me.setValue(record.get(me.displayField));
							me.setSubmitValue(record.get(me.valueField));
							me.collapse();
						}
            		}
            	}
            }
        });
        
        return me.picker;
    },
    
    alignPicker: function() {
        var me = this,
            picker, isAbove,
            aboveSfx = '-above';

        if (this.isExpanded) {
            picker = me.getPicker();
            if (me.matchFieldWidth) {
                // Auto the height (it will be constrained by min and max width) unless there are no records to display.
            	me.treeWidth = me.treeWidth? me.treeWidth : me.bodyEl.getWidth();
                picker.setSize(me.treeWidth, me.treeHeight);//picker.store && picker.store.getCount() ? null : 0);
            }
            if (picker.isFloating()) {
                picker.alignTo(me.inputEl, me.pickerAlign, me.pickerOffset);

                // add the {openCls}-above class if the picker was aligned above
                // the field due to hitting the bottom of the viewport
                isAbove = picker.el.getY() < me.inputEl.getY();
                me.bodyEl[isAbove ? 'addCls' : 'removeCls'](me.openCls + aboveSfx);
                picker.el[isAbove ? 'addCls' : 'removeCls'](picker.baseCls + aboveSfx);
            }
        }
    },
    
    onExpand: function() {
    	var me = this;
    	if (me.expanded) {
    		me.picker.expandAll();
    	}
    },
    
    setSubmitValue: function(value) {
    	var me = this;
    	me.submitValue = value;
    },
    
    getSubmitValue: function() {
    	var me = this;
    	return me.submitValue;
    },
    
    reset : function(){
    	var me = this;
        me.callParent();
        me.applyEmptyText();
        me.setSubmitValue(null);
    }
});

