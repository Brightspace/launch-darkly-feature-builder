const _ = require( 'lodash' );
const FeaturePlanApplier = require( './FeaturePlanApplier.js' );
const pathUtil = require( 'path' );
const planLoader = require( './planLoader.js' );
const Promise = require( 'bluebird' );

async function applyPlanAsync( apiKey, plan ) {

	const applier = new FeaturePlanApplier( apiKey, plan.project );

	return Promise.map(
		_.toPairs( plan.features ),
		pair => {
			const [ key, featurePlan ] = pair;
			return applier.applyPlanAsync( key, featurePlan );
		},
		{ concurrency: 1 }
	);
}

module.exports = async function( args ) {

	const apiKey = args[ 'api-key' ];
	const planPath = pathUtil.resolve( args.plan );

	const plan = await planLoader( planPath );
	await applyPlanAsync( apiKey, plan );

	return 0;
};
