const app = angular.module('app-template', ['onsen']);

app.controller('PageController', function($scope) {
	const geo = window.BackgroundGeolocation;

	$scope.ready = function() {
		geo.ready({
			reset: true,
			url: 'http://192.168.1.44',
			autoSync: false,
			batchSync: true
		})
			.then(_ => console.log('READY'))
			.catch(err => console.error(Error(err)));
	};

	$scope.test = function() {
		geo.resetOdometer() // <-- Bug right here
			.then(location => {
				console.log(JSON.stringify(location));
				console.log(location.timestamp); // <-- Incorrect output
				console.log(location.timestamp instanceof Date)
				console.log(new Date() instanceof Date) // Just to be sure
			})
			.catch(err => console.error(Error(err)));
	};
});
