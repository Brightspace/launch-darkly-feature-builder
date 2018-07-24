class EchoOptionsFeatureConverter {

	constructor( factoryOptions ) {
		this.factoryOptions = factoryOptions;
	}

	get schemas() {
		return [
			'http://test.org/echo-options'
		];
	}

	convert( definition, options, callback ) {
		callback( null, {
			factoryOptions: this.factoryOptions,
			convertOptions: options
		} );
	}
}

module.exports = function( options, callback ) {
	callback( null, [
		new EchoOptionsFeatureConverter( options )
	] );
};
