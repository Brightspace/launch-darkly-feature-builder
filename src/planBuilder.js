const _ = require( 'lodash' );
const featureComparer = require( './featureComparer.js' );

function buildCreatePlan( target ) {

	return {
		action: 'create',
		target
	};
}

function doesPatchPath( patch, path ) {

	const index = _.findIndex( patch, op => {
		const startsWith = _.startsWith( op.path, path );
		return startsWith;
	} );

	return index >= 0;
}

function validatePatch( key, patch ) {

	const patchesEnvironments = doesPatchPath( patch, '/environments/' );
	const patchesVariations = doesPatchPath( patch,'/variations/' );

	if( patchesEnvironments && patchesVariations ) {

		const msg = `Unable to generate valid patch for ${ key }: Cannot simultaneously update environments and variations`;
		throw new Error( msg );
	}
}

function buildUpdatePlan( key, current, target ) {

	const diff = featureComparer( current, target );
	if( diff.equal ) {

		return {
			action: 'none',
			current,
			target
		};
	}

	validatePatch( key, diff.patch );

	return {
		action: 'update',
		current,
		target,
		patch: diff.patch
	};
}

function buildFeaturePlan( key, current, target ) {

	if( current ) {
		return buildUpdatePlan( key, current, target );
	}

	return buildCreatePlan( target );
}

module.exports = function( currentFeatures, targetFeatures ) {

	const plan = _.mapValues( targetFeatures, ( target, key ) => {

		const current = currentFeatures[ key ];
		const featurePlan = buildFeaturePlan( key, current, target );
		return featurePlan;
	} );

	return plan;
};
