const _ = require( 'lodash' );

class SimpleEnumFeatureConverter {

	get schemas() {
		return [
			'http://test.org/simple-enum'
		];
	}

	convert( definition, options, callback ) {

		const variations = _.map( definition.variations, v => {
			return _.pick( v, ['value', 'name'] );
		} );

		const feature = {
			name: definition.name,
			kind: 'multivariate',
			variations: variations,
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
		new SimpleEnumFeatureConverter()
	] );
};
