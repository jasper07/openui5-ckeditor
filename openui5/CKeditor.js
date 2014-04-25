(function() {
    'use strict';
    /*global  sap, jQuery, openui5, CKEDITOR, window */
    jQuery.sap.declare('openui5.CKeditor');

    // var sPath = 'thirdparty.ckeditor.';
    // jQuery.sap.require(sPath + 'ckeditor');
    // jQuery.includeStyleSheet(jQuery.sap.getModulePath(sPath, '/') + 'content.css');

    var sCDNLink = '//cdnjs.cloudflare.com/ajax/libs/ckeditor/4.3.2/ckeditor.js';
    jQuery.sap.includeScript(sCDNLink);

    sap.ui.core.Control.extend('openui5.CKeditor', {
        metadata: {
            properties: {
                'value': {
                    type: 'string',
                    group: 'Data',
                    bindable: 'bindable',
                    defaultValue: ''
                },
                'width': {
                    type: 'sap.ui.core.CSSSize',
                    group: 'Dimension',
                    defaultValue: '100%'
                },
                'height': {
                    type: 'sap.ui.core.CSSSize',
                    group: 'Dimension',
                    defaultValue: '400px'
                },
                'toolbar': {
                    type: 'string',
                    defaultValue: 'Basic'
                },
                'inline': {
                    type: 'boolean',
                    group: 'Misc',
                    defaultValue: false
                },
                'editable': {
                    type: 'boolean',
                    group: 'Misc',
                    defaultValue: true
                },
                'required': {
                    type: 'boolean',
                    group: 'Misc',
                    defaultValue: false
                },
                'uiColor': {
                    type: 'string',
                    defaultValue: '#FAFAFA'
                }
            },
            events: {
                'change': {},
                'ready': {}
            }
        },
        renderer: function(oRm, oControl) {
            oRm.write('<textarea ');
            oRm.writeAttribute('id', oControl.getId() + '-textarea');
            oRm.write('>');
            oRm.write(oControl.getValue());
            oRm.write('</textarea>');
        }
    });

    /* Basic toolbar */
    openui5.CKeditor.prototype.toolBarBasic = [
        ['Bold', 'Italic', '-', 'NumberedList', 'BulletedList', '-', 'Link', 'Unlink', '-']
    ];

    /* Standard toolbar */
    openui5.CKeditor.prototype.toolBarFull = [{
            name: 'basicstyles',
            items: ['Bold', 'Italic', 'Strike', 'Underline']
        }, {
            name: 'paragraph',
            items: ['BulletedList', 'NumberedList', 'Blockquote']
        }, {
            name: 'editing',
            items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock']
        }, {
            name: 'links',
            items: ['Link', 'Unlink', 'Anchor']
        }, {
            name: 'tools',
            items: ['SpellChecker', 'Maximize']
        },
        '/', {
            name: 'styles',
            items: ['Format', 'FontSize', 'TextColor', 'PasteText', 'PasteFromWord', 'RemoveFormat']
        }, {
            name: 'insert',
            items: ['Image', 'SpecialChar']
        }, {
            name: 'forms',
            items: ['Outdent', 'Indent']
        }, {
            name: 'clipboard',
            items: ['Undo', 'Redo']
        }, {
            name: 'document',
            items: ['PageBreak', 'Source']
        }
    ];

    openui5.CKeditor.prototype.init = function() {
        this.textAreaId = this.getId() + '-textarea';
    };

    openui5.CKeditor.prototype.setValue = function(sValue) {
        this.setProperty('value', sValue, true);
        if (this.editor && sValue !== this.editor.getData()) {
            this.editor.setData(sValue);

        }
    };

    openui5.CKeditor.prototype.getText = function() {
        return this.editor.document.getBody().getText();
    };

    openui5.CKeditor.prototype.setInline = function(bInline) {
        this.setProperty('inline', bInline, true);
    };

    openui5.CKeditor.prototype.setEditable = function(bEditable) {
        this.setProperty('inline', bEditable, true);
        if (this.editor) {
            this.editor.setReadOnly(!bEditable);
        }

    };

    openui5.CKeditor.prototype.onAfterRendering = function() {
        if (!this._bEditorCreated) {
            // first rendering: instantiate the editor
            this.afterFirstRender();
        } else {
            // subsequent re-rendering: 
            this.editor = CKEDITOR.instances[this.textAreaId];
            var value;
            if (this.editor && (value = this.getValue())) {
                this.editor.setData(value);
            }
        }

    };

    openui5.CKeditor.prototype._getOptions = function() {
        var options = {};
        options.toolbar = (this.getToolbar() === 'Basic') ? this.toolBarBasic : this.toolBarFull;
        options.disableNativeSpellChecker = false;
        options.uiColor = this.getUiColor();
        options.height = this.getHeight();
        options.width = this.getWidth();
        options.toolbarStartupExpanded = true;
        options.disableNativeSpellChecker = false;
        options.removePlugins = 'scayt,contextmenu,tabletools,liststyle';
        options.browserContextMenuOnCtrl = true;
        return options;
    };

    openui5.CKeditor.prototype.afterFirstRender = function() {
        // wait until the script is ready
        if (!window.CKEDITOR || CKEDITOR.status !== 'loaded') {
            jQuery.sap.delayedCall(10, this, 'afterFirstRender'); // '10' to avoid busy waiting
            return;
        }

        CKEDITOR.disableAutoInline = true;
        if (this.getInline()) {
            this.editor = CKEDITOR.inline(this.textAreaId, this.basic);
        } else {
            this.editor = CKEDITOR.replace(this.textAreaId, this._getOptions());
        }

        this.editor.on('change', jQuery.proxy(this.onEditorChange, this));
        this.editor.on('mode', jQuery.proxy(this.onModeChange, this));
        this.editor.on('instanceReady', jQuery.proxy(this.onInstanceReady, this));
        this.editor.on('configLoaded', jQuery.proxy(this.onConfigLoaded, this))
    };

    openui5.CKeditor.prototype.onEditorChange = function() {
        //on editor change update control value
        var oldVal = this.getValue(),
            newVal = this.editor.getData();

        if ((oldVal != newVal) && !this.bExiting) {
            this.setProperty('value', newVal, true); // suppress rerendering
            this.fireChange({
                oldValue: oldVal,
                newValue: newVal
            });
        }

    };

    openui5.CKeditor.prototype.onConfigLoaded = function() {
        console.log('configloaded - ' + this.editor.id);
    };

    openui5.CKeditor.prototype.onModeChange = function() {
        // update value after source has changed
        if (this.evtSource === true && this.editor.getCommand('source').state === CKEDITOR.TRISTATE_OFF) {
            this.onEditorChange();
        }

        if (this.editor.mode === 'source') {
            this.evtSource = true;
        } else {
            this.evtSource = false;
        }
    };

    openui5.CKeditor.prototype.onInstanceReady = function() {
        // overwrite gradient with solid background
        jQuery.sap.byId(this.editor.id + '_top').css('background', this.editor.getUiColor());
        jQuery.sap.byId(this.editor.id + '_bottom').css('background', this.editor.getUiColor());
    };

    openui5.CKeditor.prototype.exit = function() {
        this.editor.destroy();
    };

})();