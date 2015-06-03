'use strict';

//Certificates service used to communicate Certificates REST endpoints
angular.module('certificates').factory('Certificates', ['$resource',
	function($resource) {
		return $resource('certificates/:certificateId', { certificateId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);