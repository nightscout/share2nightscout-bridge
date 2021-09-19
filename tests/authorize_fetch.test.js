const should = require("should");
const accountName = process.env["DEXCOM_ACCOUNT_NAME"]
const password = process.env["DEXCOM_PASSWORD"]

describe("authorize_fetch", () => {
	it("should return a list of recent entries when called with valid credentials", done => {
		const engine = require("../index.js");
		const maxCount = 3;
		engine.authorize_fetch(
			{
				login: {
					password: password,
					applicationId: "d89443d2-327c-4a6f-89e5-496bbb0317db",
					accountName: accountName
				},
				fetch: {
					maxCount: 3
				}
			},
			(error, glucose) => {
				glucose.should
					.be.an.instanceOf(Array)
					.and.have.lengthOf(maxCount);

				glucose[0].should
					.be.an.instanceOf(Object);
				glucose[0].DT.should.be.a.String().and.containEql("Date");
				glucose[0].ST.should.be.a.String().and.containEql("Date");
				glucose[0].Trend.should.be.a.Number();
				glucose[0].Value.should.be.a.Number();
				glucose[0].WT.should.be.a.String().and.containEql("Date");

				done(error);
			}
		)
	});

	it("should return an error when called with invalid credentials", done => {
		const engine = require("../index.js");
		engine.authorize_fetch(
			{
				login: {
					password: "notarealpassword",
					applicationId: "d89443d2-327c-4a6f-89e5-496bbb0317db",
					accountName: "notarealaccountnameisurehope"
				},
				fetch: {}
			},
			(error, glucose) => {
				glucose.should
					.be.an.instanceOf(String)
					.and.containEql("Forbidden");
				done(error);
			}
		)
	});
});
