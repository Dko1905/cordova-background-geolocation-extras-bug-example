const app = angular.module('app-template', ['onsen']);

app.controller('PageController', function($scope) {
	const geo = window.BackgroundGeolocation;
	$scope.status = "not ready";
	let priv = {};

	priv.config = {
		desiredAccuracy: geo.DESIRED_ACCURACY_HIGH,
		reset: false,
		stopOnTerminate: false,
		startOnBoot: false,
		extras: {routeId: "default"}
	};

	$scope.start = async function() {
		let state = await geo.ready(priv.config);
		console.log(`>> Ready ${state.enabled} ${JSON.stringify(state.extras)}`);
		$scope.listenToLocation();
		$scope.changeRouteId();
		await geo.start();
		console.log('>> Started');
		await geo.changePace(true);
		console.log('>> Changed pace');
	};

	$scope.pause = async function() {
		$scope.changeRouteId();
		$scope.insertLocation();
	}

	$scope.continue = async function() {
		let state = await geo.ready(); // Intentionally empty
		console.log(`>> Ready ${state.enabled} ${JSON.stringify(state.extras)}`);
		$scope.listenToLocation();
	};

	$scope.stop = async function() {
		let state = await geo.ready(); // Intentionally empty
		console.log(`>> Ready ${state.enabled} ${JSON.stringify(state.extras)}`);
		$scope.listenToLocation();
		await geo.stop();
	};

	$scope.listenToLocation = function() {
		geo.onLocation(loc => {
			console.debug(`onLocation: ${loc.timestamp.toLocaleTimeString()} ${JSON.stringify(loc.extras)}`);
		});
		console.log('>> Listening to onLocation');
	};

	$scope.changeRouteId = async function() {
		priv.config.extras.routeId = uuid.v4();
		await geo.reset(priv.config);
		console.log(`>> Update route ID: ${priv.config.extras.routeId}`);
	};

	$scope.insertLocation = async function() {
		const timestamp = new Date();
		const liteGeolocationLocation = {
			timestamp: timestamp,
			coords: {
				latitude: 1,
				longitude: 2,
				altitude: 3
			},
			extras: priv.config.extras
		};
		await geo.insertLocation(liteGeolocationLocation);
		console.log('>> Inserted location');
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
