/**
 * adds a class to text to emphase it
 * @returns {Function}
 */
define([
	"jquery"
], function ($) {

	/**
	 *
	 * @param {HTMLElement} container
	 * @returns {object} instance of <code>Emphasiser</code>
	 */
	return function (container) {
		var $container = $(container);

		return {
			/**
			 * Case insensitive search for needle in haystack
			 * Visible for testing
			 * @param {string} haystack
			 * @param {string} needle
			 * @returns {number[]} Array of needle occurence indexes in haystack
			 */
			_indexesOf: function (haystack, needle) {
				var indexes = [],
					currentIndex = -1;

				while (true) {
					currentIndex = haystack.toUpperCase().indexOf(needle.toUpperCase(), currentIndex + 1);
					if (currentIndex === -1) {
						return indexes;
					} else {
						indexes.push(currentIndex);
					}
				}
			},
			/**
			 * Case insensitive replaceAll
			 * @param {string} haystack original string
			 * @param {string} needle replacement
			 * @param {string} [insertBefore] string to insert before needle
			 * @param {string} [insertAfter] string to insert after needle
			 * @returns {string} modified string with replacements
			 */
			_replaceAll: function (haystack, needle, insertBefore, insertAfter) {
				var indexesOfReplacement,
					currentIndexInString;

				if (!needle) {
					return haystack;
				}

				indexesOfReplacement = this._indexesOf(haystack, needle);

				insertBefore = insertBefore || "";
				insertAfter = insertAfter || "";

				for (var positionInIndexes = indexesOfReplacement.length - 1; positionInIndexes >= 0; positionInIndexes--) {
					currentIndexInString = indexesOfReplacement[positionInIndexes];
					haystack = haystack.slice(0, currentIndexInString) +
						insertBefore +
						haystack.slice(currentIndexInString, currentIndexInString + needle.length) +
						insertAfter +
						haystack.slice(currentIndexInString + needle.length);
				}
				return haystack;

			},
			/**
			 *
			 * @param {string|string[]} emphasiseTerms search term
			 */
			emphasise: function (emphasiseTerms) {
				var textNodes,
					node,
					html,
					indexesOfTerm,
					indexMapper = function (indexOfTerm) {
						return {
							start: indexOfTerm,
							end: indexOfTerm + term.length
						};
					};

				if ("object" !== typeof emphasiseTerms) {
					// if it's a string/number
					emphasiseTerms = [emphasiseTerms + ""];
				}

				// remove previously added emphasised nodes
				$container.remove(".emphasised");

				// split into a list of text nodes
				textNodes = $container.find(".emphasisable");

				// iterate through each node, and replace any instances of string with a span and the text
				for (var i = 0; i < textNodes.length; i++) {
					indexesOfTerm = [];
					node = textNodes[i];
					html = node.innerText;
					for (var j = 0; j < emphasiseTerms.length; j++) {
						var term = emphasiseTerms[j];
						// escape empty string
						if ("" === term) {
							continue;
						}
						indexesOfTerm = indexesOfTerm
							.concat(this._indexesOf(html, term)
								.map(indexMapper));
					}

					// sort by end desc
					indexesOfTerm.sort(function (a, b) {
						return  b.end - a.end;
					});

					// remove overlaps
					for (var k = 0; k < indexesOfTerm.length; k++) {
						while (indexesOfTerm[k + 1] && indexesOfTerm[k].start < indexesOfTerm[k + 1].end) {
							if (indexesOfTerm[k].start > indexesOfTerm[k + 1].start) {
								indexesOfTerm[k].start = indexesOfTerm[k + 1].start;
							}
							indexesOfTerm.splice(k + 1, 1);
						}
					}
					for (var l = 0; l < indexesOfTerm.length; l++) {
						html = html.substr(0, indexesOfTerm[l].end) + '</span>' + html.substr(indexesOfTerm[l].end);
						html = html.substr(0, indexesOfTerm[l].start) + '<span class="emphasised">' + html.substr(indexesOfTerm[l].start);
					}

					node.innerHTML = html;
				}
			}
		};

	};

});
