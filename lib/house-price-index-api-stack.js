const core = require("@aws-cdk/core");
const rds = require('@aws-cdk/aws-rds');
const ssm = require('@aws-cdk/aws-ssm');
const ec2 = require('@aws-cdk/aws-ec2');
const iam = require('@aws-cdk/aws-iam');
const lambda = require('@aws-cdk/aws-lambda');
const apigateway = require('@aws-cdk/aws-apigateway');

class HousePriceIndexApiStack extends core.Stack {
    /**
     *
     * @param {core.Construct} scope
     * @param {string} id
     * @param {core.StackProps=} props
     */
    constructor(scope, id, props) {
        super(scope, id, props);
        this.vpc = new ec2.Vpc(this, 'CustomVPC', {
            maxAzs: 2,
            subnetConfiguration: [{
                name: 'privateSubnet',
                subnetType: ec2.SubnetType.PRIVATE,
            }, {
                name: 'publicSubnet',
                subnetType: ec2.SubnetType.PUBLIC,
            }],
        });
        this.RDSSecurityGroup = new ec2.SecurityGroup(this, 'ingress-security-group', {
            vpc: this.vpc,
            allowAllOutbound: false,
            securityGroupName: 'RDSSecurityGroup',
        });
        this.RDSSecurityGroup.addIngressRule(ec2.Peer.ipv4('10.0.0.0/16'), ec2.Port.tcp(3306));
        this.RDSSecurityGroup.addDefaultEgressRule()

        this.secret = ssm.StringParameter.valueForSecureStringParameter(
            this, 'rds-db-pwd', 1);
        this.mySQLRDSInstance = new rds.DatabaseInstance(this, 'house-prices-db', {
            engine: rds.DatabaseInstanceEngine.MYSQL,
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
            vpc: this.vpc,
            vpcPlacement: { subnetType: ec2.SubnetType.PRIVATE },
            multiAz: false,
            allocatedStorage: 5,
            storageType: rds.StorageType.standard,
            deletionProtection: false,
            masterUsername: 'Admin',
            securityGroups: [this.RDSSecurityGroup],
            databaseName: 'housePricesDb',
            masterUserPassword: this.secret,
            port: 3306
        });
        // Create simple, publicly available API gateway resource. The CORS stuff is only for preflight requests
        var api = new apigateway.RestApi(this, 'HousePricesAPI', {restApiName:'HousePricesAPI',
                                                defaultCorsPreflightOptions: {
                                                    allowOrigins: ["*"],
                                                    allowMethods: ["GET", "POST", "OPTIONS"]
                                                }})
        var getRegionsLambdaResource = api.root.addResource('getregions')
        const getRegionsLambda = new lambda.Function(this, "getRegionsLambda", {
            timeout: core.Duration.seconds(10),
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: "app.handler",
            code: lambda.Code.fromAsset('./lambdas/getRegionsLambda'),
            vpc: this.vpc,
            vpcSubnets: {subnetType: ec2.SubnetType.PRIVATE},
            environment: {
                RDS_USERNAME: 'Admin',
                RDS_ENDPOINT: this.mySQLRDSInstance.dbInstanceEndpointAddress,
                RDS_DATABASE: 'housePricesDb',
                RDS_PORT: '3306',
                RDS_PASSWORD_PARAM: 'rds-db-pwd'
            }
        });
        getRegionsLambda.addToRolePolicy(new iam.PolicyStatement({actions:["ssm:GetParameter"], resources: ["arn:aws:ssm:eu-west-2:040684591284:parameter/rds-db-pwd"]}))
        var getRegionsLambdaIntegration = new apigateway.LambdaIntegration(getRegionsLambda, {proxy:true})
        getRegionsLambdaResource.addMethod('GET', getRegionsLambdaIntegration)
    }
}

module.exports = { HousePriceIndexApiStack }
