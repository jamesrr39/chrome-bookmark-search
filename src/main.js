/*jshint scripturl:true*/

/* global chrome */

require.config({
	paths: {
		jquery: "libs/jquery/dist/jquery",
		text: "libs/text/text",
		lunr: "libs/lunr/lunr",
		mustache: "libs/mustache.js/mustache"
	}
});
define([
	"text!./bookmarkTemplate.html",
	"Emphasiser",
	"jquery",
	"lunr",
	"mustache"
], function (bookmarkTemplate, Emphasiser, $, lunr, Mustache) {

	var searchIndex = lunr(function () {
		this.field("url", {
			boost: 10
		});
		this.field("title", {
			boost: 5
		});
		this.ref("url");
	});
	/**
	 * Takes a list of bookmarks and folders and returns a modified list of the bookmarks.
	 * Produces an additional property, <code>folders</code>, a list of names of folders the bookmark appears in.
	 * This is populated top to bottom, so the folder the bookmark is immeadiately in would be index 0, and it's folder would be at index 1, etc.
	 * @param {array} bookmarks list of Chrome bookmarks
	 * @param {array} folders list of folders
	 * @returns {array} list of bookmarks with a new <code>folders</code> property
	 */
	function mergeFoldersIntoBookmarks(bookmarks, folders) {
		return bookmarks.map(function (bookmark) {
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

	var Bookmarks = function () {
		var bookmarkMap = {},
			bookmarkList;

		return {
			fetch: function (callback, context) {
				chrome.bookmarks.getTree(function (bookmarkTree) {
					var bookmarksTree = flatten(bookmarkTree);

					bookmarkList = bookmarksTree.bookmarks;

					bookmarksTree.bookmarks.forEach(function (bookmark) {
						bookmarkMap[bookmark.url] = bookmark;
						searchIndex.add(bookmark);
					});
					callback.call(context);
				});
			},
			asMap: function () {
				return bookmarkMap;
			},
			asList: function () {
				return bookmarkList;
			}
		};
	};

	function buildBookmarkHtml(bookmark, score, rowClass) {
		var indexOfProtocolEnd = bookmark.url.indexOf("://"),
			siteUrl = (indexOfProtocolEnd === -1) ? bookmark.url.substring(0, bookmark.url.indexOf("/")) : bookmark.url.substring(0, bookmark.url.indexOf("/", indexOfProtocolEnd + 3));

		return Mustache.render(bookmarkTemplate, {
			url: bookmark.url,
			title: bookmark.title,
			score: score,
			faviconUrl: "chrome://favicon/" + siteUrl,
			rowClass: rowClass
		});
	}

	var bookmarks = new Bookmarks();
	bookmarks.fetch(function () {
		$("#searchTermInput").keyup(function () {
			var searchTerm = this.value,
				results = searchIndex.search(searchTerm),
				searchResultsAsMap = {},
				html = results.map(function (result) {
					var bookmark = bookmarks.asMap()[result.ref];

					searchResultsAsMap[bookmark.url] = bookmark;

					return buildBookmarkHtml(bookmark, result.score, "searchResult");
				}).join("");

			$("#bookmarksListing").html(html);

			window.setTimeout(function () {
				var filterTerms = lunr.tokenizer(searchTerm).map(function (filterTerm) {
					return filterTerm.toUpperCase();
				}),
					html,
					filterResults = bookmarks.asList().filter(function (bookmark) {
					for (var i = 0; i < filterTerms.length; i++) {
						if (searchResultsAsMap[bookmark.url]) {
							return false;
						}

						if (bookmark.url.toUpperCase().indexOf(filterTerms[i]) !== -1) {
							return true;
						}
						if (bookmark.title.toUpperCase().indexOf(filterTerms[i]) !== -1) {
							return true;
						}
					}
					return false;
				});

				html = filterResults.map(function (bookmark) {
					return buildBookmarkHtml(bookmark, 0, "filterResult");
				}).join("");

				$("#bookmarksListing").append(html);
			}, 0);

			window.setTimeout(function () {
				var emphasiser = new Emphasiser($("#bookmarksListing")),
					stemmedWords = lunr.tokenizer(searchTerm).map(function (searchWord) {
					return lunr.stemmer(searchWord);
				}).filter(function (searchWord) {
					return "" !== searchWord;
				});

				emphasiser.emphasise(stemmedWords);
			}, 0);

		});
		$("#bookmarksListing").on("click", ".openLink", function (event) {
			var url = $(this).attr("href");
			chrome.tabs.create({
				url: url
			});
		});

		$("#searchTermInput").focus();
	});
});
