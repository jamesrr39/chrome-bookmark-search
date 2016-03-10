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
			 * @param {string} emphasiseTerm search term
			 */
			emphasise: function (emphasiseTerm) {
				// split into a list of text nodes
				// iterate through each node, and replace any instances of string with a span and the text
				var textNodes,
					node,
					nodeOriginalText,
					html;

				textNodes = $container.find(".emphasisable");

				for (var i = 0; i < textNodes.length; i++) {
					node = textNodes[i];
					nodeOriginalText = node.innerText;
					html = this._replaceAll(nodeOriginalText, emphasiseTerm, '<span class="emphasised">', '</span>');
					node.innerHTML = html;
				}
			}
		};

	};

});
