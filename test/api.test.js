const getRegionsLambda = require('../lambdas/getRegionsLambda/app');
const getAreaCodesLambda = require('../lambdas/getAreaCodesLambda/app');
const getHousePricesLambda = require('../lambdas/getHousePricesLambda/app');


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
describe('Test getHousePricesLambda', function () {
    it('Verifies successful response', async done => {
        const result = await getHousePricesLambda.handler({multiValueQueryStringParameters: null});
        expect(JSON.parse(result.body)[0].AreaCode).toEqual("S12000034");
        done()
    });
});

describe('Test getHousePricesLambda2', function () {
    it('Verifies successful response', async done => {
        const result = await getHousePricesLambda.handler({multiValueQueryStringParameters: {startId: 3, limit: 2}});
        expect(JSON.parse(result.body)[0].AreaCode).toEqual("S12000034");
        done()
    });
});
describe('Test getHousePricesLambda3', function () {
    it('Verifies successful response', async done => {
        const result = await getHousePricesLambda.handler({multiValueQueryStringParameters: {limit: 2}});
        expect(JSON.parse(result.body)[0].AreaCode).toEqual("S12000034");
        done()
    });
});

describe('Test getHousePricesLambda4', function () {
    it('Verifies successful response', async done => {
        const result = await getHousePricesLambda.handler({multiValueQueryStringParameters: {startId: 3}});
        expect(JSON.parse(result.body)[0].AreaCode).toEqual("S12000034");
        expect(JSON.parse(result.body)[0].id).toEqual(4);
        done()
    });
});

describe('Test getHousePricesLambda5', function () {
    it('Verifies successful response', async done => {
        const result = await getHousePricesLambda.handler({multiValueQueryStringParameters: {houseType: ["Flat"]}});
        expect(JSON.parse(result.body)[0].AreaCode).toEqual("S12000034");
        done()
    });
});

describe('Test getHousePricesLambda6', function () {
    it('Verifies successful response', async done => {
        const result = await getHousePricesLambda.handler({multiValueQueryStringParameters: {minDate: ["2004-03-01"]}});
        expect(JSON.parse(result.body)[0].AreaCode).toEqual("S12000034");
        done()
    });
});