const _ = require( 'lodash' );
const bunyan = require( 'bunyan' );

module.exports = bunyan.createLogger( {
	name: 'launch-darkly-feature-builder',
	level: process.env.LOG_LEVEL || 'info',
	serializers: {
		err: function( err ) {

			const serialized = bunyan.stdSerializers.err( err );
			if( serialized === err ) {
				return serialized;
			}

			const full = _.defaults( serialized, err );
			return full;
		}
	}
} );
