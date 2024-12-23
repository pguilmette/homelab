import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";
//import * as talos from "@pulumiverse/talos";

const stackConfig = new pulumi.Config();

export async function talosCluster() {
  const name = stackConfig.require("name");
  const environment = stackConfig.require("environment");
  const clusterName = `${name}-${environment}`;

  // TODO: setup Talos OS
  /*const config = talos.client.getConfigurationOutput({
    clusterName: "example-cluster",
    clientConfiguration: thisSecrets.clientConfiguration,
    nodes: ["10.5.0.2"],
  });

  const schematicResource = new talos.imagefactory.Schematic("schematicResource", {schematic: "string"});

  const bootstrapResource = new talos.machine.Bootstrap("bootstrapResource", {
    clientConfiguration: {
      caCertificate: "string",
      clientCertificate: "string",
      clientKey: "string",
    },
    node: "string",
    endpoint: "string",
    timeouts: {
      create: "string",
    },
  });

  const kubeconfigResource = new talos.cluster.Kubeconfig("kubeconfigResource", {
    clientConfiguration: {
      caCertificate: "string",
      clientCertificate: "string",
      clientKey: "string",
    },
    node: "string",
    certificateRenewalDuration: "string",
    endpoint: "string",
    timeouts: {
      create: "string",
      update: "string",
    },
  });*/

  // TODO: setup Cilium on the cluster
  const k8sProvider = new k8s.Provider("kubernetes-provider", {
    kubeconfig: ""//cluster.kubeconfig, TODO: get kubeconfig from Talos
  });

  return { k8sProvider };
}