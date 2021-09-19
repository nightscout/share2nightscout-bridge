const should = require("should");
const accountName = process.env["DEXCOM_ACCOUNT_NAME"]
const password = process.env["DEXCOM_PASSWORD"]

describe("authorize", () => {
	it("should succeed and return a session ID when called with valid credentials", done => {
		const engine = require("../index.js");
		engine.authorize(
			{
				password: password,
				applicationId: "d89443d2-327c-4a6f-89e5-496bbb0317db",
				accountName: accountName
			},
			(error, response, body) => {
				response.statusCode.should.equal(200);
				body.should
					.be.an.instanceOf(String)
					.and.have.property("length", 36);
				done(error);
			}
		)
	});

	it("should return expected error when called with invalid credentials", done => {
		const engine = require("../index.js");
		engine.authorize(
			{
				password: "notarealpassword",
				applicationId: "d89443d2-327c-4a6f-89e5-496bbb0317db",
				accountName: "hopefullynotarealaccountname"
			},
			(error, response, body) => {
				response.statusCode.should.equal(500);
				body.should
					.be.an.instanceOf(Object)
					.and.have.property("Code", "SSO_AuthenticatePasswordInvalid");
				done(error);
			}

		);
	});
});
