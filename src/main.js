/*jshint scripturl:true*/

/* global chrome */

require.config({
	paths: {
		jquery: "libs/jquery/dist/jquery",
		text: "libs/text/text",
		angular: "libs/angular/angular"
	},
	// angular does not support AMD out of the box, put it in a shim
	shim: {
		"angular": {
			exports: "angular"
		}
	}
});

define([
	"text!./bookmarksAppTemplate.html",
	"Emphasiser",
	"angular"
], function (bookmarksAppTemplate, Emphasiser, angular) {

	window.mainApp = angular.module("bookmarksApp", []);

	mainApp.factory("MockBookmarksFactory", function () {
		return function () {
			return {
				fetch: function (callback, context) {
					var data = {
						bookmarks: [{
								url: "mockurl",
								title: "mocktitle"
							}]
					};
					callback.call(context || this, data);
				}
			};
		};
	});

	mainApp.factory("ChromeBookmarksFactory", function () {
		return function () {

			/**
			 * Takes a list of bookmarks and folders and returns a modified list of the bookmarks.
			 * Produces an additional property, <code>folders</code>, a list of names of folders the bookmark appears in.
			 * This is populated top to bottom, so the folder the bookmark is immeadiately in would be index 0, and it's folder would be at index 1, etc.
			 * @param {array} bookmarks list of Chrome bookmarks
			 * @param {array} folders list of folders
			 * @returns {array} list of bookmarks with a new <code>folders</code> property
			 */
			function mergeFoldersIntoBookmarks(bookmarks, folders) {
				return _.map(bookmarks, function (bookmark) {
					var parentFolder,
						parentFolders = [];
					(function setFolders(node) {
						if (node.hasOwnProperty("parentId")) {
							// todo - performance, does this need to be moved to a collection
							parentFolder = _.find(folders, function (folder) {
								return folder.id === node.parentId;
							});
							if (parentFolder.title !== "" && parentFolder.title !== "Bookmarks bar") {
								parentFolders.push(parentFolder.title);
							}
							setFolders(parentFolder);
						}
					})(bookmark);

					return _.extend(bookmark, {
						folders: parentFolders
					});
				});
			}

			/**
			 * Flattens a bookmark structure from Chrome <code>bookmarks.getTree</code> API.
			 * Converts into a map with the following two keys:
			 * <ul>
			 * <li><code>bookmarks</code> list of all the bookmarks</li>
			 * <li><code>folders</code> list of the folders</li>
			 * </ul>
			 * @param {object|array} bookmarkSubTree Chrome <code>bookmarks.getTree</code> API callback passed-in parameter
			 * @returns {object} map with <code>bookmarks</code> and <code>folders</code> properties, both of which are lists.
			 */
			function flatten(bookmarkSubTree) {
				var bookmarks = [],
					folders = [];
				(function flatten(bookmarkSubTree) {
					if (Array.isArray(bookmarkSubTree)) {
						return bookmarkSubTree.map(function (bookmarkSubTreeChild) {
							return flatten(bookmarkSubTreeChild);
						});
					} else if (bookmarkSubTree.hasOwnProperty("children")) {
						folders.push(bookmarkSubTree);
						return flatten(bookmarkSubTree.children);
					} else {
						// don't accept bookmarklets
						if (bookmarkSubTree.url.indexOf("javascript:") !== 0) {
							bookmarks.push(bookmarkSubTree);
						}
					}
				})(bookmarkSubTree);
				return {
					bookmarks: bookmarks,
					folders: folders
				};
			}

			return {
				fetch: function (callback, context) {
					chrome.bookmarks.getTree(function (bookmarkTree) {
						callback.call(context || this, flatten(bookmarkTree));
					});
				}
			};
		};
	});

	mainApp.controller('bookmarksController', function ($scope, MockBookmarksFactory, ChromeBookmarksFactory) {
		var bookmarkFactory = chrome.bookmarks ? new ChromeBookmarksFactory() : new MockBookmarksFactory();
		bookmarkFactory.fetch(function (response) {
			$scope.bookmarks = response.bookmarks;
		}, this);
		$scope.$watch("searchTerm", function (searchTerm) {
			window.setTimeout(function () {
				var emphasiser = new Emphasiser($("#bookmarksListing"));
				emphasiser.emphasise(searchTerm);
			}, 0);
		});
//			window.setTimeout(function () {
//				var emphasiser = new Emphasiser($("#bookmarksListing"));
//				emphasiser.emphasise(searchTerm);
//			}, 0);
//		});

		$scope.openLinkInNewTab = function (url) {
			chrome.tabs.create({
				url: url
			});
		};
		$scope.filter = function (bookmark, index, list) {
			var searchTerm = $scope.searchTerm,
				upperCaseSearchTerm;

			if (!searchTerm) {
				return true;
			}
			upperCaseSearchTerm = searchTerm.toUpperCase();

			if (bookmark.url.toUpperCase().indexOf(upperCaseSearchTerm) > -1 || bookmark.title.toUpperCase().indexOf(upperCaseSearchTerm) > -1) {
				return true;
			}
			return false;
		};

	});

//	mainApp.directive("afterRenderBookmarkList", function () {
//		return function ($scope, element) {
//			console.log($scope.searchTerm);
////			window.setTimeout(function () {
////				var emphasiser = new Emphasiser($(element));
////				emphasiser.emphasise($scope.searchTerm);
////			}, 0);
//		};
//	});

	$("body").html(bookmarksAppTemplate);
	angular.bootstrap(document, ["bookmarksApp"]);



});
