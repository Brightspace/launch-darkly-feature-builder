const _ = require( 'lodash' );
const featureComparer = require( './featureComparer.js' );
const LaunchDarklyClient = require( './LaunchDarklyClient.js' );
const log = require( './log.js' );

async function createFeatureAsync( ldClient, project, key, plan, comment ) {

	const createParams = _.pick( plan.target, [
		'name',
		'variations',
		'temporary',
		'tags',
		'includeInSnippet'
	] );
	createParams.key = key;

	log.debug(
		{
			project,
			feature: key,
			params: createParams
		},
		'Creating feature flag'
	);

	const flag = await ldClient.createFeatureFlagAsync( project, createParams );

	const diff = featureComparer( flag, plan.target );
	if( diff.equal ) {
		return flag;
	}
	const patch = diff.patch;

	log.debug(
		{
			project,
			feature: key,
			patch
		},
		'Applying patch'
	);

	const result = await ldClient.updateFeatureFlagAsync( project, key, patch, comment );
	log.info(
		{
			project,
			feature: key,
			details: result
		},
		'Create feature flag'
	);
}

async function updateFeatureAsync( ldClient, project, key, plan, comment ) {

	const flag = await ldClient.getFeatureFlagAsync( project, key );

	if( !_.isEqual( flag, plan.current ) ) {

		log.warn(
			{
				project,
				feature: key,
				before: plan.current,
				after: flag
			},
			'Feature flag has changed since plan was generated'
		);

		throw new Error( 'Out of date feature plan' );
	}

	const result = await ldClient.updateFeatureFlagAsync( project, key, plan.patch, comment );
	log.info(
		{
			project,
			feature: key,
			details: result
		},
		'Updated feature flag'
	);
}

module.exports = class FeaturePlanApplier {

	constructor( apiKey, project ) {
		this._ldClient = new LaunchDarklyClient( apiKey );
		this._project = project;
	}

	applyPlanAsync( key, plan, comment ) {
	
		const action = plan.action;
		switch( action ) {

			case 'create':
				return createFeatureAsync( this._ldClient, this._project, key, plan, comment );

			case 'update':
				return updateFeatureAsync( this._ldClient, this._project, key, plan, comment );

			case 'none':
				return Promise.resolve();

			default:
				throw new Error( `Invalid plan action: ${ action }` );
		}
	}
};
