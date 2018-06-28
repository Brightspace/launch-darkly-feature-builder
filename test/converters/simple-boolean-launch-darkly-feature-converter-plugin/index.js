class SimpleBooleanFeatureConverter {

	get schemas() {
		return [
			'http://test.org/simple-boolean'
		];
	}

	convert( definition, options, callback ) {
		const feature = {
			name: definition.name,
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
		};
		callback( null, feature );
	}
}

module.exports = function( options, callback ) {
	callback( null, [
		new SimpleBooleanFeatureConverter()
	] );
};
