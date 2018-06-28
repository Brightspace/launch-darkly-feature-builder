const _ = require( 'lodash' );
const featureNormalizer = require( './featureNormalizer.js' );
const jsonPatchGen = require( 'json-patch-gen' );

module.exports = function( current, target ) {

	const normalCurrent = featureNormalizer( current );
	const normalTarget = featureNormalizer( target );

	const equal = _.isEqual( normalCurrent, normalTarget );
	if( equal ) {
		return { equal: true };
	}

	const patch = jsonPatchGen( normalCurrent, normalTarget );
	return { equal: false, patch };
};
