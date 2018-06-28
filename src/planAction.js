const _ = require( 'lodash' );
const loadFeaturesAsync = require( './featuresLoader.js' );
const LaunchDarklyClient = require( './LaunchDarklyClient.js' );
const log = require( './log.js' );
const pathUtil = require( 'path' );
const planBuilder = require( './planBuilder.js' );
const Promise = require( 'bluebird' );

const fsUtil = Promise.promisifyAll( require( 'fs' ) );

async function getCurrentFeaturesAsync( apiKey, project ) {

	const ldClient = new LaunchDarklyClient( apiKey );
	const featureFlags = await ldClient.getAllFeatureFlagsAsync( project );

	const currentFeatures = _.keyBy( featureFlags.items, 'key' );
	return currentFeatures;
}

function getDetailedPlanExitCode( plan ) {

	const key = _.findKey( plan.features, feature => {
		return feature.action !== 'none';
	} );

	if( _.isUndefined( key ) ) {
		return 0;
	}

	return 2;
}

module.exports = async function( args ) {

	const apiKey = args['api-key'];
	const project = args.project;
	const detailedExitCode = args['detailed-exitcode'];

	const featuresDir = pathUtil.resolve( args.features );
	const convertersDir = pathUtil.resolve( args.converters );
	const outFile = pathUtil.resolve( args.out );

	return Promise
		.join(
			getCurrentFeaturesAsync( apiKey, project ),
			loadFeaturesAsync( convertersDir, featuresDir ),
			( currentFeatures, targetFeatures ) => {

				const features = planBuilder( currentFeatures, targetFeatures );
				return { project, features };
			}
		)
		.then( async plan => {

			const planJson = JSON.stringify( plan, null, '\t' );

			log.debug( { path: outFile }, 'Writing plan file' );
			await fsUtil.writeFileAsync( outFile, planJson, { encoding: 'utf8' } );

			if( detailedExitCode ) {
				return getDetailedPlanExitCode( plan );
			}

			return 0;
		} );
};
