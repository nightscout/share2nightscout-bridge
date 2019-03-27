const should = require('should');
const accountName = process.env["DEXCOM_ACCOUNT_NAME"]
const password = process.env["DEXCOM_PASSWORD"]

describe("fetch", () => {
	let engine, sessionID;

	before(done => {
		engine = require("../index.js");
		engine.authorize(
			{
				password: password,
				applicationId: "d89443d2-327c-4a6f-89e5-496bbb0317db",
				accountName: accountName
			},
			(error, response, body) => {
				sessionID = body;
				done(error);
			}
		)
	});

	it("should return a list of recent entries when called with valid session id", done => {
		const maxCount = 5;
		engine.fetch(
			{
				sessionID,
				maxCount
			},
			(error, response, body) => {
				response.statusCode.should.equal(200);
				body.should
					.be.an.instanceOf(Array)
					.and.have.lengthOf(maxCount);
				done(error);
			}
		);
	});

	it("should return Bad Request response when called with invalid session id", done => {
		engine.fetch(
			{
				sessionID: "bad-session-id"
			},
			(error, response, body) => {
				response.statusCode.should.equal(400);
				done(error);
			}
		);		
	});
});