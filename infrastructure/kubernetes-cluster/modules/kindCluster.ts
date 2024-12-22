import * as pulumi from "@pulumi/pulumi";
import * as kind from "@pguilmettenmedia/pulumi-kind";
import * as k8s from "@pulumi/kubernetes";
import type { KindNode } from "../types/KindNode";

const stackConfig = new pulumi.Config();

export async function kindCluster() {
  const cluster = new kind.Cluster("kubernetes-cluster", {
    name: "homelab", // Keep this name consistent with the name used in the Cilium manifests ("<name>-control-plane")
    nodeImage: stackConfig.require("nodeImage"),
    waitForReady: true,
    kindConfig: {
      apiVersion: "kind.x-k8s.io/v1alpha4",
      kind: "Cluster",
      nodes: stackConfig.requireObject<KindNode[]>("nodes").map(node => ({
        role: node.role
      })),
      networking: {
        disableDefaultCni: true, // Do not install kindnet CNI that comes with KinD by default, Cilium will be used instead
        kubeProxyMode: "none", // Do not install kube-proxy, Cilium replaces it
        apiServerPort: 6443, // Keep this port consistent with the port used in the Cilium manifests
        podSubnet: stackConfig.get("podSubnet"),
        serviceSubnet: stackConfig.get("serviceSubnet"),
      }
    }
  });

  const k8sProvider = new k8s.Provider("kubernetes-provider", {
    kubeconfig: cluster.kubeconfig,
  });

  const baseCiliumChartPath = "../../kubernetes/bootstrap/cilium";
  new k8s.helm.v4.Chart("cilium", {
    chart: baseCiliumChartPath,
    valueYamlFiles: [
      new pulumi.asset.FileAsset(`${baseCiliumChartPath}/values.yaml`),
      new pulumi.asset.FileAsset(`${baseCiliumChartPath}/values-kind.yaml`)
    ]
  }, {
    provider: k8sProvider,
    ignoreChanges: ["*"] // Ignore all changes because Cilium is handled by ArgoCD later on in the bootstrapping process
  });

  return { kubeconfig: cluster.kubeconfig };
}