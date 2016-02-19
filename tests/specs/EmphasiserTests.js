/* global expect */

define([
	"Emphasiser"
], function (Emphasiser) {

	describe("Emphasiser", function () {
		it("should emphasise text in a table", function () {
			var testRow = document.createElement("tr"),
				rowHtml = '<td class="emphasisable">dog</td><td class="emphasisable">DOGs</td>',
				expectedEmphasisedRowHtml = '<td class="emphasisable">d<span class="emphasised">og</span></td>' +
				'<td class="emphasisable">D<span class="emphasised">OG</span>s</td>',
				emphasiser;

			testRow.innerHTML = rowHtml;
			emphasiser = new Emphasiser(testRow);

			// check it emphasises correctly
			emphasiser.emphasise("og");
			expect(testRow.innerHTML).toBe(expectedEmphasisedRowHtml);

			// check it correctly resets emphasis and is case insensitive
			emphasiser.emphasise("oG");
			expect(testRow.innerHTML).toBe(expectedEmphasisedRowHtml);

			// check it correctly resets emphasis and is case insensitive
			emphasiser.emphasise("");
			expect(testRow.innerHTML).toBe(rowHtml);


		});

		it("should escape the emphasis term", function () {
			var testRow = document.createElement("tr"),
				rowHtml = '<td class="emphasisable">books &amp; cds</td>',
				emphasiser = new Emphasiser(testRow);

			testRow.innerHTML = rowHtml;
			emphasiser.emphasise("books & cd");

			expect(testRow.innerHTML).toBe('<td class="emphasisable"><span class="emphasised">books &amp; cd</span>s</td>');
		});

		it("should skip when there is no emphasis term", function () {
			var testRow = document.createElement("tr"),
				rowHtml = '<td class="emphasisable">books &amp; cds</td>',
				emphasiser = new Emphasiser(testRow);


			testRow.innerHTML = rowHtml;
			emphasiser.emphasise("");

			expect(testRow.innerHTML).toBe('<td class="emphasisable">books &amp; cds</td>');
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

