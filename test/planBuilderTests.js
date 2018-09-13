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

	it( 'should throw if updating both environments and variations', function() {

		const currentFeatures = {
			featureA: {
				variations: [
					{
						value: true,
						name: "true"
					},
					{
						value: false,
						name: "false"
					}
				],
				environments: {
					production: {
						offVariation: 0
					}
				}
			}
		};
	
		const targetFeatures = {
			featureA: {
				variations: [
					{
						value: true,
						name: "On"
					},
					{
						value: false,
						name: "Off"
					}
				],
				environments: {
					production: {
						offVariation: 1
					}
				}
			}
		};
	
		assert.throws(
			() => planBuilder( currentFeatures, targetFeatures ),
			/Unable to generate valid patch for featureA: Cannot simultaneously update environments and variations/
		);

	} );
} );