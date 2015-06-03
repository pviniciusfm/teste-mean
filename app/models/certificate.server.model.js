'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Certificate Schema
 */
var CertificateSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Certificate name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Certificate', CertificateSchema);