const assert = require( './util/assert.js' );
const parseArgs = require( '../src/args.js' ).parseArgs;
const pathUtil = require( 'path' );

describe( 'parseArgs', function() {

	describe( 'validate action', function() {

		it( 'should parse complete validate', function() {

			const args = parseArgs( [
				'validate',
				'--converters',
				'./converters-dir',
				'--features',
				'./features-dir'
			] );

			assert.deepEqual( args, {
				action: 'validate',
				args: {
					converters: './converters-dir',
					features: './features-dir'
				}
			} );
		} );

		it( 'should use default parameters', function() {

			const args = parseArgs( [
				'validate',
				'--features',
				'./features-dir'
			] );

			assert.deepEqual( args, {
				action: 'validate',
				args: {
					converters: pathUtil.resolve( __dirname, '../..' ),
					features: './features-dir'
				}
			} );
		} );

		it( 'should throw if missing features', function() {

			assert.throws(
				() => {
					parseArgs( [
						'validate',
						'--converters',
						'./converters-dir'
					] );
				},
				/Missing required option for action 'validate': --features/
			);
		} );

	} );

	describe( 'plan action', function() {

		it( 'should parse complete plan', function() {

			const args = parseArgs( [
				'plan',
				'--api-key',
				'ABC',
				'--out',
				'plan.json',
				'--project',
				'myapp',
				'--converters',
				'./converters-dir',
				'--features',
				'./features-dir',
				'--detailed-exitcode'
			] );

			assert.deepEqual( args, {
				action: 'plan',
				args: {
					'api-key': 'ABC',
					'detailed-exitcode': true,
					project: 'myapp',
					converters: './converters-dir',
					features: './features-dir',
					out: 'plan.json'
				}
			} );
		} );

		it( 'should use default parameters', function() {

			const args = parseArgs( [
				'plan',
				'--api-key',
				'ABC',
				'--project',
				'myapp',
				'--out',
				'plan.json',
				'--features',
				'./features-dir'
			] );

			assert.deepEqual( args, {
				action: 'plan',
				args: {
					'api-key': 'ABC',
					'detailed-exitcode': false,
					project: 'myapp',
					converters: pathUtil.resolve( __dirname, '../..' ),
					features: './features-dir',
					out: 'plan.json'
				}
			} );
		} );

		it( 'should throw if missing api-key', function() {

			assert.isUndefined(
				process.env.LAUNCH_DARKLY_API_KEY,
				'Test requires LAUNCH_DARKLY_API_KEY environment variable to not be set'
			);

			assert.throws(
				() => {
					parseArgs( [
						'plan',
						'--out',
						'plan.json',
						'--project',
						'myapp',
						'--converters',
						'./converters-dir',
						'--features',
						'./features-dir',
					] );
				},
				/Missing required option for action 'plan': --api-key/
			);
		} );

		it( 'should throw if missing out file', function() {

			assert.throws(
				() => {
					parseArgs( [
						'plan',
						'--api-key',
						'ABC',
						'--project',
						'myapp',
						'--converters',
						'./converters-dir',
						'--features',
						'./features-dir',
					] );
				},
				/Missing required option for action 'plan': --out/
			);
		} );

		it( 'should throw if missing project', function() {

			assert.throws(
				() => {
					parseArgs( [
						'plan',
						'--api-key',
						'ABC',
						'--out',
						'plan.json',
						'--converters',
						'./converters-dir',
						'--features',
						'./features-dir'
					] );
				},
				/Missing required option for action 'plan': --project/
			);
		} );

		it( 'should throw if missing features', function() {

			assert.throws(
				() => {
					parseArgs( [
						'plan',
						'--api-key',
						'ABC',
						'--project',
						'myapp',
						'--out',
						'plan.json',
						'--converters',
						'./converters-dir'
					] );
				},
				/Missing required option for action 'plan': --features/
			);
		} );

	} );

	describe( 'show action', function() {

		it( 'should parse complete show', function() {

			const args = parseArgs( [
				'show',
				'--plan',
				'plan.json'
			] );

			assert.deepEqual( args, {
				action: 'show',
				args: {
					plan: 'plan.json'
				}
			} );
		} );

		it( 'should throw if missing plan', function() {

			assert.throws(
				() => {
					parseArgs( [
						'show'
					] );
				},
				/Missing required option for action 'show': --plan/
			);
		} );
	} );

	describe( 'apply action', function() {

		it( 'should parse complete apply', function() {

			const args = parseArgs( [
				'apply',
				'--plan',
				'plan.json',
				'--api-key',
				'ABC'
			] );

			assert.deepEqual( args, {
				action: 'apply',
				args: {
					'api-key': 'ABC',
					plan: 'plan.json'
				}
			} );
		} );

		it( 'should throw if missing api-key', function() {

			assert.isUndefined(
				process.env.LAUNCH_DARKLY_API_KEY,
				'Test requires LAUNCH_DARKLY_API_KEY environment variable to not be set'
			);

			assert.throws(
				() => {
					parseArgs( [
						'apply',
						'--plan',
						'plan.json'
					] );
				},
				/Missing required option for action 'apply': --api-key/
			);
		} );

		it( 'should throw if missing plan', function() {

			assert.throws(
				() => {
					parseArgs( [
						'apply',
						'--api-key',
						'ABC'
					] );
				},
				/Missing required option for action 'apply': --plan/
			);
		} );

		it( 'should throw if unknown option', function() {

			assert.throws(
				() => {
					parseArgs( [
						'apply',
						'--api-key',
						'--plan',
						'plan.json',
						'--wacky',
						'7'
					] );
				},
				/Unknown option\(s\) for action 'apply': --wacky 7/
			);
		} );
	} );

	it( 'should throw if no action', function() {

		assert.throws(
			() => {
				parseArgs( [] );
			},
			/Action required/
		);
	} );

	it( 'should throw if unknown action', function() {

		assert.throws(
			() => {
				parseArgs( [
					'wacky',
					'-stuff'
				] );
			},
			/Unknown action: wacky/
		);
	} );
} );

