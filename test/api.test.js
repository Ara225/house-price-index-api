const getRegionsLambda = require('../lambdas/getRegionsLambda/app');
const getAreaCodesLambda = require('../lambdas/getAreaCodesLambda/app');

process.env.localTest = true
describe('Test getRegionsLambda', function () {
    it('Verifies successful response', async done => {
        const result = await getRegionsLambda.handler();
        expect(JSON.parse(result.body)[0]).toEqual("Aberdeenshire");
        done()
    });
});
describe('Test getAreaCodesLambda', function () {
    it('Verifies successful response', async done => {
        const result = await getAreaCodesLambda.handler();
        expect(JSON.parse(result.body)[0]).toEqual("S12000034");
        done()
    });
});