const _ = require( 'lodash' );
const deepFreeze = require( 'deep-freeze' );

function isInternalField( value, name ) {

	if( _.startsWith( name, '_' ) ) {
		return true;
	}

	return false;
}

function omitExplicitAndInternal( object, paths ) {

	let normal = _.omit( object, paths );
	normal = _.omitBy( normal, isInternalField );
	return normal;
}

function normalizeClause( clause ) {

	const normal = _.omitBy( clause, isInternalField );
	return normal;
}

const defaultRuleFields = deepFreeze( {
	trackEvents: false
} );

function normalizeRule( rule ) {

	const normal = _.defaults(
		_.omitBy( rule, isInternalField ),
		defaultRuleFields
	);
	
	normal.clauses = _.map( normal.clauses, normalizeClause );
	
	return normal;
}

const ignoredEnvironmentFields = deepFreeze( [
	'lastModified',
	'salt',
	'sel',
	'version',
	'_summary'
] );

const defaultEnvironmentFields = deepFreeze( {
	on: true,
	archived: false,
	targets: [],
	rules: [],
	fallthrough: { variation: 0 },
	offVariation: 0,
	prerequisites: [],
	trackEvents: false,
	trackEventsFallthrough: false
} );

function normalizeEnvironment( env ) {

	const normal = _.defaults(
		omitExplicitAndInternal( env, ignoredEnvironmentFields ),
		defaultEnvironmentFields
	);

	normal.rules = _.map( normal.rules, normalizeRule );

	return normal;
}

const ignoredFeatureFlagFields = deepFreeze( [
	'creationDate',
	'key',
	'maintainerId'
] );

const defaultFeatureFlagFields = deepFreeze( {
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
	}
} );

module.exports = function( feature ) {

	const normal = _.defaults(
		omitExplicitAndInternal( feature, ignoredFeatureFlagFields ),
		defaultFeatureFlagFields
	);

	normal.environments = _.mapValues(
		feature.environments || {},
		normalizeEnvironment
	);
	
	return normal;
};
