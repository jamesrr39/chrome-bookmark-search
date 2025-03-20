
/**
 *
 * @param {HTMLElement} container
 * @returns {object} instance of <code>Emphasiser</code>
 */
class Emphasiser {
	constructor(private readonly container: HTMLElement) { }
	// var $container = $(container);

	/**
	 * Case insensitive search for needle in haystack
	 * Visible for testing
	 * @param {string} haystack
	 * @param {string} needle
	 * @returns {number[]} Array of needle occurence indexes in haystack
	 */
	private _indexesOf(haystack: string, needle: string) {
		var indexes: number[] = [],
			currentIndex = -1;

		while (true) {
			currentIndex = haystack.toUpperCase().indexOf(needle.toUpperCase(), currentIndex + 1);
			if (currentIndex === -1) {
				return indexes;
			} else {
				indexes.push(currentIndex);
			}
		}
	}
	/**
	 * Case insensitive replaceAll
	 * @param {string} haystack original string
	 * @param {string} needle replacement
	 * @param {string} [insertBefore] string to insert before needle
	 * @param {string} [insertAfter] string to insert after needle
	 * @returns {string} modified string with replacements
	 */
	private _replaceAll(haystack: string, needle: string, insertBefore: string, insertAfter: string) {
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

	}
	/**
	 *
	 * @param {string[]} emphasiseTerms search term
	 */
	public emphasise(emphasiseTerms: string[]) {
		var node,
			html;

		type IndexOfTerm = { start: number, end: number }

		let indexesOfTerm: IndexOfTerm[] = [];


		const indexMapper = function (indexOfTerm: number) {
			return {
				start: indexOfTerm,
				end: indexOfTerm + term.length
			};
		};

		// remove previously added emphasised nodes
		this.container.querySelectorAll(".emphasised").forEach(el => el.remove())


		// split into a list of text nodes
		const textNodes = this.container.querySelectorAll(".emphasisable");

		// iterate through each node, and replace any instances of string with a span and the text
		for (var i = 0; i < textNodes.length; i++) {
			node = textNodes[i];

			html = node.innerHTML;
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
				return b.end - a.end;
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
				html = html.substring(0, indexesOfTerm[l].end) + '</span>' + html.substr(indexesOfTerm[l].end);
				html = html.substring(0, indexesOfTerm[l].start) + '<span class="emphasised">' + html.substr(indexesOfTerm[l].start);
			}

			node.innerHTML = html;
		}
	}
};
