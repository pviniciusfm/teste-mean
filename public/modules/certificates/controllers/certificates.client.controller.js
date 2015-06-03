'use strict';

// Certificates controller
angular.module('certificates').controller('CertificatesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Certificates',
	function($scope, $stateParams, $location, Authentication, Certificates) {
		$scope.authentication = Authentication;

		// Create new Certificate
		$scope.create = function() {
			// Create new Certificate object
			var certificate = new Certificates ({
				name: this.name
			});

			// Redirect after save
			certificate.$save(function(response) {
				$location.path('certificates/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Certificate
		$scope.remove = function(certificate) {
			if ( certificate ) { 
				certificate.$remove();

				for (var i in $scope.certificates) {
					if ($scope.certificates [i] === certificate) {
						$scope.certificates.splice(i, 1);
					}
				}
			} else {
				$scope.certificate.$remove(function() {
					$location.path('certificates');
				});
			}
		};

		// Update existing Certificate
		$scope.update = function() {
			var certificate = $scope.certificate;

			certificate.$update(function() {
				$location.path('certificates/' + certificate._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Certificates
		$scope.find = function() {
			$scope.certificates = Certificates.query();
		};

		// Find existing Certificate
		$scope.findOne = function() {
			$scope.certificate = Certificates.get({ 
				certificateId: $stateParams.certificateId
			});
		};
	}
]);