#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { HousePriceIndexApiStack } = require('../lib/house-price-index-api-stack');

const app = new cdk.App();
new HousePriceIndexApiStack(app, 'HousePriceIndexApiStack');
