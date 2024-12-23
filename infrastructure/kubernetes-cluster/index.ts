import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";
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

  let k8sProvider: k8s.Provider;

  if (provider === KubernetesProvider.Talos) {
    k8sProvider = (await talosCluster()).k8sProvider;
  } else if (provider === KubernetesProvider.Kind) {
    k8sProvider = (await kindCluster()).k8sProvider;
  } else {
    throw new Error("Unsupported provider.");
  }

  new k8s.kustomize.v2.Directory("bootstrap", {
    directory: stackConfig.require("bootstrapDirectory"),
    skipAwait: true
  }, {
    provider: k8sProvider,
    deletedWith: k8sProvider // There's no point in waiting for the manifests to be deleted if we're deleting the cluster
  });

  return { };
}