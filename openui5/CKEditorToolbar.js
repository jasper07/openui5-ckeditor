sap.ui.define(['jquery.sap.global'], function(jQuery) {
	"use strict";
	
	var CKEditorToolbar = {
		Basic: [
			['Bold', 'Italic', '-', 'NumberedList', 'BulletedList', '-', 'Link', 'Unlink', '-']
		],
		Full: [
			{
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
		] 
	};
	
	return CKEditorToolbar;
}, true);