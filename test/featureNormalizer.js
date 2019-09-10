const assert = require( './util/assert.js' );
const deepFreeze = require( 'deep-freeze' );
const featureNormalizer = require( '../src/featureNormalizer.js' );

describe( 'featureNormalizer', function() {

	it( 'should strip out metadata fields', function() {

		const booleanFeature = deepFreeze( require( './features/boolean.json' ) );
		const expectedNormalized = deepFreeze( require( './features/boolean.normalized.json' ) );

		const booleanFeatureNormalized = featureNormalizer( booleanFeature );
		assert.deepEqual( booleanFeatureNormalized, expectedNormalized );
	} );

	it( 'should add defaults to root feature', function() {

		const feature =  {};

		const normalized = featureNormalizer( feature );

		assert.deepEqual( normalized, {
			description: '',
			includeInSnippet: false,
			temporary: true,
			tags: [],
			goalIds: [],
			customProperties: {},
			environments: {}
		} );
	} );

	it( 'should add defaults to environments', function() {

		const feature = deepFreeze( {
			name: 'test-feature',
			description: '',
			includeInSnippet: false,
			temporary: true,
			tags: [],
			goalIds: [],
			customProperties: {},
			environments: {
				'test': {}
			}
		} );

		const normalized = featureNormalizer( feature );

		assert.deepEqual( normalized, {
			name: 'test-feature',
			description: '',
			includeInSnippet: false,
			temporary: true,
			tags: [],
			goalIds: [],
			customProperties: {},
			environments: {
				'test': {
					on: true,
					archived: false,
					targets: [],
					rules: [],
					fallthrough: { variation: 0 },
					offVariation: 0,
					prerequisites: [],
					trackEvents: false,
					trackEventsFallthrough: false
				}
			}
		} );
	} );
	
	it( 'should strip out rule clauses __idx__ field', function() {

		const feature = deepFreeze( {
			environments: {
				test: {
					rules: [
						{
							clauses: [
								{
									attribute: 'field',
									op: 'in',
									values: [ 'value' ],
									negate: false,
									__idx__: 0
								}
							]
						}
					]	
				}
			}
		} );

		const normalized = featureNormalizer( feature );

		assert.deepEqual( normalized, {
			description: '',
			includeInSnippet: false,
			temporary: true,
			tags: [],
			goalIds: [],
			customProperties: {},
			environments: {
				test: {
					archived: false,
					fallthrough: {
						variation: 0
					},
					offVariation: 0,
					on: true,
					prerequisites: [],
					targets: [],
					trackEvents: false,
					trackEventsFallthrough: false,
					rules: [
						{
							clauses: [
								{
									attribute: 'field',
									op: 'in',
									values: [ 'value' ],
									negate: false
								}
							]
						}
					]	
				}
			}
		} );
	} );
} );