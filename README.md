# House Price Index API  
### regions    
Date  RegionName  AreaCode 
 AveragePrice  housePriceIndex  IndexSA  OneMonthChange  TwelveMonthChange  AveragePriceSA  SalesVolume 

DetachedPrice  DetachedIndex  DetachedOneMonthChange  DetachedTwelveMonthChange  
SemiDetachedPrice  SemiDetachedIndex  SemiDetachedOneMonthChange  SemiDetachedTwelveMonthChange  
TerracedPrice  TerracedIndex  TerracedOneMonthChange  TerracedTwelveMonthChange  
FlatPrice  FlatIndex  FlatOneMonthChange  FlatTwelveMonthChange  
CashPrice  CashIndex  CashOneMonthChange  CashTwelveMonthChange  CashSalesVolume  
MortgagePrice  MortgageIndex  MortgageOneMonthChange  MortgageTwelveMonthChange  MortgageSalesVolume
FTBPrice  FTBIndex  FTBOneMonthChange  FTBTwelveMonthChange  
FOOPrice  FOOIndex  FOOOneMonthChange  FOOTwelveMonthChange  
NewPrice  NewIndex  NewOneMonthChange  NewTwelveMonthChange  NewSalesVolume  
OldPrice  OldIndex  OldOneMonthChange  OldTwelveMonthChange  OldSalesVolume

maxDate 
minDate
RegionName 
AreaCode
houseType ["Detached", "SemiDetached", "Terraced", "Flat", "New", "Old"]
purchaseType ["Cash", "Mortgage", "FTB", "FOO"]
startId
limit
```SQL
CREATE TABLE `main` (
  `Date` date DEFAULT NULL,
  `RegionName` varchar(254) DEFAULT NULL,
  `AreaCode` varchar(90) DEFAULT NULL,
  `AveragePrice` double DEFAULT NULL,
  `housePriceIndex` double DEFAULT NULL,
  `IndexSA` double DEFAULT NULL,
  `OneMonthChange` double DEFAULT NULL,
  `TwelveMonthChange` double DEFAULT NULL,
  `AveragePriceSA` double DEFAULT NULL,
  `SalesVolume` double DEFAULT NULL,
  `DetachedPrice` double DEFAULT NULL,
  `DetachedIndex` double DEFAULT NULL,
  `DetachedOneMonthChange` double DEFAULT NULL,
  `DetachedTwelveMonthChange` double DEFAULT NULL,
  `SemiDetachedPrice` double DEFAULT NULL,
  `SemiDetachedIndex` double DEFAULT NULL,
  `SemiDetachedOneMonthChange` double DEFAULT NULL,
  `SemiDetachedTwelveMonthChange` double DEFAULT NULL,
  `TerracedPrice` double DEFAULT NULL,
  `TerracedIndex` double DEFAULT NULL,
  `TerracedOneMonthChange` double DEFAULT NULL,
  `TerracedTwelveMonthChange` double DEFAULT NULL,
  `FlatPrice` double DEFAULT NULL,
  `FlatIndex` double DEFAULT NULL,
  `FlatOneMonthChange` double DEFAULT NULL,
  `FlatTwelveMonthChange` double DEFAULT NULL,
  `CashPrice` double DEFAULT NULL,
  `CashIndex` double DEFAULT NULL,
  `CashOneMonthChange` double DEFAULT NULL,
  `CashTwelveMonthChange` double DEFAULT NULL,
  `CashSalesVolume` double DEFAULT NULL,
  `MortgagePrice` double DEFAULT NULL,
  `MortgageIndex` double DEFAULT NULL,
  `MortgageOneMonthChange` double DEFAULT NULL,
  `MortgageTwelveMonthChange` double DEFAULT NULL,
  `MortgageSalesVolume` double DEFAULT NULL,
  `FTBPrice` double DEFAULT NULL,
  `FTBIndex` double DEFAULT NULL,
  `FTBOneMonthChange` double DEFAULT NULL,
  `FTBTwelveMonthChange` double DEFAULT NULL,
  `FOOPrice` double DEFAULT NULL,
  `FOOIndex` double DEFAULT NULL,
  `FOOOneMonthChange` double DEFAULT NULL,
  `FOOTwelveMonthChange` double DEFAULT NULL,
  `NewPrice` double DEFAULT NULL,
  `NewIndex` double DEFAULT NULL,
  `NewOneMonthChange` double DEFAULT NULL,
  `NewTwelveMonthChange` double DEFAULT NULL,
  `NewSalesVolume` double DEFAULT NULL,
  `OldPrice` double DEFAULT NULL,
  `OldIndex` double DEFAULT NULL,
  `OldOneMonthChange` double DEFAULT NULL,
  `OldTwelveMonthChange` double DEFAULT NULL,
  `OldSalesVolume` varchar(256) DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=129007 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

```
{
  resource: '/regions',
  path: '/regions',
  httpMethod: 'GET',
  headers: {
    Accept: '*/*',
    'CloudFront-Forwarded-Proto': 'https',
    'CloudFront-Is-Desktop-Viewer': 'true',
    'CloudFront-Is-Mobile-Viewer': 'false',
    'CloudFront-Is-SmartTV-Viewer': 'false',
    'CloudFront-Is-Tablet-Viewer': 'false',
    'CloudFront-Viewer-Country': 'GB',
    Host: '4zewqbqfgb.execute-api.eu-west-2.amazonaws.com',
    'User-Agent': 'curl/7.55.1',
    Via: '1.1 6399f745d7f0d608198c8dc9954f16b3.cloudfront.net (CloudFront)',
    'X-Amz-Cf-Id': 'PmzzLxf_KVwkK1_jnVVbSTkox_Ztx4g03ZZdEhPGiPSeBhxDxknmTw==',
    'X-Amzn-Trace-Id': 'Root=1-5ef8e582-994527d2325a0a943f07f8ec',
    'X-Forwarded-For': '92.7.26.45, 64.252.166.96',
    'X-Forwarded-Port': '443',
    'X-Forwarded-Proto': 'https'
  },
  multiValueHeaders: {
    Accept: [ '*/*' ],
    'CloudFront-Forwarded-Proto': [ 'https' ],
    'CloudFront-Is-Desktop-Viewer': [ 'true' ],
    'CloudFront-Is-Mobile-Viewer': [ 'false' ],
    'CloudFront-Is-SmartTV-Viewer': [ 'false' ],
    'CloudFront-Is-Tablet-Viewer': [ 'false' ],
    'CloudFront-Viewer-Country': [ 'GB' ],
    Host: [ '4zewqbqfgb.execute-api.eu-west-2.amazonaws.com' ],
    'User-Agent': [ 'curl/7.55.1' ],
    Via: [
      '1.1 6399f745d7f0d608198c8dc9954f16b3.cloudfront.net (CloudFront)'
    ],
    'X-Amz-Cf-Id': [ 'PmzzLxf_KVwkK1_jnVVbSTkox_Ztx4g03ZZdEhPGiPSeBhxDxknmTw==' ],
    'X-Amzn-Trace-Id': [ 'Root=1-5ef8e582-994527d2325a0a943f07f8ec' ],
    'X-Forwarded-For': [ '92.7.26.45, 64.252.166.96' ],
    'X-Forwarded-Port': [ '443' ],
    'X-Forwarded-Proto': [ 'https' ]
  },
  queryStringParameters: { jjj: 'll' },
  multiValueQueryStringParameters: { jjj: [ 'll' ] },
  pathParameters: null,
  stageVariables: null,
  requestContext: {
    resourceId: 'woz5lj',
    resourcePath: '/regions',
    httpMethod: 'GET',
    extendedRequestId: 'O2jMXHVCrPEFlsw=',
    requestTime: '28/Jun/2020:18:46:26 +0000',
    path: '/prod/regions',
    accountId: '040684591284',
    protocol: 'HTTP/1.1',
    stage: 'prod',
    domainPrefix: '4zewqbqfgb',
    requestTimeEpoch: 1593369986269,
    requestId: 'e2d8f944-88a6-4f22-84ab-777de829d2d4',
    identity: {
      cognitoIdentityPoolId: null,
      accountId: null,
      cognitoIdentityId: null,
      caller: null,
      sourceIp: '92.7.26.45',
      principalOrgId: null,
      accessKey: null,
      cognitoAuthenticationType: null,
      cognitoAuthenticationProvider: null,
      userArn: null,
      userAgent: 'curl/7.55.1',
      user: null
    },
    domainName: '4zewqbqfgb.execute-api.eu-west-2.amazonaws.com',
    apiId: '4zewqbqfgb'
  },
  body: null,
  isBase64Encoded: false
}