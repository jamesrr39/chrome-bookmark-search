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
	"./ChromeBookmarksCollection",
	"./Debouncer",
	"jquery",
	"lunr",
	"./SearchListing"
], function (BookmarksCollection, Debouncer, $, lunr, SearchListing) {

	// add fields to index on, with arbitary weights
	var searchIndex = lunr(function () {
		this.field("url", {
			boost: 10
		});
		this.field("title", {
			boost: 5
		});
		this.field("folders", {
			boost: 3
		});
		this.ref("url");
	});

	var debouncedSearch = Debouncer.debounceLater(SearchListing.buildHtmlFromSearch, 200);

	var bookmarks = new BookmarksCollection(searchIndex);
	bookmarks.fetch(function () {

		$("#bookmarksListing").on("click", ".more", function (event) {
			event.preventDefault();

			$(event.currentTarget).closest(".result").find(".more-info").toggleClass("hidden");
		});

		$("#searchTermInput").keyup(function () {
			var searchTerm = this.value;

			debouncedSearch(searchTerm, searchIndex, bookmarks);
		});

		$("#searchTermInput").focus();
	});
});
