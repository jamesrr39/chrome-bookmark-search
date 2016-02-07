/**
 * adds a class to text to emphase it
 * @returns {Function}
 */
define([
	"jquery"
], function ($) {

	var entityMap = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': '&quot;',
		"'": '&#39;',
		"/": '&#x2F;'
	};

	function escapeHtml(string) {
		return String(string).replace(/[&<>"'\/]/g, function (s) {
			return entityMap[s];
		});
	}

	return function (container) {
		var $container = $(container);

		return {
			emphasise: function (emphasiseTerm) {
				// split into a list of text nodes
				// iterate through each node, and replace any instances of string with a span and the text
				var textNodes = $container.find("*"),
					node,
					nodeOriginalText,
					html,
					escapedEmphasisTerm = $("<div/>").text(emphasiseTerm).html();

				for (var i = 0; i < textNodes.length; i++) {
					node = textNodes[i];
					nodeOriginalText = node.innerText;
					html = nodeOriginalText.split(emphasiseTerm).join("<span class='emphasised'>" + escapedEmphasisTerm + "</span>");
					node.innerHTML = html;
				}
			}
		};

	};

});
