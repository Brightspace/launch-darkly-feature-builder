const _ = require( 'lodash' );
const Promise = require( 'bluebird' );

function mapConvertersBySchema( converters ) {

	const map = new Map();

	_.forEach( converters, c => {
		_.forEach( c.schemas, schema => {

			if( map.has( schema ) ) {
				throw new Error( `Duplicate feature definition schema: ${ schema }` );
			}

			map.set( schema, c );
		} );
	} );

	return map;
}

class FeatureConvertersCatalog {

	constructor( converters ) {
		this._converters = mapConvertersBySchema( converters );
	}

	convertAsync( definition, options ) {

		return new Promise( ( resolve, reject ) => {

			const schema = definition.$schema;
			if( !schema ) {
				throw new Error( 'Feature definition does not define $schema' );
			}

			const converter = this._converters.get( schema );
			if( !converter ) {
				throw new Error( `Unknown feature definition schema '${schema}'` );
			}

			return converter.convert( definition, options, ( err, feature ) => {

				if( err ) {
					return reject( err );
				}

				return resolve( feature );
			} );
		} );
	}

	get schemas() {
		const schemas = Array.from( this._converters.keys() );
		return schemas;
	}
}

module.exports = FeatureConvertersCatalog;
