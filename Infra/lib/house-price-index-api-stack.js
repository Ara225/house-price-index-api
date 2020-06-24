const cdk = require('@aws-cdk/core');
const lambda = require('@aws-cdk/aws-lambda');
const rds = require('@aws-cdk/aws-rds');

class HousePriceIndexApiStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

  }
}

module.exports = { HousePriceIndexApiStack }
