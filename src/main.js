var mainApp = angular.module("bookmarksApp", []);

mainApp.factory("MockBookmarksFactory", function() {
	return function() {
		return {
			fetch: function(callback, context) {
				var data = [{
						url: "mockurl",
						title: "mocktitle"
					}];
				callback.call(context || this, data);
			}
		};
	};
});

mainApp.factory("ChromeBookmarksFactory", function() {
	return function() {
		return {
			fetch: function(callback, context) {
				chrome.bookmarks.getTree(function(bookmarkTree) {
					console.log(bookmarkTree);
					callback.call(context || this, bookmarkTree);
				});
			}
		};
	};
});

mainApp.controller('bookmarksController', function($scope, MockBookmarksFactory, ChromeBookmarksFactory) {
	bookmarks = window.chrome.bookmarks ? new ChromeBookmarksFactory() : new MockBookmarksFactory();
	bookmarks.fetch(function(bookmarks) {
		$scope.bookmarks = bookmarks;
	}, this);
});