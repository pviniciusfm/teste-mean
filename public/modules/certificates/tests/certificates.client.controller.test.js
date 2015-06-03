'use strict';

(function() {
	// Certificates Controller Spec
	describe('Certificates Controller Tests', function() {
		// Initialize global variables
		var CertificatesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Certificates controller.
			CertificatesController = $controller('CertificatesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Certificate object fetched from XHR', inject(function(Certificates) {
			// Create sample Certificate using the Certificates service
			var sampleCertificate = new Certificates({
				name: 'New Certificate'
			});

			// Create a sample Certificates array that includes the new Certificate
			var sampleCertificates = [sampleCertificate];

			// Set GET response
			$httpBackend.expectGET('certificates').respond(sampleCertificates);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.certificates).toEqualData(sampleCertificates);
		}));

		it('$scope.findOne() should create an array with one Certificate object fetched from XHR using a certificateId URL parameter', inject(function(Certificates) {
			// Define a sample Certificate object
			var sampleCertificate = new Certificates({
				name: 'New Certificate'
			});

			// Set the URL parameter
			$stateParams.certificateId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/certificates\/([0-9a-fA-F]{24})$/).respond(sampleCertificate);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.certificate).toEqualData(sampleCertificate);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Certificates) {
			// Create a sample Certificate object
			var sampleCertificatePostData = new Certificates({
				name: 'New Certificate'
			});

			// Create a sample Certificate response
			var sampleCertificateResponse = new Certificates({
				_id: '525cf20451979dea2c000001',
				name: 'New Certificate'
			});

			// Fixture mock form input values
			scope.name = 'New Certificate';

			// Set POST response
			$httpBackend.expectPOST('certificates', sampleCertificatePostData).respond(sampleCertificateResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Certificate was created
			expect($location.path()).toBe('/certificates/' + sampleCertificateResponse._id);
		}));

		it('$scope.update() should update a valid Certificate', inject(function(Certificates) {
			// Define a sample Certificate put data
			var sampleCertificatePutData = new Certificates({
				_id: '525cf20451979dea2c000001',
				name: 'New Certificate'
			});

			// Mock Certificate in scope
			scope.certificate = sampleCertificatePutData;

			// Set PUT response
			$httpBackend.expectPUT(/certificates\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/certificates/' + sampleCertificatePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid certificateId and remove the Certificate from the scope', inject(function(Certificates) {
			// Create new Certificate object
			var sampleCertificate = new Certificates({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Certificates array and include the Certificate
			scope.certificates = [sampleCertificate];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/certificates\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCertificate);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.certificates.length).toBe(0);
		}));
	});
}());