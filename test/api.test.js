const lambda = require('../lambdas/getRegionsLambda/app');
const log = require('why-is-node-running');
process.env.localTest = true
describe('Test getRegionsLambda', function () {
    it('Verifies successful response', async done => {
        const result = await lambda.handler();
        expect(result[0]).toEqual({"RegionName": "Aberdeenshire"});
        done()
    });
});