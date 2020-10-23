const sortObject = require( 'deep-sort-object' );
const featureNormalizer = require( './featureNormalizer.js' );
const loadFeaturesAsync = require( './featuresLoader.js' );
const log = require( './log.js' );
const pathUtil = require( 'path' );
const fsPromises = require( 'fs' ).promises;

function normalizeFeatures( features ) {

	const sortedKeys = Object.keys( features ).sort();

	const result = {};

	sortedKeys.forEach( key => {

		const feature = featureNormalizer( features[ key ] );
		const sortedFeature = sortObject( feature );
		result[ key ] = sortedFeature;
	} );

	return result;
}

module.exports = async function( args ) {

	const featuresDir = pathUtil.resolve( args.features );
	const convertersDir = pathUtil.resolve( args.converters );
	const outFile = pathUtil.resolve( args.out );

	const features = await loadFeaturesAsync( convertersDir, featuresDir );
	const normalizedFeatures = normalizeFeatures( features );

	const exportData = {
		flags: normalizedFeatures,
		segments: {}
	};

	const exportJson = JSON.stringify( exportData, null, '\t' );

	log.debug( { path: outFile }, 'Writing export file' );
	await fsPromises.writeFile( outFile, exportJson, { encoding: 'utf8' } );

	return 0;
};
