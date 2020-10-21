const argsUtil = require( './args.js' );

let args;
try {
	args = argsUtil.parseArgs( process.argv );
} catch( err ) {
	console.error( err.message ); // eslint-disable-line no-console
	argsUtil.showUsage();
	process.exit( 1 ); // eslint-disable-line no-process-exit
}

const applyAsync = require( './applyAction.js' );
const exportAsync = require( './exportAction.js' );
const planAsync = require( './planAction.js' );
const showAsync = require( './showAction.js' );
const validateAsync = require( './validateAction.js' );
const log = require( './log.js' );

process.on( 'uncaughtException', function( err ) {
	log.fatal( err );
	process.exit( 100 ); // eslint-disable-line no-process-exit
} );

process.on( 'unhandledRejection', function( reason, promise ) {
	log.fatal( { reason, promise }, 'Unhandled rejection' );
	process.exit( 101 ); // eslint-disable-line no-process-exit
} );

function runAsync( args ) {

	switch( args.action ) {

		case 'apply':
			return applyAsync( args.args );

		case 'export':
			return exportAsync( args.args );

		case 'plan':
			return planAsync( args.args );

		case 'show':
			return showAsync( args.args );

		case 'validate':
			return validateAsync( args.args );

		default:
			return Promise.reject( `Invalid action: ${ args.action }` );
	}
}

runAsync( args )
	.then( exitCode => {
		process.exit( exitCode ); // eslint-disable-line no-process-exit
		return exitCode;
	} )
	.catch( err => {
		log.fatal( err );
		process.exit( 102 ); // eslint-disable-line no-process-exit
		return 102;
	} );
