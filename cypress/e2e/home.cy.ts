describe("search bar", () => {
	const search = "ab";
	const matrix = "The Matrix";

	beforeEach(() => {
		cy.visit("/");
		cy.get("#formMovieSearch").should("be.visible");
	});

	it("should not allow a search without a title", () => {
		cy.get('[type="submit"]').click();
		cy.get('[role="alert"]').should("exist");
		cy.get(".alert-heading")
			.should("be.visible")
			.contains("Aww, that's cute");
		cy.get("p")
			.should("be.visible")
			.contains("You tried to search, good for you! 👀");
	});

	it("should not allow a search without a title that contains at least 3 chars", () => {
		cy.get("#formMovieSearch").type(search);
		cy.get('[type="submit"]').click();
		cy.get('[role="alert"]').should("exist");
		cy.get(".alert-heading")
			.should("be.visible")
			.contains("Wow, that was stupid");
		cy.get("p")
			.should("be.visible")
			.contains(
				"Search query must be at least 3 characters long, duh ^^ 🙄"
			);
	});

	it("allows a search for 'The Matrix' and get X hits", () => {
		cy.get("#formMovieSearch").type(matrix);
		cy.get('[type="submit"]').click();
		cy.get(".movie-list").should("exist");
		cy.wait(500);
		cy.get(".movie-list").children().its("length").should("be.gt", 0);
	});

	it("show loading spinner while searching", () => {
		cy.get("#formMovieSearch").type(matrix);
		cy.get('[type="submit"]').click();
		cy.get("#loading-wrapper > .my-5").should("be.visible");
	});

	it("should click on the first hit and land on a page with the movie's id in the URL", () => {
		cy.get("#formMovieSearch").type(matrix);
		cy.get('[type="submit"]').click();
		cy.get("#loading-wrapper > .my-5").should("be.visible");

		cy.get(".movie-list-item div")
			.first()
			.invoke("attr", "data-imdb-id")
			.then((movieId) => {
				cy.get(".movie-list-item [href]").first().click();
				cy.wait(500);
				cy.location("pathname").should("equal", "/movies/" + movieId);
			});

		cy.get("#loading-wrapper > .my-5").should("not.exist");
	});
});
