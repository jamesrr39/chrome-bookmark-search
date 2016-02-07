define([
	"Emphasiser"
], function (Emphasiser) {

	describe("Emphasiser", function () {
		it("should emphasise text in a table", function () {
			var testRow = document.createElement("tr"),
				rowHtml = "<td>abc</td><td>b ab</td>",
				expectedEmphasisedRowHtml = '<td><span class="emphasised">ab</span>c</td><td>b <span class="emphasised">ab</span></td>',
				emphasiser = new Emphasiser(testRow);

			testRow.innerHTML = rowHtml;

			// check it emphasises correctly
			emphasiser.emphasise("ab");
			expect(testRow.innerHTML).toBe(expectedEmphasisedRowHtml);

			// check it correctly resets emphasis
			emphasiser.emphasise("ab");
			expect(testRow.innerHTML).toBe(expectedEmphasisedRowHtml);

		});

		it("should escape the emphasis term", function () {
			var testRow = document.createElement("tr"),
				rowHtml = "<td>books &amp; cds</td>",
				emphasiser = new Emphasiser(testRow);

			testRow.innerHTML = rowHtml;
			emphasiser.emphasise("books & cd");

			expect(testRow.innerHTML).toBe('<td><span class="emphasised">books &amp; cd</span>s</td>');
		});
	});

});

