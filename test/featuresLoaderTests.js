const assert = require( './util/assert.js' );
const loadFeaturesAsync = require( '../src/featuresLoader.js' );
const pathUtil = require( 'path' );

describe( 'featuresLoader', function() {
	describe( 'loadFeaturesAsync', function() {

		it( 'should load features', async function() {

			const convertersDir = pathUtil.join(
				__dirname,
				'converters'
			);

			const featuresDir = pathUtil.join(
				__dirname,
				'projects/example/mammals'
			);

			const features = await loadFeaturesAsync( convertersDir, featuresDir );
			assert.deepEqual( features, {
				cats: {
					kind: 'boolean',
					name: 'Cats',
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
				},
				dogs: {
					kind: 'boolean',
					name: 'Dogs',
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
				}
			} );
		} );
	} );
} );
