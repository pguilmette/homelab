import * as pulumi from "@pulumi/pulumi";
import * as kind from "@pguilmettenmedia/pulumi-kind";
import * as k8s from "@pulumi/kubernetes";
import type { KindNode } from "./types/KindNode";
import { KubernetesProvider } from "./types/KubernetesProvider";
import { KubernetesCni } from "./types/KubernetesCni";
import { ciliumChart } from "./modules/ciliumChart";

const stackConfig = new pulumi.Config();
const provider = stackConfig.require("provider");
const cni = stackConfig.require("cni");
const name = stackConfig.require("name");
const environment = stackConfig.require("environment");
const clusterName = `${name}-${environment}`;

export = async () => {
  if (cni !== KubernetesCni.Cilium) {
    // Only support Cilium for now
    throw new Error("Unsupported CNI.");
  }

  if (provider === KubernetesProvider.Talos) {
    // TODO: setup Talos OS

    // TODO: setup Cilium on the cluster
    //const k8sProvider = new k8s.Provider("kubernetes-provider", {
    //  kubeconfig: cluster.kubeconfig,
    //});
    //ciliumChart(k8sProvider, 7445, "localhost");
  } else if (provider === KubernetesProvider.Kind) {
    const apiServerPort = 6443;

    const cluster = new kind.Cluster("kubernetes-cluster", {
      name: clusterName,
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
          apiServerAddress: `${clusterName}-control-plane`, // KinD always add "-control-plane" suffix to the control plane node
          apiServerPort,
          podSubnet: stackConfig.get("podSubnet"),
          serviceSubnet: stackConfig.get("serviceSubnet"),
        }
      }
    });

    const k8sProvider = new k8s.Provider("kubernetes-provider", {
      kubeconfig: cluster.kubeconfig,
    });

    ciliumChart(k8sProvider, apiServerPort, "kubernetes.default.svc");
  } else {
    throw new Error("Provider not supported.");
  }
  
  // TODO: setup ArgoCD on the cluster (will be installed again to manage itself later on in the bootstrap process)

  return { };
}