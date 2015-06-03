'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var certificates = require('../../app/controllers/certificates.server.controller');

	// Certificates Routes
	app.route('/certificates')
		.get(certificates.list)
		.post(users.requiresLogin, certificates.create);

	app.route('/certificates/:certificateId')
		.get(certificates.read)
		.put(users.requiresLogin, certificates.hasAuthorization, certificates.update)
		.delete(users.requiresLogin, certificates.hasAuthorization, certificates.delete);

	// Finish by binding the Certificate middleware
	app.param('certificateId', certificates.certificateByID);
};
