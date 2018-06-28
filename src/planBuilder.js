const _ = require( 'lodash' );
const featureComparer = require( './featureComparer.js' );

function buildCreatePlan( target ) {

	return {
		action: 'create',
		target
	};
}

function buildUpdatePlan( current, target ) {

	const diff = featureComparer( current, target );
	if( diff.equal ) {

		return {
			action: 'none',
			current,
			target
		};
	}

	return {
		action: 'update',
		current,
		target,
		patch: diff.patch
	};
}

function buildFeaturePlan( current, target ) {

	if( current ) {
		return buildUpdatePlan( current, target );
	}

	return buildCreatePlan( target );
}

module.exports = function( currentFeatures, targetFeatures ) {

	const plan = _.mapValues( targetFeatures, ( target, key ) => {

		const current = currentFeatures[ key ];
		const featurePlan = buildFeaturePlan( current, target );
		return featurePlan;
	} );

	return plan;
};
