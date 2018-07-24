const _ = require( 'lodash' );
const loadFeatureConvertersAsync = require( './featureConvertersLoader.js' );
const featureFileLoader = require( './featureFileLoader.js' );
const log = require( './log.js' );
const Promise = require( 'bluebird' );

module.exports = async function loadFeaturesAsync( convertersDir, definitionsDir ) {

	const converterOptions = Object.freeze( {} );
	const converters = await loadFeatureConvertersAsync( convertersDir, converterOptions );
	const featureFiles = await featureFileLoader( definitionsDir );

	return Promise
		.map(
			_.toPairs( featureFiles ),
			async pair => {

				const [ key, featureFile ] = pair;

				const convertOptions = Object.freeze( {
					path: featureFile.path
				} );

				try {
					const feature = await converters.convertAsync(
						featureFile.definition,
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
