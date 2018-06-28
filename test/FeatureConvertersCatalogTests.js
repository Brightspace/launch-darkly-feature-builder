const _ = require( 'lodash' );
const assert = require( './util/assert.js' );
const FeatureConvertersCatalog = require( '../src/FeatureConvertersCatalog.js' );
const booleanConverter = require( './converters/simple-boolean-launch-darkly-feature-converter-plugin/' );
const enumConverter = require( './converters/simple-enum-launch-darkly-feature-converter-plugin/' );
const Promise = require( 'bluebird' );

describe( 'FeatureConvertersCatalog', function() {

	let catalog;

	this.beforeAll( async function() {

		const converterSets = await Promise.map(
			[ booleanConverter, enumConverter ],
			converter => {
				const asyncConverter = Promise.promisify( converter );
				return asyncConverter( {} );	
			}
		);

		catalog = new FeatureConvertersCatalog( 
			_.flatten( converterSets )
		);
	} );

	describe( 'schemas', function() {
		it( 'should return all schemas', function() {
			assert.deepEqual( catalog.schemas, [
				'http://test.org/simple-boolean',
				'http://test.org/simple-enum'
			] );
		} );
	} );

	describe( 'convertAsync', function() {

		it( 'should convert when known schema (boolean)', async function() {

			const definition = {
				$schema: 'http://test.org/simple-boolean',
				name: 'Bool Test'
			};

			const result = await catalog.convertAsync( definition, {} );

			assert.deepEqual( result, {
				name : 'Bool Test',
				kind: 'boolean',
				variations: [
					{
						value: true
					},
					{
						value: false
					}
				],
				environments: {
					production: {},
					test: {}
				}
			} );
		} );

		it( 'should convert when known schema (enum)', async function() {

			const definition = {
				$schema: 'http://test.org/simple-enum',
				name: 'Enum Test',
				variations: [
					{
						name: 'Small',
						value: 0,
						junk: 5
					},
					{
						name: 'Mediam',
						value: 1
					},
					{
						name: 'Large',
						value: 2
					}
				]
			};

			const result = await catalog.convertAsync( definition, {} );

			assert.deepEqual( result, {
				name : 'Enum Test',
				kind: 'multivariate',
				variations: [
					{
						name: 'Small',
						value: 0
					},
					{
						name: 'Mediam',
						value: 1
					},
					{
						name: 'Large',
						value: 2
					}
				],
				environments: {
					production: {},
					test: {}
				}
			} );
		} );

		it( 'should throw when feature does not define schema', function() {

			const definition = {
				name: 'Schemaless'
			};

			return assert.isRejected(
				catalog.convertAsync( definition, {} ),
				/Feature definition does not define \$schema/
			);
		} );
		
		it( 'should throw when unknown schema', function() {

			const definition = {
				'$schema': 'http://test.org/wacky',
				name: 'Unknown Schema'
			};

			return assert.isRejected(
				catalog.convertAsync( definition, {} ),
				/Unknown feature definition schema 'http:\/\/test.org\/wacky'/
			);
		} );
	} );
} );