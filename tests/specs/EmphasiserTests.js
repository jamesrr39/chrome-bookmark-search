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
	});

});

