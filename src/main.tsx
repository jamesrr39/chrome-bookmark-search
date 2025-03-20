/*jshint scripturl:true*/

/* global chrome */
import lunr from 'lunr';
import { render } from 'preact'
import { debounceLater } from './Debouncer';
import { fetchBookmarks } from './ChromeBookmarksCollection'


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

	var debouncedSearch = debounceLater(SearchListing.buildHtmlFromSearch, 200);

// 	var bookmarks = fetchBookmarks
// 	bookmarks.fetch(function () {

// 		$("#bookmarksListing").on("click", ".more", function (event) {
// 			event.preventDefault();

// 			$(event.currentTarget).closest(".result").find(".more-info").toggleClass("hidden");
// 		});

// 		$("#searchTermInput").keyup(function () {
// 			var searchTerm = this.value;

// 			debouncedSearch(searchTerm, searchIndex, bookmarks);
// 		});

// 		$("#searchTermInput").focus();
// 	});
// });

function App() {

	return (
		<div>Hello Preact</div>
	)
}

render(<App />, document.getElementById('app')!)
