const _ = require( 'lodash' );
const loadFeaturesAsync = require( './featuresLoader.js' );
const log = require( './log.js' );
const pathUtil = require( 'path' );

module.exports = async function( args ) {

	const featuresDir = pathUtil.resolve( args.features );
	const convertersDir = pathUtil.resolve( args.converters );

	const features = await loadFeaturesAsync( convertersDir, featuresDir );
	const featureCount = _.size( features );

	log.info( `Loaded ${featureCount} features` );

	return 0;
};
