/* global expect */

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

	describe("emphasiser._indexesOf", function () {
		it("should get the correct indexes", function () {
			var emphasiser = new Emphasiser();
			expect(emphasiser._indexesOf("dog cat dog", "dog")).toEqual([0, 8]);
			expect(emphasiser._indexesOf("cat dog", "dog")).toEqual([4]);
			expect(emphasiser._indexesOf("dog cat dog", "car")).toEqual([]);
		});
	});

	describe("emphasiser._replaceAll", function () {
		it("should replace correctly", function () {
			var emphasiser = new Emphasiser();
			expect(emphasiser._replaceAll("dog cat dog", "dog", "<span class='emphasise'>", "</span>")).toBe("<span class='emphasise'>dog</span> cat <span class='emphasise'>dog</span>");
			expect(emphasiser._replaceAll("dog cat dog", "dOG", "<span class='emphasise'>", "</span>")).toBe("<span class='emphasise'>dog</span> cat <span class='emphasise'>dog</span>");
		});
	});

});

