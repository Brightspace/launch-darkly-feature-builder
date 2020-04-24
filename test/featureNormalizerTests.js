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
			archived: false,
			includeInSnippet: false,
			temporary: true,
			tags: [],
			goalIds: [],
			customProperties: {},
			experiments: {
				baselineIdx: 0,
				items: []
			},
			environments: {},
			variations: []
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
			experiments: {
				baselineIdx: 0,
				items: []
			},
			environments: {
				'test': {}
			}
		} );

		const normalized = featureNormalizer( feature );

		assert.deepEqual( normalized, {
			name: 'test-feature',
			description: '',
			archived: false,
			includeInSnippet: false,
			temporary: true,
			tags: [],
			goalIds: [],
			customProperties: {},
			experiments: {
				baselineIdx: 0,
				items: []
			},
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
			},
			variations: []
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
			archived: false,
			includeInSnippet: false,
			temporary: true,
			tags: [],
			goalIds: [],
			customProperties: {},
			experiments: {
				baselineIdx: 0,
				items: []
			},
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
							],
							trackEvents: false
						}
					]
				}
			},
			variations: []
		} );
	} );

	it( 'should strip out rule clauses id field', function() {

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
									id: ''
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
			archived: false,
			includeInSnippet: false,
			temporary: true,
			tags: [],
			goalIds: [],
			customProperties: {},
			experiments: {
				baselineIdx: 0,
				items: []
			},
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
							],
							trackEvents: false
						}
					]
				}
			},
			variations: []
		} );
	} );

	it( 'should strip out environment _summary field', function() {

		const feature = deepFreeze( {
			environments: {
				test: {
					_summary: {
						variations: {
							'0': {
								rules: 0,
								nullRules: 0,
								targets: 0,
								isFallthrough: true,
								isOff: true
							},
							'1': {
								rules: 0,
								nullRules: 0,
								targets: 1
							}
						},
						prerequisites: 0
					}
				}
			}
		} );

		const normalized = featureNormalizer( feature );

		assert.deepEqual( normalized, {
			description: '',
			archived: false,
			includeInSnippet: false,
			temporary: true,
			tags: [],
			goalIds: [],
			customProperties: {},
			experiments: {
				baselineIdx: 0,
				items: []
			},
			environments: {
				test: {
					archived: false,
					fallthrough: {
						variation: 0
					},
					offVariation: 0,
					on: true,
					prerequisites: [],
					rules: [],
					targets: [],
					trackEvents: false,
					trackEventsFallthrough: false
				}
			},
			variations: []
		} );
	} );

	it( 'should strip out variation _id field', function() {

		const feature = deepFreeze( {
			variations: [
				{
					_id: 'bd72b94b-d75c-4cde-907a-d8fbe5f95d98',
					value: true
				},
				{
					_id: '010c2576-6415-4222-9193-c96e2d9973a4',
					value: false
				}
			]
		} );

		const normalized = featureNormalizer( feature );

		assert.deepEqual( normalized, {
			description: '',
			archived: false,
			includeInSnippet: false,
			temporary: true,
			tags: [],
			goalIds: [],
			customProperties: {},
			experiments: {
				baselineIdx: 0,
				items: []
			},
			environments: {},
			variations: [
				{
					value: true
				},
				{
					value: false
				}
			]
		} );
	} );
} );