const assert = require( './util/assert.js' );
const featureComparer = require( '../src/featureComparer.js' );

describe( 'featureComparer', function() {

	it( 'should return equal when equal', function() {

		const feature1 = { name: 'A' };
		const feature2 = { name: 'A' };

		const result = featureComparer( feature1, feature2 );
		assert.isTrue( result.equal );
		assert.isUndefined( result.patch );
	} );

	it( 'should return equal when equivalent', function() {

		const feature1 = {
			name: 'A'
		};

		const feature2 = {
			name: 'A',
			creationDate: 1475828623665 // should be normalized out
		};

		const result = featureComparer( feature1, feature2 );
		assert.isTrue( result.equal );
		assert.isUndefined( result.patch );
	} );

	it( 'should return not equal when different', function() {

		const feature1 = {
			name: 'A'
		};

		const feature2 = {
			name: 'B',
			creationDate: 1475828623665 // should be normalized out
		};

		const result = featureComparer( feature1, feature2 );
		assert.isFalse( result.equal );
		assert.deepEqual( result.patch, [
			{
				op: 'replace',
				path: '/name',
				value: 'B'
			}
		] );
	} );
} );