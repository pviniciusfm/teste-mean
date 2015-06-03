'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Certificate = mongoose.model('Certificate'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, certificate;

/**
 * Certificate routes tests
 */
describe('Certificate CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Certificate
		user.save(function() {
			certificate = {
				name: 'Certificate Name'
			};

			done();
		});
	});

	it('should be able to save Certificate instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Certificate
				agent.post('/certificates')
					.send(certificate)
					.expect(200)
					.end(function(certificateSaveErr, certificateSaveRes) {
						// Handle Certificate save error
						if (certificateSaveErr) done(certificateSaveErr);

						// Get a list of Certificates
						agent.get('/certificates')
							.end(function(certificatesGetErr, certificatesGetRes) {
								// Handle Certificate save error
								if (certificatesGetErr) done(certificatesGetErr);

								// Get Certificates list
								var certificates = certificatesGetRes.body;

								// Set assertions
								(certificates[0].user._id).should.equal(userId);
								(certificates[0].name).should.match('Certificate Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Certificate instance if not logged in', function(done) {
		agent.post('/certificates')
			.send(certificate)
			.expect(401)
			.end(function(certificateSaveErr, certificateSaveRes) {
				// Call the assertion callback
				done(certificateSaveErr);
			});
	});

	it('should not be able to save Certificate instance if no name is provided', function(done) {
		// Invalidate name field
		certificate.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Certificate
				agent.post('/certificates')
					.send(certificate)
					.expect(400)
					.end(function(certificateSaveErr, certificateSaveRes) {
						// Set message assertion
						(certificateSaveRes.body.message).should.match('Please fill Certificate name');
						
						// Handle Certificate save error
						done(certificateSaveErr);
					});
			});
	});

	it('should be able to update Certificate instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Certificate
				agent.post('/certificates')
					.send(certificate)
					.expect(200)
					.end(function(certificateSaveErr, certificateSaveRes) {
						// Handle Certificate save error
						if (certificateSaveErr) done(certificateSaveErr);

						// Update Certificate name
						certificate.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Certificate
						agent.put('/certificates/' + certificateSaveRes.body._id)
							.send(certificate)
							.expect(200)
							.end(function(certificateUpdateErr, certificateUpdateRes) {
								// Handle Certificate update error
								if (certificateUpdateErr) done(certificateUpdateErr);

								// Set assertions
								(certificateUpdateRes.body._id).should.equal(certificateSaveRes.body._id);
								(certificateUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Certificates if not signed in', function(done) {
		// Create new Certificate model instance
		var certificateObj = new Certificate(certificate);

		// Save the Certificate
		certificateObj.save(function() {
			// Request Certificates
			request(app).get('/certificates')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Certificate if not signed in', function(done) {
		// Create new Certificate model instance
		var certificateObj = new Certificate(certificate);

		// Save the Certificate
		certificateObj.save(function() {
			request(app).get('/certificates/' + certificateObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', certificate.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Certificate instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Certificate
				agent.post('/certificates')
					.send(certificate)
					.expect(200)
					.end(function(certificateSaveErr, certificateSaveRes) {
						// Handle Certificate save error
						if (certificateSaveErr) done(certificateSaveErr);

						// Delete existing Certificate
						agent.delete('/certificates/' + certificateSaveRes.body._id)
							.send(certificate)
							.expect(200)
							.end(function(certificateDeleteErr, certificateDeleteRes) {
								// Handle Certificate error error
								if (certificateDeleteErr) done(certificateDeleteErr);

								// Set assertions
								(certificateDeleteRes.body._id).should.equal(certificateSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Certificate instance if not signed in', function(done) {
		// Set Certificate user 
		certificate.user = user;

		// Create new Certificate model instance
		var certificateObj = new Certificate(certificate);

		// Save the Certificate
		certificateObj.save(function() {
			// Try deleting Certificate
			request(app).delete('/certificates/' + certificateObj._id)
			.expect(401)
			.end(function(certificateDeleteErr, certificateDeleteRes) {
				// Set message assertion
				(certificateDeleteRes.body.message).should.match('User is not logged in');

				// Handle Certificate error error
				done(certificateDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Certificate.remove().exec();
		done();
	});
});