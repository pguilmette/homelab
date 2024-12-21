import * as pulumi from "@pulumi/pulumi";
import * as kind from "@pguilmettenmedia/pulumi-kind";
import type { KindNode } from "./types/KindNode";

const stackConfig = new pulumi.Config();
const provider = stackConfig.require("provider");
const name = stackConfig.require("name");
const environment = stackConfig.require("environment");

export = async () => {
  if (provider === "talos") {
    // TODO: setup Talos OS
  } else if (provider === "kind") {
    new kind.Cluster("kubernetes-cluster", {
      name: `${name}-${environment}`,
      nodeImage: stackConfig.require("nodeImage"),
      waitForReady: true,
      kindConfig: {
        apiVersion: "kind.x-k8s.io/v1alpha4",
        kind: "Cluster",
        nodes:  stackConfig.requireObject<KindNode[]>("nodes").map(node => ({
          role: node.role
        }))
      }
    });
  } else {
    throw new Error("Provider not supported.");
  }
  
  // TODO: setup ArgoCD on the cluster (will be installed again to manage itself later on in the bootstrap process)

  return { };
}