/**
* The main application class. An instance of this class is created by app.js when it
* calls Ext.application(). This is the ideal place to handle application launch and
* initialization details.
*/
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
    extend: 'Ext.panel.Panel',
    xtype: 'app-main',

    requires: [
    'Ext.plugin.Viewport',
    'Ext.window.MessageBox'
    ], 
    scrollable: true,
    height: '80%',
    style: { borderColor: '#000000', borderStyle: 'solid', borderWidth: '1px' },

    layout: {
        type: 'vbox',
        align: 'center'
    },
	margin:'10 0 20 0',
    items: [{
        items: [{
            xtype: 'cognitoforms'
        }]
    }]
});

Ext.define('OrderFalloutTool.view.form.cognitoformsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.form-cognitoforms',
    init: function () {
        var me = this;
        me.ruleNum = 1, me.taskRule = 1, me.messages = 1, me.allowTotalCount = 5;

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
        if (totalForm === me.allowTotalCount) {
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
        if (totalForm === me.allowTotalCount) {
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
        if (totalForm === me.allowTotalCount) {
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
        margin: '5 5 5 100'
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
                labelAlign: 'top',
                margin: '0 15 10 0'
            },
            items: [
            {
                xtype: 'textfield',
                itemId: 'orderFallName',
                fieldLabel: 'Name',
                allowBlank: false,
                width: 390
            }, {
                xtype: 'textarea',
                itemId: 'orderFallDescription',
                fieldLabel: 'Description',
                allowBlank: false,
                width: 390
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
    }]

});


Ext.define('OrderFalloutTool.view.form.extractionTaskform', {
    extend: 'Ext.form.Panel',
    xtype: 'extractionTaskform',
    bodyPadding: 5,
    width: 820,
    title: 'Rule 1',
    closable: true,    ruleNum: 1,
    
    reference: 'extractionTaskform1',
    listeners: {
        close: 'changeextractionTaskformTitle'
    },
    items: [{
        xtype: 'container',
        layout: 'hbox',
        defaultType: 'textfield',
        defaults: {
            labelAlign: 'top',
            margin: '0 15 0 0'
        },
        items: [{
            fieldLabel: 'Name',
            name: 'extractionTaskName',
            width: 390,
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
            valueField: 'name',
            queryMode: 'local',
            width: 390,
            store: {
                data: [
                { "Value": "WSIL", "name": "WSIL" },
                { "Value": "OM", "name": "OM" }
                ]
            }
        }, {
            fieldLabel: 'Soap Action',
            allowBlank: false,
            width: 390,
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
            fieldLabel: 'Extracted Value Name',
            xtype: 'textareafield',
            width: 800,
            grow: true
        },
        {
            xtype: 'label',
            html: 'Provide the name of the extracted data field that will replace the original <br>data in the request.',
            margin: '0 0 0 10',
            style: {
                'font-style': 'italic',
                'font-size': '13',
                'font-family': 'Arial,Helvetica,sans-serif'
            }
        },
        {
            fieldLabel: 'Order Priority',
            allowBlank: false,
            width: 390,
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
            allowBlank: false,
            width: 390,
        },
        {
            fieldLabel: 'Type',
            xtype: 'combo',
            displayField: 'Value',
            valueField: 'name',
            queryMode: 'local',
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
            allowBlank: false,
            width: 390,
        }, {
            fieldLabel: 'Validation Expression',
            allowBlank: false,
            width: 390,
        }
        ]
    },
    {
        xtype: 'container',
        margin: '50 0 0 0',
        layout: 'vbox',
        defaultType: 'textfield',
        margin: '10 0 10 10',
        defaults: {
            labelAlign: 'top',
            margin: '0 15 0 0'

        },
        items: [{
            fieldLabel: 'Extracted Value Name',
            xtype: 'textareafield',
            width: 440,
            grow: true
        },
        {
            xtype: 'label',
            html: 'Provide the name of the extracted data field that will replace the original <br>data in the request.',
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

Ext.define('OrderFalloutTool.view.form.cognitoformsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.form-cognitoforms',
    data: {
        name: 'ExjsJsDemoApp'
    }
});