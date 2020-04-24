const rp = require( 'request-promise' );

class LaunchDarklyClient {

	constructor( apiKey ) {
		this._client = rp.defaults( {
			baseUrl: 'https://app.launchdarkly.com',
			headers: {
				Authorization: apiKey
			}
		} );
	}

	getAllFeatureFlagsAsync( project ) {

		const url = `/api/v2/flags/${ encodeURI( project ) }`;

		const req = {
			method: 'GET',
			url: url,
			qs: {
				summary: 'false'
			},
			json: true
		};

		return this._client( req );
	}

	createFeatureFlagAsync( project, params ) {

		const url = `/api/v2/flags/${ encodeURI( project ) }`;

		const req = {
			method: 'POST',
			url: url,
			json: params
		};

		return this._client( req );
	}

	getFeatureFlagAsync( project, key ) {

		const url = `/api/v2/flags/${ encodeURI( project ) }/${ encodeURI( key ) }`;

		const req = {
			method: 'GET',
			url: url,
			json: true
		};

		return this._client( req );
	}

	updateFeatureFlagAsync( project, key, patch, comment ) {

		const url = `/api/v2/flags/${ encodeURI( project ) }/${ encodeURI( key ) }`;

		const req = {
			method: 'PATCH',
			url: url,
			headers: {
				'Content-Type': 'application/json'
			},
			json: {
				comment,
				patch
			}
		};

		return this._client( req );
	}
}

module.exports = LaunchDarklyClient;