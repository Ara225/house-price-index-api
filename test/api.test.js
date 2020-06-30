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
describe('Test getHousePricesLambda without queryString', function () {
    it('Verifies successful response', async done => {
        const result = await getHousePricesLambda.handler({multiValueQueryStringParameters: null});
        expect(JSON.parse(result.body)[0].AreaCode).toEqual("S12000034");
        expect(JSON.parse(result.body)[0].id).toEqual(1);
        done()
    });
});

describe('Test getHousePricesLambda with start Id and limit', function () {
    it('Verifies successful response', async done => {
        const result = await getHousePricesLambda.handler({multiValueQueryStringParameters: {startFromId: 3, limit: 2}});
        expect(JSON.parse(result.body)[0].AreaCode).toEqual("S12000034");
        done()
    });
});
describe('Test getHousePricesLambda with limit', function () {
    it('Verifies successful response', async done => {
        const result = await getHousePricesLambda.handler({multiValueQueryStringParameters: {limit: 2}});
        expect(JSON.parse(result.body)[0].AreaCode).toEqual("S12000034");
        done()
    });
});

describe('Test getHousePricesLambda with startFromId', function () {
    it('Verifies successful response', async done => {
        const result = await getHousePricesLambda.handler({multiValueQueryStringParameters: {startFromId: 3}});
        expect(JSON.parse(result.body)[0].AreaCode).toEqual("S12000034");
        expect(JSON.parse(result.body)[0].id).toEqual(4);
        done()
    });
});

describe('Test getHousePricesLambda with houseType param', function () {
    it('Verifies successful response', async done => {
        const result = await getHousePricesLambda.handler({multiValueQueryStringParameters: {houseType: ["Flat"]}});
        expect(JSON.parse(result.body)[0].AreaCode).toEqual("S12000034");
        expect(JSON.parse(result.body)[0].id).toEqual(1);
        expect(JSON.parse(result.body)[0].FlatPrice).toEqual(48016.07412);
        done()
    });
});

describe('Test getHousePricesLambda with purchaseType param', function () {
    it('Verifies successful response', async done => {
        const result = await getHousePricesLambda.handler({multiValueQueryStringParameters: {purchaseType: ["Cash"], startFromId: 96}});
        expect(JSON.parse(result.body)[0].AreaCode).toEqual("S12000034");
        expect(JSON.parse(result.body)[0].id).toEqual(97);
        expect(JSON.parse(result.body)[0].CashPrice).toEqual(163673.821);
        done()
    });
});

describe('Test getHousePricesLambda with min date', function () {
    it('Verifies successful response', async done => {
        const result = await getHousePricesLambda.handler({multiValueQueryStringParameters: {minDate: ["2004-03-01"]}});
        expect(JSON.parse(result.body)[0].AreaCode).toEqual("S12000034");
        expect(JSON.parse(result.body)[0].id).toEqual(4);
        done()
    });
});

describe('Test getHousePricesLambda with max date', function () {
    it('Verifies successful response', async done => {
        const result = await getHousePricesLambda.handler({multiValueQueryStringParameters: {maxDate: ["2004-03-01"]}});
        expect(JSON.parse(result.body)[0].AreaCode).toEqual("S12000034");
        expect(JSON.parse(result.body)[0].id).toEqual(1);
        done()
    });
});

describe('Test getHousePricesLambda with invalid limit', function () {
    it('Verifies successful response', async done => {
        const result = await getHousePricesLambda.handler({multiValueQueryStringParameters: {limit: 1000}});
        expect(JSON.parse(result.body).error).toEqual('Error: Limit was over 100, unable to process query');
        done()
    });
});