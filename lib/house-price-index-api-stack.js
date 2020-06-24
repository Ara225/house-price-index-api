const core = require("@aws-cdk/core");
const rds = require('@aws-cdk/aws-rds');
const ssm = require('@aws-cdk/aws-ssm');
const ec2 = require('@aws-cdk/aws-ec2');

const lambda = require('@aws-cdk/aws-lambda');

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
            cidr: '10.0.0.0/16',
            maxAzs: 2,
            subnetConfiguration: [{
                cidrMask: 26,
                name: 'isolatedSubnet',
                subnetType: ec2.SubnetType.ISOLATED,
            }],
            natGateways: 0
        });
        this.ingressSecurityGroup = new ec2.SecurityGroup(this, 'ingress-security-group', {
            vpc: this.vpc,
            allowAllOutbound: false,
            securityGroupName: 'IngressSecurityGroup',
        });
        this.ingressSecurityGroup.addIngressRule(ec2.Peer.ipv4('10.0.0.0/16'), ec2.Port.tcp(3306));
        this.secret = ssm.StringParameter.valueForSecureStringParameter(
            this, 'rds-db-pwd', 1);

        this.mySQLRDSInstance = new rds.DatabaseInstance(this, 'house-prices-db', {
            engine: rds.DatabaseInstanceEngine.MYSQL,
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
            vpc: this.vpc,
            vpcPlacement: { subnetType: ec2.SubnetType.ISOLATED },
            multiAz: false,
            allocatedStorage: 5,
            storageType: rds.StorageType.standard,
            deletionProtection: false,
            masterUsername: 'Admin',
            databaseName: 'housePricesDb',
            masterUserPassword: this.secret,
            port: 3306
        });
        const newLambda = new lambda.Function(this, "newLambda", {
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: "hello.handler",
            code: lambda.Code.fromAsset('lambda'),
            vpc: this.vpc,
            vpcSubnets: {subnetType: ec2.SubnetType.ISOLATED},
            environment: {
                USERNAME: 'Admin',
                ENDPOINT: this.mySQLRDSInstance.dbInstanceEndpointAddress,
                DATABASE: this.mySQLRDSInstance.instanceIdentifier,
                PORT: '3306',
                PASSWORD_PARAM: 'rds-db-pwd'
            }
        });
    }
}

module.exports = { HousePriceIndexApiStack }
