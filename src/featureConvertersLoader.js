const _ = require( 'lodash' );
const Promise = require( 'bluebird' );
const fsUtil = Promise.promisifyAll( require( 'fs' ) );
const log = require( './log.js' );
const pathUtil = require( 'path' );
const FeatureConvertersCatalog = require( './FeatureConvertersCatalog.js' );

const pluginSuffix = '-launch-darkly-feature-converter-plugin';

async function isDirectoryAsync( path ) {

	const stats = await fsUtil.statAsync( path );
	return stats.isDirectory();
}

async function getPluginPathsAsync( path ) {

	const names = await fsUtil.readdirAsync( path );

	const matches = names
		.filter( name => name.endsWith( pluginSuffix ) )
		.map( name => pathUtil.join( path, name ) );

	const pluginPaths = await Promise.filter(
		matches,
		isDirectoryAsync,
		{ concurrency: 1 }
	);

	return pluginPaths;
}

function loadPlugins( pluginPaths ) {

	return _.map( pluginPaths, pluginPath => {

		log.info(
			{ plugin: pathUtil.basename( pluginPath ) },
			'Loading converter plugin'
		);

		const loadConverters = require( pluginPath );

		return {
			path: pluginPath,
			loadConvertersAsync: Promise.promisify( loadConverters )
		};
	} );
}

async function loadPluginConvertersAsync( plugin, options ) {

	const converters = await plugin.loadConvertersAsync( options );

	if( !_.isArray( converters ) ) {
		const errMsg = `Converter plugin did not return array of converters: ${plugin.path}`;
		throw new Error( errMsg );
	}

	return converters;
}

module.exports = async function loadFeatureConvertersAsync( path, options ) {

	const pluginPaths = await getPluginPathsAsync( path );
	const plugins = loadPlugins( pluginPaths );

	const convertersSets = await Promise.map(
		plugins,
		plugin => loadPluginConvertersAsync( plugin, options )
	);

	const converters = _.flatten( convertersSets );

	const catalog = new FeatureConvertersCatalog( converters );
	return catalog;
};
