const _ = require( 'lodash' );
const deepFreeze = require( 'deep-freeze' );

const ignoredClauseFields = deepFreeze( [
	'__idx__'
] );

function normalizeClause( clause ) {
	
	const normal = _.omit( clause, ignoredClauseFields );
	return normal;
}

const ignoredRuleFields = deepFreeze( [
	'_id'
] );

function normalizeRule( rule ) {

	const normal = _.omit( rule, ignoredRuleFields );
	
	normal.clauses = _.map( normal.clauses, normalizeClause );
	
	return normal;
}

const ignoredEnvironmentFields = deepFreeze( [
	'salt',
	'sel',
	'lastModified',
	'version',
	'_site',
	'_access',
	'_environmentName',
	'_debugEventsUntilDate'
] );

const defaultEnvironmentFields = deepFreeze( {
	on: true,
	archived: false,
	targets: [],
	rules: [],
	fallthrough: { variation: 0 },
	offVariation: 0,
	prerequisites: [],
	trackEvents: false
} );

function normalizeEnvironment( env ) {

	const normal = _.defaults(
		_.omit( env, ignoredEnvironmentFields ),
		defaultEnvironmentFields
	);

	normal.rules = _.map( normal.rules, normalizeRule );

	return normal;
}

const ignoredFeatureFlagFields = deepFreeze( [
	'key',
	'creationDate',
	'_links',
	'maintainerId',
	'_maintainer'
] );

const defaultFeatureFlagFields = deepFreeze( {
	description: '',
	includeInSnippet: false,
	temporary: true,
	tags: [],
	goalIds: [],
	customProperties: {}
} );

module.exports = function( feature ) {

	const normal = _.defaults(
		_.omit( feature, ignoredFeatureFlagFields ),
		defaultFeatureFlagFields
	);

	normal.environments = _.mapValues(
		feature.environments || {},
		normalizeEnvironment
	);
	
	return normal;
};
