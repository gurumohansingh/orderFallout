/**
* The main application class. An instance of this class is created by app.js when it
* calls Ext.application(). This is the ideal place to handle application launch and
* initialization details.
*/
var servicesUrl = {
    AddNew: 'http://localhost:3000/orderfallout/task',
    Delete: 'http://localhost:3000/orderfallout/task/',
    GetMappingService: 'http://localhost:3000/orderfallout/services/',
    Edit: 'http://localhost:3000/orderfallout/task/',
    getAllFalloutName: 'http://localhost:3000/orderfallout/task'
}
Ext.define('OrderFalloutTool.Application', {
    extend: 'Ext.app.Application',
    name: 'OrderFalloutTool',

    quickTips: false,
    platformConfig: {
        desktop: {
            quickTips: true
        }
    },

    stores: [
        // TODO: add global / shared stores here
    ],

    launch: function () {
        // TODO - Launch the application
    },

    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
/**
* This class is the main view for the application. It is specified in app.js as the
* "mainView" property. That setting automatically applies the "viewport"
* plugin causing this view to become the body element (i.e., the viewport).
*
* TODO - Replace this content of this view to suite the needs of your application.
*/

Ext.define('OrderFalloutTool.view.main.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'app-main',

    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox'
    ],
    ui: 'navigation',

    //tabBarHeaderPosition: 0,
    //titleRotation: 0,
    tabRotation: 0,
    titlePosition: 2,
    header: {
        
        layout: {
            align: 'stretchmax'
        },
        title: {
            flex: 0,
            
        },
        items: [{
            xtype: 'image',
            src: 'app/logo.png',
            width: '64px',
            height: '56px',
        }],
    },
    tabBar: {
        flex: 1,
        layout: {
            align: 'stretch',
            overflowHandler: 'none'
        }
    },

    responsiveConfig: {
        tall: {
            headerPosition: 'top'
        },
        wide: {
            headerPosition: 'left'
        }
    },

    defaults: {
        bodyPadding: 20,
        scrollable: true,
        tabConfig: {
            plugins: 'responsive',
            responsiveConfig: {
                wide: {
                    iconAlign: 'left',
                    textAlign: 'left'
                },
                tall: {
                    iconAlign: 'top',
                    textAlign: 'center',
                    width: 100
                }
            }
        }
    },

    items: [{
        title: 'Manage',
        iconCls: 'fa-cog',
        // The following grid shares a store with the classic version's grid as well!
        items: [{
            xtype: 'cognitoforms'
        }]
    }, {
        title: 'View',
        iconCls: 'fa-th-list'
    }]
});

Ext.define('OrderFalloutTool.view.form.cognitoformsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.form-cognitoforms',
    init: function () {
        var me = this;
        me.ruleNum = 1, me.taskRule = 1, me.messages = 1, me.allowTotalCount = 5, editFlag = false;
        me.loadOrderFallForEdit();

    },
    AddMoreRule: function (button, e) {
        var me = this;
        me.ruleNum = me.ruleNum + 1
        var totalForm = me.getView().query('extractionTaskform').length;
        var newForm = Ext.create('OrderFalloutTool.view.form.extractionTaskform', {
            title: 'Rule ' + ++totalForm,
            reference: 'extractionTaskform' + me.ruleNum,
            ruleNum: me.ruleNum
        });

        me.getView().getComponent('extractionTaskformContainer').add(me.ruleNum, newForm)
        if (totalForm === me.allowTotalCount && button !== null) {
            button.setDisabled(true);
        }
    },
    AddMoreTaskRule: function (button) {
        var me = this;
        me.taskRule = me.taskRule + 1
        var totalForm = me.getView().query('transformTaskform').length;
        var newForm = Ext.create('OrderFalloutTool.view.form.transformTaskform', {
            title: 'Rule ' + ++totalForm,
            reference: 'transformTaskform' + me.taskRule,
            ruleNum: me.taskRule
        });
        me.getView().getComponent('transformTaskformContainer').add(me.taskRule, newForm);
        if (totalForm === me.allowTotalCount && button !== null) {
            button.setDisabled(true);
        }
    },
    AddMoreMessageRule: function (button) {
        var me = this;
        me.messages = me.messages + 1
        var totalForm = me.getView().query('requestMessageform').length;
        var newForm = Ext.create('OrderFalloutTool.view.form.RequestMessageform', {
            title: 'Message ' + ++totalForm,
            reference: 'requestMessageform' + me.messages,
            ruleNum: me.messages
        });
        me.getView().getComponent('requestMessageformContainer').add(me.messages, newForm);
        if (totalForm === me.allowTotalCount && button !== null) {
            button.setDisabled(true);
        }
    },
    extractionTaskTypeChange: function (combo, newValue, oldValue, eOpts) {
        var me = this;
        var form = combo.up('extractionTaskform').getForm();
        var apiFields = ['extractionTaskSoapAction', 'extractionTaskExtractionTag', 'extractionTaskRequestMessage', 'extractionTaskRequestMessagelabel']
        var SqlFields = ['extractionTaskQuery', 'extractionTaskValidationExpression', 'extractionTaskDatabase', 'extractionTaskDatabaselabel'];
        var splFields = ['extractionTaskQuery', 'extractionTaskValidationExpression', 'extractionTaskfieldstoreMessage', 'extractionTaskfieldcontainerlabel'];
        var manualFields = ['extractionTaskValue']
        if (newValue === 'SQL') {
            me.hideFields(form, apiFields.concat(splFields).concat(manualFields));
            me.showFields(form, SqlFields);
        }
        if (newValue === 'API') {
            me.hideFields(form, SqlFields.concat(splFields).concat(manualFields));
            me.showFields(form, apiFields);

        }
        if (newValue === 'SPL') {
            me.hideFields(form, apiFields.concat(SqlFields).concat(manualFields));
            me.showFields(form, splFields);
        }
        if (newValue === 'MANUAL') {
            me.hideFields(form, apiFields.concat(splFields).concat(SqlFields));
            me.showFields(form, manualFields);
        }

    },
    showFields: function (form, list) {
        for (var i = 0; i < list.length; i++) {
            form.findField(list[i]).setHidden(false);
        }
    },
    hideFields: function (form, list) {
        for (var i = 0; i < list.length; i++) {
            form.findField(list[i]).setHidden(true);
        }
    },
    showDatabase: function (radio, newValue, oldValue, eOpts) {
        var form = radio.up('extractionTaskform').getForm();
        if (newValue.rb === '1') {
            form.findField('extractionTaskOrderPriority').setHidden(false);
            form.findField('extractionTaskOrderPrioritylabel').setHidden(false);
        } else {
            form.findField('extractionTaskOrderPriority').setHidden(true);
            form.findField('extractionTaskOrderPrioritylabel').setHidden(true);
        }
    },
    changeextractionTaskformTitle: function (panel, eOpts) {
        var me = this;
        var count = 1;
        var totalForm = me.getView().query('extractionTaskform');
        for (var i = 0; i < totalForm.length; i++) {
            if (panel.ruleNum !== totalForm[i].ruleNum) {
                totalForm[i].setTitle('Rule ' + count);
                count++;
            }
        }
        if (totalForm.length <= me.allowTotalCount)
            me.getView().getComponent('AddMoreRuleExtractionTaskButton').setDisabled(false);
    },
    changeRequestMessageformTitle: function (panel, eOpts) {
        var me = this;
        var count = 1;
        var totalForm = me.getView().query('requestMessageform');
        for (var i = 0; i < totalForm.length; i++) {
            if (panel.ruleNum !== totalForm[i].ruleNum) {
                totalForm[i].setTitle('Rule ' + count);
                count++;
            }
        }
        if (totalForm.length <= me.allowTotalCount)
            me.getView().getComponent('addMoreMessageRuleButton').setDisabled(false);
    },
    changeTransformTaskformTitle: function (panel, eOpts) {
        var me = this;
        var count = 1;
        var totalForm = me.getView().query('transformTaskform');
        for (var i = 0; i < totalForm.length; i++) {
            if (panel.ruleNum !== totalForm[i].ruleNum) {
                totalForm[i].setTitle('Rule ' + count);
                count++;
            }
        }
        if (totalForm.length <= me.allowTotalCount)
            me.getView().getComponent('addMoreTaskRuleButton').setDisabled(false);
    },
    //submit button
    formSubmit: function (button) {
        var me = this;
        var view = me.getView();
        var error = 0;
        button.setDisabled(true);
        var addEdit = view.down('#radioAddEdit').getValue().AddEdit;
        var extractionTaskformData = [];
        var extractionTaskforms = view.query('extractionTaskform');
        var transformTaskformDataError = [];
        for (var i = 0; i < extractionTaskforms.length; i++) {
            var form = extractionTaskforms[i].getForm();
            var formData = {};
            formData.name = form.findField('extractionTaskName').getValue();
            if (formData.name.trim() === '')
                transformTaskformDataError.push(extractionTaskforms[i])
            formData.type = form.findField('extractionTaskType').getValue();
            if (form.findField('extractionTaskType').getValue() === 'API') {
                formData.operation = form.findField('extractionTaskSoapAction').getValue();
                formData.extraction_tag = form.findField('extractionTaskExtractionTag').getValue();
                formData.request_payload = form.findField('extractionTaskRequestMessage').getValue();
            }
            if (form.findField('extractionTaskType').getValue() === 'SQL') {
                formData.query = form.findField('extractionTaskQuery').getValue();
                formData.validation_expression = form.findField('extractionTaskValidationExpression').getValue();
                formData.db_alias = form.findField('extractionTaskDatabase').getValue();
            }
            if (form.findField('extractionTaskType').getValue() === 'SPL') {
                formData.query = form.findField('extractionTaskQuery').getValue();
                formData.validation_expression = form.findField('extractionTaskValidationExpression').getValue();
                if (form.findField('extractionTaskfieldstoreMessage').getValue().rb == "1") {
                    formData.STORE_MSG_FLAG = 1;
                }
                else {
                    formData.STORE_MSG_FLAG = 0;
                }
            }
            if (form.findField('extractionTaskType').getValue() === 'MANUAL') {
                formData.query = form.findField('extractionTaskValue').getValue();
            }
            extractionTaskformData.push(formData);
        }
        var AllTransForms = view.query('transformTaskform');
        var transformTaskformData = [];
        for (var i = 0; i < AllTransForms.length; i++) {
            var form = AllTransForms[i].getForm();
            var formData = {};
            formData.name = form.findField('transformTaskName').getValue();
            formData.type = form.findField('transformTaskType').getValue();
            formData.tag_name = form.findField('transformTaskTagName').getValue();
            formData.validation_expression = form.findField('transformTaskValidationExpression').getValue();
            formData.extracted_value_name = form.findField('transformTaskExtractedValueName').getValue();
            formData.action = form.findField('transformTaskAction').getValue();
            if (formData.name.trim() === '' || formData.tag_name.trim() === '' || formData.extracted_value_name.trim() === '') {
                transformTaskformDataError.push(transformTaskformData[i])
            }
            transformTaskformData.push(formData);
        }
        var allRequestMessageform = view.query('requestMessageform');
        var requestMessageformsData = [];
        for (i = 0; i < allRequestMessageform.length; i++) {
            var form = allRequestMessageform[i].getForm(), formData = {};
            formData.ENDPOINT_NAME = form.findField('reqMsgEndpoint').getValue();
            formData.ENDPOINT_SERVICE = form.findField('reqMsgService').getValue();
            formData.REQUEST_PAYLOAD = form.findField('reqMsgExtractedValueName').getValue();
            requestMessageformsData.push(formData);
        }
        //get name and description
        var orderFallOut = {};
        orderFallOut.name = view.down('#orderFallName').getValue();
        orderFallOut.description = view.down('#orderFallDescription').getValue();
        if (orderFallOut.name === '')
            error = 1;
        editId = view.down('#editTask').getValue();
        var submitFormData = {
            orderFallMain: orderFallOut,
            extractionTask: extractionTaskformData,
            transformTask: transformTaskformData,
            requestMessage: requestMessageformsData,
            addEditFlag: addEdit,
            editId: editId
        }

        if (transformTaskformDataError.length === 0 && error === 0) {
            Ext.Ajax.request({
                url: servicesUrl.AddNew,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                jsonData: {
                    postData: Ext.util.JSON.encode(submitFormData)
                },
                success: function (response, opts) {
                    button.setDisabled(false);
                    me.removeFormsForEdit(extractionTaskforms);
                    me.removeFormsForEdit(AllTransForms);
                    me.removeFormsForEdit(allRequestMessageform);
                    view.down('#orderFallName').reset();
                    view.down('#orderFallDescription').reset();
                    view.down('#radioAddEdit').setValue({ AddEdit: 'AddNew' })
                    me.loadOrderFallForEdit();
                    me.showHideResponse('<span style="color:#RRGGBB; padding-left: 2px;">Data Added Successfully.</span>');

                },
                failure: function (response, opts) {
                    button.setDisabled(false);
                    view.setLoading(false);
                    var msg = "Service is down, Please contact to system Administrator.";
                    if (response.responseText) {
                        var obj = Ext.decode(response.responseText);
                        msg = obj.Message.Message;
                    }
                    me.showHideResponse('<span style="color:#ff0000; padding-left: 2px;">' + msg + '.</span>');
                }
            });
        } else {
            button.setDisabled(false);
            Ext.Msg.alert('Warning!', 'Please check and try again!');
        }
    },
    LoadService: function (combo, newValue, oldValue, eOpts) {
        var form = combo.up('requestMessageform').getForm();

        var getSeriviceStore = form.findField('reqMsgService').getStore();
        Ext.Ajax.request({
            url: servicesUrl.GetMappingService + newValue,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            success: function (response, opts) {
                var obj = Ext.decode(response.responseText);
                getSeriviceStore.loadData(obj.response)
            },
            failure: function (response, opts) {
                console.log('server-side failure with status code ' + response.status);
            }
        });
    },
    loadOrderFallForEdit: function () {
        var me = this;
        var view = me.getView();
        var OrderFallStore = view.down('#editTask').getStore();
        Ext.Ajax.request({
            url: servicesUrl.getAllFalloutName,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            success: function (response, opts) {
                var obj = Ext.decode(response.responseText);
                OrderFallStore.loadData(obj.response)
            },
            failure: function (response, opts) {
                console.log('server-side failure with status code ' + response.status);
            }
        });
    },
    loadDataToEdit: function (combo, newVal, oldVal, e) {
        var me = this;
        Ext.Ajax.request({
            url: servicesUrl.Edit + newVal,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            success: function (response, opts) {
                var obj = Ext.decode(response.responseText);
                me.loadEditForm(obj.response);

            },
            failure: function (response, opts) {
                console.log('server-side failure with status code ' + response.status);
            }
        });
    },
    showHideResponse: function (msg) {
        var showHideResponsePnl = this.getView().down('#showSuccessError');
        var showHideResponseCmp = this.getView().down('#showSuccessErrorCmp');
        showHideResponseCmp.setHtml(msg);
        showHideResponsePnl.setHidden(false);
    },
    removeFormsForEdit: function (form) {
        for (var i = 0; i < form.length; i++) {
            if (i === 0)
                form[i].reset()
            else
                form[i].destroy();
        }
    },
    loadEditForm: function (data) {
        var me = this;
        var view = me.getView();
        var extractionTaskformsData = data.extractionTask;
        view.down('#orderFallName').setValue(data.orderFallMain[0].NAME);
        view.down('#orderFallDescription').setValue(data.orderFallMain[0].DESCRIPTION);
        //destroy existing forms
        me.removeFormsForEdit(view.query('extractionTaskform'));
        me.removeFormsForEdit(view.query('transformTaskform'));
        me.removeFormsForEdit(view.query('requestMessageform'));
        view.down('#radioAddEdit').setValue({ AddEdit: 'Edit' });
        for (var i = 0; i < extractionTaskformsData.length; i++) {
            var extractionTaskforms = view.query('extractionTaskform');
            var form = extractionTaskforms[i].getForm();
            var formData = extractionTaskformsData[i];
            form.findField('extractionTaskName').setValue(formData.NAME);
            var type = formData.TYPE;
            form.findField('extractionTaskType').setValue(type);
            if (type === 'API') {
                form.findField('extractionTaskSoapAction').setValue(formData.EXTRACTION_TAG);
                form.findField('extractionTaskExtractionTag').setValue(formData.EXTRACTION_TAG);
                form.findField('extractionTaskRequestMessage').setValue(formData.REQUEST_PAYLOAD);
            }
            if (type === 'SQL') {
                form.findField('extractionTaskQuery').setValue(formData.QUERY);
                form.findField('extractionTaskValidationExpression').setValue(formData.VALIDATION_EXPRESSION);
                form.findField('extractionTaskDatabase').setValue(formData.DB_ALIAS);
            }
            if (type === 'SPL') {
                form.findField('extractionTaskQuery').setValue(formData.QUERY);
                form.findField('extractionTaskValidationExpression').setValue(formData.VALIDATION_EXPRESSION);
                form.findField('extractionTaskfieldstoreMessage').setValue({ rb: formData.STORE_MSG_FLAG });
            }

            if (type === 'MANUAL') {
                form.findField('extractionTaskValue').setValue(formData.QUERY);
            }
            if (extractionTaskformsData.length - 1 > i)
                me.AddMoreRule(null, null);
        }

        for (var i = 0; i < data.transformTask.length; i++) {
            var AllTransForms = view.query('transformTaskform');
            var form = AllTransForms[i].getForm();
            var formData = data.transformTask[i]
            form.findField('transformTaskName').setValue(formData.NAME);
            form.findField('transformTaskType').setValue(formData.TYPE);
            form.findField('transformTaskTagName').setValue(formData.TAG_NAME);
            form.findField('transformTaskValidationExpression').setValue(formData.VALIDATION_EXPRESSION);
            form.findField('transformTaskAction').setValue(formData.ACTION);
            formData.extracted_value_name = form.findField('transformTaskExtractedValueName').setValue(formData.EXTRACTED_VALUE_NAME);
            if (data.transformTask.length - 1 > i)
                me.AddMoreTaskRule(null);
        }

        for (i = 0; i < data.requestMessage.length; i++) {
            var allRequestMessageform = view.query('requestMessageform');
            var form = allRequestMessageform[i].getForm();
            var formData = data.requestMessage[i];
            form.findField('reqMsgEndpoint').setValue(formData.ENDPOINT_NAME);
            form.findField('reqMsgService').setValue(formData.ENDPOINT_SERVICE);
            form.findField('reqMsgExtractedValueName').setValue(formData.REQUEST_PAYLOAD);
            if (data.requestMessage.length - 1 > i)
                me.AddMoreMessageRule(null);

        }
    },
    formDelete: function (combo, newVal, oldVal, e) {
        var me = this;
        var view = me.getView();
        var id = view.down('#editTask').getValue();
        Ext.Msg.show({
            title: 'Delete',
            message: 'You are Deleting Order Fall Data. Would you like to Delete?',
            buttons: Ext.Msg.YESNOCANCEL,
            fn: function (btn) {
                if (btn === 'yes') {
                    Ext.Ajax.request({
                        url: servicesUrl.Delete + id,
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        success: function (response, opts) {
                            window.location.href = window.location.href;
                        },
                        failure: function (response, opts) {
                            var msg = "Service is down, Please contact to system Administrator.";
                            if (response.responseText) {
                                var obj = Ext.decode(response.responseText);
                                msg = obj.Message;
                            }
                            me.showHideResponse('<span style="color:#ff0000; padding-left: 2px;">' + msg + '.</span>');
                        }
                    });
                }
            }
        });
    }
});

Ext.define('OrderFalloutTool.view.form.cognitoforms', {
    extend: 'Ext.container.Container',
    xtype: 'cognitoforms',
    refernce: 'cognitoformsPanel',
    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox'
    ],
    controller: 'form-cognitoforms',
    viewModel: {
        type: 'form-cognitoforms'
    },
    defaults: {
        margin: '5 5 5 5'
    },
    items: [{
        xtype: 'container',
        itemId: 'ruleFormContainer',
        items: [{
            xtype: 'label',
            html: '<h2>Order Fallout Data Form</h2>',
            style: {
                color: '#003168'
            }
        }, {
            xtype: 'label',
            html: 'Form to enter data capture and extraction rules, data transform rules, and message payload needed for re-submission',
            style: {
                'font-family': 'Arial,Helvetica,sans-serif',
                'font-size': '13'
            }
        }, {
            xtype: 'label',
            html: '<h2>Create New Order Fallout Task.</h2>',
            style: {
                color: '#003168'
            }

        }, {
            xtype: 'container',
            layout: 'hbox',
            defaults: {
                width: 280,
                labelWidth: 120
            },
            items: [
                {
                    xtype: 'combo',
                    fieldLabel: 'Select Task For Edit',
                    forceSelection: true,
                    editable: false,
                    valueField: 'OF_TASK_ID',
                    displayField: 'NAME',
                    itemId: 'editTask',
                    queryMode: 'local',
                    listeners: {
                        change: 'loadDataToEdit'
                    },
                    store: {

                    }
                }, {
                    xtype: 'radiogroup',
                    fieldLabel: 'Select Action',
                    itemId: 'radioAddEdit',
                    labelWidth: 80,
                    items: [
                        { boxLabel: 'Add New', name: 'AddEdit', inputValue: 'AddNew', checked: true },
                        { boxLabel: 'Edit', name: 'AddEdit', inputValue: 'Edit' }
                    ]
                }
            ]
        },
        {
            xtype: 'container',
            layout: 'hbox',
            defaults: {
                labelAlign: 'top',
                margin: '0 15 10 0'
            },
            items: [
                {
                    xtype: 'textfield',
                    itemId: 'orderFallName',
                    fieldLabel: 'Name',
                    allowBlank: false,
                    width: 390,
                    border: 1,
                    labelSeparator: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>'
                }, {
                    xtype: 'textarea',
                    itemId: 'orderFallDescription',
                    fieldLabel: 'Description',
                    allowBlank: false,
                    width: 390,
                    labelSeparator: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>'
                }
            ]
        },
        {
            xtype: 'label',
            html: '<h2>Extraction Task</h2><h3>Capture and Extraction Rules</h3>',
            style: {
                color: '#003168'
            }
        },
        {
            xtype: 'label',
            html: 'Enter one or more Data capture and Extraction Rules',
            style: {
                'font-style': 'italic',
                'font-size': '13',
                'font-family': 'Arial,Helvetica,sans-serif'
            }
        }]
    },
    {
        xtype: 'container',
        itemId: 'extractionTaskformContainer',
        items: [{
            xtype: 'extractionTaskform'
        }]
    }, {
        xtype: 'button',
        text: '+Add Rule',
        handler: 'AddMoreRule',
        itemId: 'AddMoreRuleExtractionTaskButton',
        width: 100

    }, {
        xtype: 'container',
        items: [{
            xtype: 'label',
            html: '<h2>Transform Task</h2><h3>Transform Rules</h3>',
            style: {
                color: '#003168'
            }
        }, {
            xtype: 'label',
            html: 'Enter one or more Tranform rules',
            style: {
                'font-style': 'italic',
                'font-size': '13',
                'font-family': 'Arial,Helvetica,sans-serif'
            }
        }]
    },
    {
        xtype: 'container',
        itemId: 'transformTaskformContainer',
        items: [{
            xtype: 'transformTaskform'
        }]
    },
    {
        xtype: 'button',
        text: '+Add Rule',
        handler: 'AddMoreTaskRule',
        itemId: 'addMoreTaskRuleButton'
    }, {
        xtype: 'container',
        items: [{
            xtype: 'label',
            html: '<h2>Request Message</h2>',
            style: {
                color: '#003168'
            }
        }, {
            xtype: 'label',
            html: 'Enter in request message details required for re-submission',
            style: {
                'font-style': 'italic',
                'font-size': '13',
                'font-family': 'Arial,Helvetica,sans-serif'
            }
        }]
    },
    {
        xtype: 'container',
        itemId: 'requestMessageformContainer',
        items: [{
            xtype: 'requestMessageform'
        }]
    },
    {
        xtype: 'button',
        cls: 'btn',
        text: '+Add Message',
        handler: 'AddMoreMessageRule',
        itemId: 'addMoreMessageRuleButton'
    }, {
        xtype: 'panel',
        width: 800,
        itemId: 'showSuccessError',
        hidden: true,
        style: { borderColor: '#ff0000', borderStyle: 'solid', borderWidth: '1px' },
        tbar: [
            {
                xtype: "tool",
                type: "close",
                tooltip: "Close",
                handler: function () {
                    this.up("panel").setHidden(true);
                }
            }
        ],
        items: [{
            xtype: 'component',
            html: '',
            itemId: 'showSuccessErrorCmp'
        }]
    }, {
        xtype: 'container',
        items: [
            {
                xtype: 'tbfill'
            }, {
                xtype: 'button',
                cls: 'btn',
                text: 'Submit',
                margin: '20 0 0 0',
                handler: 'formSubmit',
                itemId: 'formButton'
            }, {
                xtype: 'button',
                cls: 'btn',
                text: 'Delete',
                margin: '20 0 0 20',
                handler: 'formDelete',
                itemId: 'formDelete'
            }]
    }]
});


Ext.define('OrderFalloutTool.view.form.extractionTaskform', {
    extend: 'Ext.form.Panel',
    xtype: 'extractionTaskform',
    bodyPadding: 5,
    width: 820,
    title: 'Rule 1',
    closable: true, ruleNum: 1,

    reference: 'extractionTaskform1',
    listeners: {
        close: 'changeextractionTaskformTitle'
    },
    items: [{
        xtype: 'container',
        layout: 'hbox',
        defaultType: 'textfield',
        margin: '0 0 0 10',
        defaults: {
            labelAlign: 'top',
            margin: '0 15 0 0'
        },
        items: [{
            fieldLabel: 'Name',
            name: 'extractionTaskName',
            width: 390,
            allowBlank: false,
            labelSeparator: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>'
        },
        {
            fieldLabel: 'Type',
            name: 'extractionTaskType',
            xtype: 'combo',
            displayField: 'Value',
            valueField: 'name',
            queryMode: 'local',
            value: 'API',
            width: 390,
            allowBlank: false,
            forceSelection: true,
            labelSeparator: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>',
            store: {
                data: [
                    { "Value": "API", "name": "API" },
                    { "Value": "SQL", "name": "SQL" },
                    { "Value": "SPL", "name": "SPL" },
                    { "Value": "MANUAL", "name": "MANUAL" }
                ]
            },
            listeners: {
                change: 'extractionTaskTypeChange'
            }
        }]
    }, {
        xtype: 'container',
        layout: 'hbox',
        defaultType: 'textfield',
        margin: '0 0 0 10',
        defaults: {
            labelAlign: 'top',
            margin: '10 15 0 0'
        },
        items: [{
            fieldLabel: 'Soap Action',
            name: 'extractionTaskSoapAction',
            width: 390
        }, {
            fieldLabel: 'Extraction Tag',
            name: 'extractionTaskExtractionTag',
            width: 390,
        }
        ]
    },
    {
        xtype: 'container',
        layout: 'hbox',
        defaultType: 'textareafield',
        margin: '0 0 0 10',
        defaults: {
            labelAlign: 'top',
            margin: '10 15 0 0',
            hidden: true
        },
        items: [{
            fieldLabel: 'Query',
            name: 'extractionTaskQuery',
            width: 390
        }, {
            fieldLabel: 'ValidationExpression',
            name: 'extractionTaskValidationExpression',
            width: 390,
        }
        ]
    }, {
        xtype: 'container',
        margin: '0 0 0 10',
        layout: 'vbox',
        defaultType: 'textareafield',
        defaults: {
            labelAlign: 'top',
            margin: '10 15 0 0',
            hidden: true
        },
        items: [{
            fieldLabel: 'Database',
            labelAlign: 'top',
            name: 'extractionTaskDatabase',
            xtype: 'combo',
            displayField: 'name',
            valueField: 'Value',
            queryMode: 'local',
            width: 390,
            forceSelection: true,
            store: {
                data: [
                    { "Value": "OM", "name": "OM" },
                    { "Value": "BSCS", "name": "BSCS" },
                    { "Value": "AUXDB", "name": "AUXDB" },
                    { "Value": "REPDB", "name": "REPDB" }
                ]
            }

        }, {
            xtype: 'displayfield',
            html: 'Represents the alias name for the database credentials',
            name: 'extractionTaskDatabaselabel',
            margin: '0 0 0 10',
            style: {
                'font-style': 'italic',
                'font-size': '13',
                'font-family': 'Arial,Helvetica,sans-serif'
            }
        }]
    }, {
        xtype: 'container',
        layout: 'vbox',
        defaultType: 'radiofield',
        margin: '0 0 0 10',
        defaults: {
            labelAlign: 'top',
            margin: '10 15 0 0'
        },
        items: [{
            xtype: 'radiogroup',
            fieldLabel: 'Store as Message?',
            columns: 2,
            name: 'extractionTaskfieldstoreMessage',
            hidden: true,
            vertical: true,
            items: [
                { boxLabel: 'Yes', name: 'rb', inputValue: '1' },
                { boxLabel: 'No', name: 'rb', inputValue: '2', checked: true },

            ],
            listeners: {
                change: 'showDatabase'
            }
        },
        {
            xtype: 'displayfield',
            value: 'The data captured will be stored as a Request Message. The Endpoint <br>and Soap Action will be parsed out of the data returned.',
            name: 'extractionTaskfieldcontainerlabel',
            margin: '0 0 0 10',
            hidden: true,
            style: {
                'font-style': 'italic',
                'font-size': '13',
                'font-family': 'Arial,Helvetica,sans-serif'
            }
        }, {
            fieldLabel: 'Order Priority',
            hidden: true,
            name: 'extractionTaskOrderPriority',
            xtype: 'textfield',
            labelAlign: 'top',
            width: 390,
            grow: true
        },
        {
            xtype: 'displayfield',
            value: 'Higher Priority Request Messages will get re-submitted before <br>lower priority.',
            name: 'extractionTaskOrderPrioritylabel',
            margin: '0 0 0 10',
            hidden: true,
            style: {
                'font-style': 'italic',
                'font-size': '13',
                'font-family': 'Arial,Helvetica,sans-serif'
            }

        }]
    },
    {
        xtype: 'container',
        margin: '0 0 0 10',
        layout: 'vbox',
        defaultType: 'textfield',
        defaults: {
            labelAlign: 'top',
            margin: '10 15 0 0'

        },
        items: [{
            fieldLabel: 'Request Message',
            name: 'extractionTaskRequestMessage',
            xtype: 'textareafield',
            height: 150,
            width: 390,
            grow: true
        },
        {
            xtype: 'displayfield',
            value: 'Valid SOAP request payload',
            name: 'extractionTaskRequestMessagelabel',
            margin: '0 0 0 10',
            style: {
                'font-style': 'italic',
                'font-size': '13',
                'font-family': 'Arial,Helvetica,sans-serif'
            }
        }
        ]
    }, {

        fieldLabel: 'Value',
        name: 'extractionTaskValue',
        labelAlign: 'top',
        margin: '0 0 0 10',
        xtype: 'textfield',
        hidden: true,
        width: 390

    }]

});


Ext.define('OrderFalloutTool.view.form.RequestMessageform', {
    extend: 'Ext.form.Panel',
    xtype: 'requestMessageform',
    bodyPadding: 5,
    width: 820,
    title: 'Message 1',
    closable: true,
    ruleNum: 1,
    reference: 'requestMessageform1',
    listeners: {
        close: 'changeRequestMessageformTitle'
    },
    items: [{
        xtype: 'container',
        layout: 'hbox',
        defaultType: 'textfield',
        margin: '10 0 0 10',
        defaults: {
            labelAlign: 'top',
            margin: '0 15 0 0'
        },
        items: [
            {
                fieldLabel: 'Endpoint',
                xtype: 'combo',
                displayField: 'Value',
                name: 'reqMsgEndpoint',
                valueField: 'name',
                queryMode: 'local',
                width: 390,
                forceSelection: true,
                allowBlank: false,
                labelSeparator: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>',
                store: {
                    data: [
                        { "Value": "WSIL", "name": "WSIL" },
                        { "Value": "OM", "name": "OM" },
                        { "Value": "BSCS", "name": "BSCS" }
                    ]
                },
                listeners: {
                    change: 'LoadService'
                }
            }, {
                fieldLabel: 'Service',
                xtype: 'combo',
                displayField: 'SERVICE_NAME',
                valueField: 'SERVICE_NAME',
                name: 'reqMsgService',
                queryMode: 'local',
                allowBlank: false,
                labelSeparator: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>',
                width: 390,
                store: {
                    data: [
                        { "SERVICE_NAME": "Select" }

                    ]
                }
            }],


    }, {

        xtype: 'label',
        html: ' Represents the Endpoint URL for this API re-submission.',
        margin: '0 0 0 10',
        style: {
            'font-style': 'italic',
            'font-size': '13',
            'font-family': 'Arial,Helvetica,sans-serif'
        }

    }, {
        xtype: 'container',
        layout: 'vbox',
        defaultType: 'textfield',
        margin: '10 0 0 10',
        defaults: {
            labelAlign: 'top',
            margin: '0 15 0 0'

        },
        items: [{
            fieldLabel: 'Request Message',
            name: 'reqMsgExtractedValueName',
            xtype: 'textareafield',
            height: 150,
            width: 800,
            grow: true,
            allowBlank: false,
            labelSeparator: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>'
        },
        {
            xtype: 'label',
            html: 'This is the request payload that will require transform rules performed.',
            margin: '0 0 0 10',
            style: {
                'font-style': 'italic',
                'font-size': '13',
                'font-family': 'Arial,Helvetica,sans-serif'
            }
        },
        {
            fieldLabel: 'Order Priority',
            name: 'reqMsgOrderPriority',
            width: 390
        },
        {
            xtype: 'label',
            html: 'Higher Priority Request Messages will get re-submitted before <br>lower priority.',
            margin: '0 0 0 10',
            style: {
                'font-style': 'italic',
                'font-size': '13',
                'font-family': 'Arial,Helvetica,sans-serif'
            }
        }
        ]
    }]

});


Ext.define('OrderFalloutTool.view.form.transformTaskform', {
    extend: 'Ext.form.Panel',
    xtype: 'transformTaskform',
    bodyPadding: 5,
    width: 820,
    title: 'Rule 1',
    closable: true,
    ruleNum: 1,
    reference: 'transformTaskform1',
    listeners: {
        close: 'changeTransformTaskformTitle'
    },
    items: [{
        xtype: 'container',
        layout: 'hbox',
        defaultType: 'textfield',
        margin: '10 0 10 10',
        defaults: {
            labelAlign: 'top',
            margin: '0 15 0 0'
        },
        items: [{
            fieldLabel: 'Name',
            name: 'transformTaskName',
            allowBlank: false,
            labelSeparator: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>',
            width: 390
        },
        {
            fieldLabel: 'Type',
            xtype: 'combo',
            name: 'transformTaskType',
            displayField: 'Value',
            valueField: 'name',
            queryMode: 'local',
            allowBlank: false,
            forceSelection: true,
            labelSeparator: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>',
            width: 390,
            store: {
                data: [
                    { "Value": "XML", "name": "XML" }
                ]
            }
        }]
    }, {
        xtype: 'container',
        margin: '50 0 0 0',
        layout: 'hbox',
        defaultType: 'textfield',
        margin: '10 0 10 10',
        defaults: {
            labelAlign: 'top',
            margin: '0 15 0 0'
        },
        items: [{
            fieldLabel: 'Tag Name',
            name: 'transformTaskTagName',
            width: 390,
            allowBlank: false,
            labelSeparator: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>'
        }, {
            fieldLabel: 'Action',
            xtype: 'combo',
            name: 'transformTaskAction',
            displayField: 'Value',
            valueField: 'name',
            queryMode: 'local',
            allowBlank: false,
            forceSelection: true,
            value: 'UPDATE',
            labelSeparator: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>',
            width: 390,
            store: {
                data: [
                    { "Value": "UPDATE", "name": "UPDATE", selected: true },
                    { "Value": "CREATE", "name": "CREATE" },
                    { "Value": "DELETE", "name": "DELETE" }
                ]
            }
        }
        ]
    },
    {
        xtype: 'container',
        layout: 'hbox',
        defaultType: 'textfield',
        margin: '10 0 10 10',
        items: [{
            xtype: 'container',
            layout: 'vbox',
            items: [{
                fieldLabel: 'Extracted Value Name',
                name: 'transformTaskExtractedValueName',
                xtype: 'textfield',
                labelAlign: 'top',
                grow: true,
                width: 390,
                allowBlank: false,
                labelSeparator: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>'
            },
            {
                xtype: 'label',
                html: 'Provide the name of the extracted data field that will replace the original data in the request.',
                margin: '0 0 0 10',
                width: 390,
                style: {
                    'font-style': 'italic',
                    'font-size': '13',
                    'font-family': 'Arial,Helvetica,sans-serif'
                }
            }]
        }, {
            xtype: 'textfield',
            labelAlign: 'top',
            fieldLabel: 'Validation Expression',
            name: 'transformTaskValidationExpression',
            width: 390,
        }]
    }]

});

Ext.define('OrderFalloutTool.view.form.cognitoformsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.form-cognitoforms',
    data: {
        name: 'ExjsJsDemoApp'
    }
});