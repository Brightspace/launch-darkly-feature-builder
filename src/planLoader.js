const Promise = require( 'bluebird' );
const fsUtil = Promise.promisifyAll( require( 'fs' ) );
const log = require( './log.js' );

module.exports = async function( path ) {

	log.debug( { path }, 'Loading plan' );

	const json = await fsUtil.readFileAsync( path, { encoding: 'utf8' } );

	const plan = JSON.parse( json );
	return plan;
};