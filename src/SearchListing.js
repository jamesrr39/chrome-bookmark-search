define([
	"./lunr",
	"mustache",
	"text!./bookmarkTemplate.html",
	"./Emphasiser"
], function (lunr, Mustache, bookmarkTemplate, Emphasiser) {

	var ResultType = {
		SEARCH_RESULT: {
			cssClass: "searchResult",
			name: "Search Result"
		},
		FILTER_RESULT: {
			cssClass: "filterResult",
			name: "Filter Result"
		}
	};

	function buildBookmarkHtml(bookmark, score, rowType) {
		var indexOfProtocolEnd = bookmark.url.indexOf("://"),
				siteUrl = (indexOfProtocolEnd === -1) ? bookmark.url.substring(0, bookmark.url.indexOf("/")) : bookmark.url.substring(0, bookmark.url.indexOf("/", indexOfProtocolEnd + 3));

		var dateAdded = new Date(bookmark.dateAdded),
				monthStr = (dateAdded.getMonth() + 1) + "",
				dateStr = dateAdded.getDate() + "";

		while (monthStr.length < 2) {
			monthStr = "0" + monthStr;
		}
		while (dateStr.length < 2) {
			dateStr = "0" + dateStr;
		}

		const faviconUrl = new URL(chrome.runtime.getURL("/_favicon/"));
		faviconUrl.searchParams.set("pageUrl", siteUrl);
		faviconUrl.searchParams.set("size", "24");

		return Mustache.render(bookmarkTemplate, {
			url: bookmark.url,
			title: bookmark.title,
			score: score,
			faviconUrl: faviconUrl.toString(),
			rowClass: rowType.cssClass,
			folders: bookmark.folders,
			resultTypeName: rowType.name,
			dateAdded: dateAdded.getFullYear() + "-" + monthStr + "-" + dateStr
		});
	}

	return {
		buildHtmlFromSearch: function (searchTerm, searchIndex, bookmarks) {

			var searchResults = searchIndex.search(searchTerm),
					searchResultsAsMap = {};

			searchResults.forEach(function (result) {
				var bookmark = bookmarks.asMap()[result.ref];

				searchResultsAsMap[bookmark.url] = bookmark;
			});

			var filterTerms = lunr.tokenizer(searchTerm).map(function (filterTerm) {
				return filterTerm.toUpperCase();
			});

			var searchResultsHtml = searchResults.map(function (result) {
				var bookmark = bookmarks.asMap()[result.ref];

				searchResultsAsMap[bookmark.url] = bookmark;

				return buildBookmarkHtml(bookmark, result.score, ResultType.SEARCH_RESULT);

			}).join("");

			var filterResults = bookmarks.asList().filter(function (bookmark) {
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

			var filterResultsHtml = filterResults.map(function (bookmark) {
				return buildBookmarkHtml(bookmark, 0, ResultType.FILTER_RESULT);
			}).join("");

			$("#bookmarksListing").html(searchResultsHtml + filterResultsHtml);

			// emphasise
			var emphasiser = new Emphasiser($("#bookmarksListing")),
					stemmedWords = lunr.tokenizer(searchTerm).map(function (searchWord) {
				return lunr.stemmer(searchWord);
			}).filter(function (searchWord) {
				return "" !== searchWord;
			});

			emphasiser.emphasise(stemmedWords);
		}
	};

});

