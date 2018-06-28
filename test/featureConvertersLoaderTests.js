const assert = require( './util/assert.js' );
const loadFeatureConvertersAsync = require( '../src/featureConvertersLoader.js' );

describe( 'loadFeatureConvertersAsync', function() {

	it( 'should only load correctly named plugins', async function() {

		const path = `${ __dirname }/converters/`;
		const options = {};
		const catalog = await loadFeatureConvertersAsync( path, options ); 

		assert.deepEqual( catalog.schemas, [
			'http://test.org/simple-boolean',
			'http://test.org/simple-enum'
		] );
	} );
} );