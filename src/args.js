const _ = require( 'lodash' );
const commandLineArgs = require( 'command-line-args' );
const commandLineUsage = require( 'command-line-usage' );
const deepFreeze = require( 'deep-freeze' );
const pathUtil = require( 'path'  );

const mainDefinition = deepFreeze( [
	{
		name: 'action',
		defaultOption: true
	}
] );

const actionDefintions = deepFreeze( {
	apply: [
		{
			name: 'api-key',
			required: true,
			defaultValue: process.env.LAUNCH_DARKLY_API_KEY
		},
		{
			name: 'plan',
			required: true
		}
	],
	plan: [
		{
			name: 'api-key',
			required: true,
			defaultValue: process.env.LAUNCH_DARKLY_API_KEY
		},
		{
			name: 'project',
			required: true
		},
		{
			name: 'converters',
			required: true,
			defaultValue: pathUtil.resolve( __dirname, '../..' )
		},
		{
			name: 'features',
			required: true
		},
		{
			name: 'out',
			required: true
		},
		{
			name: 'detailed-exitcode',
			type: Boolean,
			defaultValue: false
		}
	],
	show: [
		{
			name: 'plan',
			required: true
		}
	],
	validate: [
		{
			name: 'converters',
			required: true,
			defaultValue: pathUtil.resolve( __dirname, '../..' )
		},
		{
			name: 'features',
			required: true
		}
	]
} );

function parseArgs( argv ) {

	const mainArgs = commandLineArgs( mainDefinition, {
		argv,
		stopAtFirstUnknown: true
	} );

	const action = mainArgs.action;
	if( !action ) {
		throw new Error( 'Action required' );
	}

	const actionDefinition = actionDefintions[ action ];
	if( !actionDefinition ) {
		throw new Error( `Unknown action: ${action}` );
	}

	const actionArgs = commandLineArgs( actionDefinition, {
		argv: mainArgs._unknown || [],
		stopAtFirstUnknown: true
	} );

	if( actionArgs._unknown && actionArgs._unknown.length > 0 ) {
		const unknownArgs = _.join( actionArgs._unknown, ' ' );
		throw new Error( `Unknown option(s) for action '${action}': ${unknownArgs}` );
	}

	const requiredFields = _
		.filter( actionDefinition, d => d.required )
		.map( d => d.name );

	requiredFields.forEach( field => {
		if( !_.has( actionArgs, field ) ) {
			throw new Error( `Missing required option for action '${action}': --${field}` );
		}
	} );

	return {
		action,
		args: actionArgs
	};
}

function showUsage() {

	const usage = commandLineUsage( [
		{
			header: 'launch-darkly-feature-builder',
			content: 'Validates, plans, shows, and applies changes to launch darkly feature flags'
		},
		{
			header: 'usage',
			content: [
				'$ launch-darkly-feature-builder validate ...',
				'$ launch-darkly-feature-builder plan ...',
				'$ launch-darkly-feature-builder show ...',
				'$ launch-darkly-feature-builder apply ...'
			]
		},
		{
			header: 'validate options',
			optionList: [
				{
					name: 'converters',
					typeLabel: '{underline directory}',
					description: 'The path to the converters plugin directory'
				},
				{
					name: 'features',
					typeLabel: '{underline directory}',
					description: 'The path to the features directory'
				}
			]
		},
		{
			header: 'plan options',
			optionList: [
				{
					name: 'api-key',
					typeLabel: '{underline key}',
					description: 'The launch darkly api key'
				},
				{
					name: 'project',
					typeLabel: '{underline project}',
					description: 'The launch darkly project key'
				},
				{
					name: 'converters',
					typeLabel: '{underline directory}',
					description: 'The path to the converters plugin directory'
				},
				{
					name: 'features',
					typeLabel: '{underline directory}',
					description: 'The path to the features directory'
				},
				{
					name: 'out',
					typeLabel: '{underline file}',
					description: 'The file to output the plan to.'
				},
				{
					name: 'detailed-exitcode',
					description: 'Return a detailed exit code when the command exits ( 0: Succeeded, 1: Error, 2: Succeeded with non-empty diff )'
				}
			]
		},
		{
			header: 'show options',
			optionList: [
				{
					name: 'plan',
					typeLabel: '{underline file}',
					description: 'The plan file to show.'
				}
			]
		},
		{
			header: 'apply options',
			optionList: [
				{
					name: 'plan',
					typeLabel: '{underline file}',
					description: 'The plan file to apply.'
				},
				{
					name: 'api-key',
					typeLabel: '{underline key}',
					description: 'The launch darkly api key'
				}
			]
		}
	] );

	console.info( usage ); // eslint-disable-line no-console
}

module.exports = {
	parseArgs,
	showUsage
};
