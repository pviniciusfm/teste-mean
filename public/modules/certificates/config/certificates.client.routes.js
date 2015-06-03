'use strict';

//Setting up route
angular.module('certificates').config(['$stateProvider',
	function($stateProvider) {
		// Certificates state routing
		$stateProvider.
		state('listCertificates', {
			url: '/certificates',
			templateUrl: 'modules/certificates/views/list-certificates.client.view.html'
		}).
		state('createCertificate', {
			url: '/certificates/create',
			templateUrl: 'modules/certificates/views/create-certificate.client.view.html'
		}).
		state('viewCertificate', {
			url: '/certificates/:certificateId',
			templateUrl: 'modules/certificates/views/view-certificate.client.view.html'
		}).
		state('editCertificate', {
			url: '/certificates/:certificateId/edit',
			templateUrl: 'modules/certificates/views/edit-certificate.client.view.html'
		});
	}
]);