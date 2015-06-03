'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Certificate = mongoose.model('Certificate'),
	_ = require('lodash');

/**
 * Create a Certificate
 */
exports.create = function(req, res) {
	var certificate = new Certificate(req.body);
	certificate.user = req.user;

	certificate.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(certificate);
		}
	});
};

/**
 * Show the current Certificate
 */
exports.read = function(req, res) {
	res.jsonp(req.certificate);
};

/**
 * Update a Certificate
 */
exports.update = function(req, res) {
	var certificate = req.certificate ;

	certificate = _.extend(certificate , req.body);

	certificate.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(certificate);
		}
	});
};

/**
 * Delete an Certificate
 */
exports.delete = function(req, res) {
	var certificate = req.certificate ;

	certificate.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(certificate);
		}
	});
};

/**
 * List of Certificates
 */
exports.list = function(req, res) { 
	Certificate.find().sort('-created').populate('user', 'displayName').exec(function(err, certificates) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(certificates);
		}
	});
};

/**
 * Certificate middleware
 */
exports.certificateByID = function(req, res, next, id) { 
	Certificate.findById(id).populate('user', 'displayName').exec(function(err, certificate) {
		if (err) return next(err);
		if (! certificate) return next(new Error('Failed to load Certificate ' + id));
		req.certificate = certificate ;
		next();
	});
};

/**
 * Certificate authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.certificate.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
