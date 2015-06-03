'use strict';

// Configuring the Articles module
angular.module('certificates').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('Certificados', 'Certificates', 'certificates', 'dropdown', '/certificates(/create)?');
		Menus.addSubMenuItem('Certificados', 'certificates', 'List Certificates', 'certificates');
		Menus.addSubMenuItem('Certificados', 'certificates', 'New Certificate', 'certificates/create');
	}
]);