const assert = require( './util/assert.js' );
const featureFileLoader = require( '../src/featureFileLoader.js' );

describe( 'featureFileLoader', function() {

	it( 'should recurrsively load *.feature.json', async function() {

		const path = `${ __dirname }/projects/example`;
		const features = await featureFileLoader( path ); 

		assert.deepEqual( features, {
			cats: {
				'$schema': 'http://test.org/simple-boolean',
				name: 'Cats'
			},
			dogs: {
				'$schema': 'http://test.org/simple-boolean',
				name: 'Dogs'
			},
			frogs: {
				'$schema': 'http://test.org/simple-boolean',
				name: 'Frogs'
			},
			rocks: {
				'$schema': 'http://test.org/simple-boolean',
				name: 'Rocks'
			}
		} );
	} );

	it( 'should load features with valid chacters in filename', async function() {

		const path = `${ __dirname }/projects/validCharacters`;
		const features = await featureFileLoader( path ); 

		assert.deepEqual( features, {
			'dash-char': {
				'$schema': 'http://test.org/simple-boolean',
				name: 'Dashes'
			},
			'period.char': {
				'$schema': 'http://test.org/simple-boolean',
				name: 'Periods'
			},
			underscore_char: {
				'$schema': 'http://test.org/simple-boolean',
				name: 'Underscores'
			},
			UPPER: {
				'$schema': 'http://test.org/simple-boolean',
				name: 'Uppers'
			}
		} );
	} );

	it( 'should throw if invalid characters in filename', async function() {

		const path = `${ __dirname }/projects/invalidCharacters`;

		return assert.isRejected(
			featureFileLoader( path ),
			/Invalid feature key: a\+b/
		);
	} );

	it( 'should throw if keys duplicated', async function() {

		const path = `${ __dirname }/projects/duplicateKeys`;

		return assert.isRejected(
			featureFileLoader( path ),
			/Duplicated feature key: cats/
		);
	} );

	it( 'should throw if feature is missing schema', async function() {

		const path = `${ __dirname }/projects/missingSchema`;

		return assert.isRejected(
			featureFileLoader( path ),
			/Feature definition file does not define schema: .+ghost.feature.json/
		);
	} );
} );