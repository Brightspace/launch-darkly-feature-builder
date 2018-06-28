const _ = require( 'lodash' );
const Promise = require( 'bluebird' );
const fsUtil = Promise.promisifyAll( require( 'fs' ) );
const log = require( './log.js' );
const pathUtil = require( 'path' );

async function loadFeatureAsync( path ) {

	const json = await fsUtil.readFileAsync( path, { encoding: 'utf8' } );

	const feature = JSON.parse( json );
	if( !feature.$schema ) {
		throw new Error( `Feature definition file does not define schema: ${path}` );
	}

	return feature;
}

async function enumerateDirectoryAsync( path, features, relativePath = '' ) {

	const files = await fsUtil.readdirAsync( path );

	return Promise.each( files, async file => {
		const filePath = pathUtil.join( path, file );

		const fileStats = await fsUtil.statAsync( filePath );
		if( fileStats.isDirectory() ) {

			const dirRealtivePath = `${ relativePath }${ file }/`;
			return enumerateDirectoryAsync( filePath, features, dirRealtivePath );
		}

		const match = file.match( /^(.+)\.feature\.json$/ );
		if( match ) {

			const featureKey = match[ 1 ];
			if( !featureKey.match( /^[._\-a-z0-9]+$/i ) ) {
				throw new Error( `Invalid feature key: ${featureKey}` );
			}

			if( _.has( features, featureKey ) ) {
				throw new Error( `Duplicated feature key: ${featureKey}` );
			}

			log.info(
				{ path: pathUtil.join( relativePath, file ) },
				'Loading feature definition'
			);

			features[ featureKey ] = await loadFeatureAsync( filePath );
		}
	} );
}

module.exports = async function loadFeaturesAsync( path ) {

	const features = {};
	await enumerateDirectoryAsync( path, features );
	return features;
};
