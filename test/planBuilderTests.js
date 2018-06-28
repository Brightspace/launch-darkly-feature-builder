const assert = require( './util/assert.js' );
const planBuilder = require( '../src/planBuilder.js' );

describe( 'planBuilder', function() {
	it( 'should create plan', function() {

		const currentFeatures = {
			featureA: {
				name: 'feature-a',
				description: 'Super feature'
			},
			featureB: {
				name: 'feature-b',
				description: 'Never changes'
			},
			featureZ: {
				name: 'feature-z',
				description: 'Obsolete and old school'
			}
		};
	
		const targetFeatures = {
			featureA: {
				name: 'feature-a',
				description: 'Well... not that super'
			},
			featureB: {
				name: 'feature-b',
				description: 'Never changes'
			},
			featureC: {
				name: 'feature-c',
				description: 'Another feature'
			}
		};
	
		const plan = planBuilder( currentFeatures, targetFeatures );

		assert.deepEqual( plan, {
			featureA: {
				action: 'update',
				current: {
					name: 'feature-a',
					description: 'Super feature'
				},
				target: {
					name: 'feature-a',
					description: 'Well... not that super'
				},
				patch: [
					{
						op: 'replace',
						path: '/description',
						value: 'Well... not that super'
					}
				]
			},
			featureB: {
				action: 'none',
				current: {
					name: 'feature-b',
					description: 'Never changes'
				},
				target: {
					name: 'feature-b',
					description: 'Never changes'
				}
			},
			featureC: {
				action: 'create',
				target: {
					name: 'feature-c',
					description: 'Another feature'
				}
			}
		} );

	} );
} );