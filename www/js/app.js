const app = angular.module('app-template', ['onsen']);

app.controller('PageController', function($scope) {
	const geo = window.BackgroundGeolocation;
	$scope.status = "not ready";
	let priv = {};
	$scope.routeId = null;


	this.$onInit = async function() {
		const defaultConfig = {
			desiredAccuracy: geo.DESIRED_ACCURACY_HIGH,
			reset: false, // Only use config if no persisted configuration exists
			stopOnTerminate: false,
			startOnBoot: false,
			extras: {routeId: null, type: null}
		};
		// Use default config if no persistent config exists
		const state = await geo.ready(defaultConfig);
		console.log(`>> Ready ${state.enabled} ${JSON.stringify(state.extras)}`);

		// Reset config to default config if not currently tracking
		if (!state.enabled) {
			await geo.reset();
			await geo.setConfig(defaultConfig);
		}

		// Listen to onLocation events
		$scope.listenToLocation();
	};

	$scope.start = async function() {
		// Set routeId and type
		$scope.routeId = uuid.v4();
		const config = {
			extras: {routeId: $scope.routeId, type: 'start'}
		};
		await geo.setConfig(config);
		await geo.destroyLocations();
		await geo.start();
		console.log('>> Started');
		await geo.changePace(true);
		console.log('>> Changed pace');
	};

	$scope.pause = async function() {
		const config = {
			extras: {routeId: $scope.routeId, type: 'pause'}
		};
		const state = await geo.setConfig(config);
		console.log(`> Set config ${JSON.stringify(state.extras)}`);
		const liteGeolocationLocation = {
			timestamp: new Date(),
			coords: {latitude: 1, longitude: 2, altitude: 3},
			extras: state.extras
		};
		await geo.insertLocation(liteGeolocationLocation);
		console.log(`> Inserted location`);
	}

	$scope.stop = async function() {
		// Stop tracking
		await geo.stop();
		console.log(`>> Stopped`);
	};

	$scope.listenToLocation = function() {
		geo.onLocation(loc => {
			console.debug(`onLocation: ${loc.timestamp.toLocaleTimeString()} ${JSON.stringify(loc.extras)}`);
		});
		console.log('>> Listening to onLocation');
	};

	$scope.printLocations = function() {
		return geo.getLocations()
			.then(locations => {
				console.debug('> Locations')
				for (const loc of locations) {
					console.debug(`\t${loc.timestamp.toLocaleTimeString()} ${JSON.stringify(loc.extras)}`);
				}
			})
			.catch(err => console.error(Error(err)));
	};
});
