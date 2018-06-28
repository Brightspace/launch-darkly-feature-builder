const _ = require( 'lodash' );
const loadFeatureConvertersAsync = require( './featureConvertersLoader.js' );
const featureFileLoader = require( './featureFileLoader.js' );
const log = require( './log.js' );
const Promise = require( 'bluebird' );

module.exports = async function loadFeaturesAsync( convertersDir, definitionsDir ) {

	const converterOptions = Object.freeze( {} );
	const converters = await loadFeatureConvertersAsync( convertersDir, converterOptions );
	const definitions = await featureFileLoader( definitionsDir );
	const convertOptions = Object.freeze( {} );

	return Promise
		.map(
			_.toPairs( definitions ),
			async pair => {

				const [ key, definition ] = pair;

				try {
					const feature = await converters.convertAsync(
						definition,
						convertOptions
					);

					return [ key, feature ];

				} catch( err ) {
					log.error( { err, key }, 'Failed to convert feature definition' );
					throw new Error( `Failed to convert feature definition: ${key}` );
				}
			},
			{ concurrency: 1 }
		)
		.then( pairs => {
			return _.fromPairs( pairs );
		} );
};
