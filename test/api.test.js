const lambda = require('../lambdas/getRegionsLambda/app');
process.env.localTest = true
describe('Test getRegionsLambda', function () {
    it('Verifies successful response', async done => {
        const result = await lambda.handler();
        expect(JSON.parse(result.body)[0]).toEqual("Aberdeenshire");
        done()
    });
});