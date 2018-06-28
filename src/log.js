const bunyan = require( 'bunyan' );

module.exports = bunyan.createLogger( {
	name: 'launch-darkly-feature-builder',
	level: process.env.LOG_LEVEL || 'info'
} );
