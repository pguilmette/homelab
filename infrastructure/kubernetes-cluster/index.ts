import * as pulumi from "@pulumi/pulumi";
import { KubernetesProvider } from "./types/KubernetesProvider";
import { KubernetesCni } from "./types/KubernetesCni";
import { kindCluster } from "./modules/kindCluster";
import { talosCluster } from "./modules/talosCluster";

const stackConfig = new pulumi.Config();
const provider = stackConfig.require("provider");
const cni = stackConfig.require("cni");

export = async () => {
  if (cni !== KubernetesCni.Cilium) {
    // Only support Cilium for now
    throw new Error("Unsupported CNI.");
  }

  if (provider === KubernetesProvider.Talos) {
    const { kubeconfig } = await talosCluster();
  } else if (provider === KubernetesProvider.Kind) {
    const { kubeconfig } = await kindCluster();
  } else {
    throw new Error("Unsupported provider.");
  }
  
  // TODO: setup ArgoCD on the cluster (will be installed again to manage itself later on in the bootstrap process)

  return { };
}