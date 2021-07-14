import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import { ProtocolType } from "@pulumi/aws/ec2";

// Create an AWS resource (S3 Bucket)
// const bucket = new aws.s3.Bucket("my-bucket");

// Export the name of the bucket
// export const bucketName = bucket.id;

// export config info to pulumi

const baseTags = {
    Project: "pern-client",
    PulumiStack: pulumi.getStack()
};
  
//

const alb = new aws.alb.LoadBalancer("bar", {
  dropInvalidHeaderFields: false,
  enableCrossZoneLoadBalancing: false,
  enableDeletionProtection: false,
  enableHttp2: true,
  idleTimeout: 60,
  loadBalancerType: "application",
  name: "production-my-app-elb",
}, {
  protect: true,
});

//

const config = new pulumi.Config();
// const webAddress = config.require("webAddress");

// reference other stack resource in the pulumi
const infraStack = new pulumi.StackReference("stackref-infra", {
  name: `JasonnLi/pern-infra/${baseTags.PulumiStack}`
});

const VpcId = infraStack.requireOutput("VpcId");
const vpc = aws.ec2.Vpc.get("pern-vpc", VpcId);
const vpcx = new awsx.ec2.Vpc("pern-vpcx", { vpc });

// const alb = aws.ec2.

// const vpcPrivateSubnetIds = infraStack.requireOutput(
//   "VpcPrivateSubnetIds"
// ) as pulumi.Output<string[]>;

const vpcPublicSubnetIds = [
    "subnet-05449cf07e2158133",
    "subnet-08ae99f5610c91760"
]
// infraStack.requireOutput(
//   "vpcPublicSubnetIds"
// ) as pulumi.Output<string[]>;

const infraClusterName = infraStack.requireOutput("ClusterName");
// const DNSNamespaceId = infraStack.requireOutput("DNSNamespaceId");

//

const infraCluster = new awsx.ecs.Cluster("infra-cluster", {
  vpc: vpcx,
  cluster: infraClusterName
});

//
const imageRepo = new awsx.ecr.Repository("client");
const pernImage = awsx.ecr.buildAndPushImage(
  "pern-client-img",
  {
    context: "../",
    args: {
      NODE_ENV: pulumi.getStack()
    }
  },
  {
    repository: imageRepo.repository
  }
);

const serviceDiscovery = new aws.servicediscovery.Service(
  "pern-client-discovery",
  {
    name: "my-app-task-runner",
    dnsConfig: {
      namespaceId: "ns-qjmzae2lelk22mhu",
      routingPolicy: "MULTIVALUE",
      dnsRecords: [
        {
          ttl: 60,
          type: "A"
        }
      ]
    },
    healthCheckCustomConfig: {
      failureThreshold: 1
    }
  }
);

// Security groups
// const trafficSecurityGroup = new awsx.ec2.SecurityGroup("traffic", {
//   vpc: vpcx,
//   tags: baseTags
// });
// awsx.ec2.SecurityGroupRule.ingress(
//   "http-access",
//   trafficSecurityGroup,
//   new awsx.ec2.AnyIPv4Location(),
//   new awsx.ec2.TcpPorts(80),
//   "allow https access"
// );
// awsx.ec2.SecurityGroupRule.egress(
//   "egress-traffic",
//   trafficSecurityGroup,
//   new awsx.ec2.AnyIPv4Location(),
//   new awsx.ec2.AllTcpPorts(),
//   "allow outgoing traffic"
// );

// const nlbArn: string = infraStack.requireOutput("NlbArn").get()

const pernAlb = new awsx.lb.ApplicationLoadBalancer("production-my-app-elb", { loadBalancer: alb });
// const webListener = pernAlb.listeners
// const web = pernAlb.createListener("web", { 
//   protocol: "HTTP",
//   port: 80,
//   external: true,
// });

const EcsServiceSgId = infraStack.requireOutput("EcsSgId")

const pernClientService = new awsx.ecs.FargateService("my-app-task-runner", {
  cluster: infraCluster,
  assignPublicIp: false,
  desiredCount: 1,
  serviceRegistries: {
    registryArn: serviceDiscovery.arn,
    containerName: "my-app-client-container"
  },
  securityGroups: [EcsServiceSgId],
  subnets: vpcPublicSubnetIds,
  taskDefinitionArgs: {
    containers: {
      "my-app-client-container": {
        image: pernImage,

        memory: 256,
        cpu: 256,
        portMappings: pernAlb.listeners,
        // [
        //   {
        //     hostPort: 80,
        //     containerPort: 80,
        //     protocol: "tcp",
        //   }
        // ],
        environment: []
      }
    }
  }
});

export const ServiceId = pernClientService.service.id;

/* run the following to fix error: the current deployment has 1 resource(s) with pending operations
    pulumi stack export | pulumi stack import
*/
