# House Price Index API  
## Overview
A small project with the goal of making an API for the UK's House Price Index. The choice of dataset is mostly random: I just wanted a real life dataset to practice building an API around. It's all in Node.js, using AWS's CDK framework to define the infrastructure, API gateway + Lambda for the API, Jest for tests, and a mySQL RDS database to store the information. It's far from perfect, but I learned a lot about RDS in the process. 

## Endpoints 
### regions
Get all regions in the dataset

### areacodes
Get all areacodes in the dataset

### houseprices
Get house prices data
#### Query params
* maxDate - maximum date should be in YYYY-MM-DD - single value
* minDate  - minium date should be in YYYY-MM-DD - single value
* RegionName - Filter to specific region - single value
* AreaCode - Filter to specific area codes - single value
* houseType - Supports multiple comma separated values. Values must be one of Detached, SemiDetached, Terraced, Flat, New, or Old
* purchaseType Supports multiple comma separated values. Values must be one of Cash, Mortgage, FTB, FOO
* startFromId - ID to start from. This is the ID before the one we actually start searching from
* limit - Number of records to get

## Setup
You probably don't want to use this :), but my future self may like this section.
* Install the AWS CLI and CDK toolkit
* Run cdk deploy in the project folder
* Connect to the RDS and create a table (I used a Cloud9 instance in the private subnet to do this)
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
* Import the CSV file from the UK House Prices index dataset into the DB