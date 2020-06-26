const lambda = require('../lambdas/getRegionsLambda/app');

describe('Test getRegionsLambda', function () {
    it('Verifies successful response', async () => {
        const result = await lambda.handler();
        expect(result[0]).toEqual("Aberdeenshire");
    });
});
