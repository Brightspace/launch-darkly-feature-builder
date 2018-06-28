const _ = require( 'lodash' );
const log = require( './log.js' );
const pathUtil = require( 'path' );
const planLoader = require( './planLoader.js' );

function showPlan( plan ) {

	_.forIn( plan.features, ( featurePlan, key ) => {

		const action = featurePlan.action;
		if( action === 'create' ) {

			log.info(
				{
					key,
					feature: featurePlan.target
				},
				'Creating feature'
			);

		} else if( action === 'update' ) {

			log.info(
				{
					key,
					patch: featurePlan.patch
				},
				'Updating feature'
			);
		}
	} );
}

module.exports = async function( args ) {

	const planPath = pathUtil.resolve( args.plan );

	const plan = await planLoader( planPath );
	showPlan( plan );

	return 0;
};
