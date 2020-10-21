const loadFeaturesAsync = require( './featuresLoader.js' );
const log = require( './log.js' );
const pathUtil = require( 'path' );
const fsPromises = require( 'fs' ).promises;

function sortFeatures( features ) {

	const sortedKeys = Object.keys( features ).sort();

	const result = {};

	sortedKeys.forEach( key => {
		result[ key ] = features[ key ];
	} );

	return result;
}

module.exports = async function( args ) {

	const featuresDir = pathUtil.resolve( args.features );
	const convertersDir = pathUtil.resolve( args.converters );
	const outFile = pathUtil.resolve( args.out );

	const features = await loadFeaturesAsync( convertersDir, featuresDir );
	const sortedFeatures = sortFeatures( features );
	const featuresJson = JSON.stringify( sortedFeatures, null, '\t' );

	log.debug( { path: outFile }, 'Writing export file' );
	await fsPromises.writeFile( outFile, featuresJson, { encoding: 'utf8' } );

	return 0;
};
