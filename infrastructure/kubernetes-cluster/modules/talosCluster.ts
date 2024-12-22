import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";

const stackConfig = new pulumi.Config();

export async function talosCluster() {
  const name = stackConfig.require("name");
  const environment = stackConfig.require("environment");
  const clusterName = `${name}-${environment}`;

  // TODO: setup Talos OS

  // TODO: setup Cilium on the cluster
  const k8sProvider = new k8s.Provider("kubernetes-provider", {
    kubeconfig: ""//cluster.kubeconfig, TODO: get kubeconfig from Talos
  });

  const baseCiliumChartPath = "../../kubernetes/bootstrap/cilium";
  new k8s.helm.v4.Chart("cilium", {
    chart: baseCiliumChartPath,
    valueYamlFiles: [
      new pulumi.asset.FileAsset(`${baseCiliumChartPath}/values.yaml`),
      new pulumi.asset.FileAsset(`${baseCiliumChartPath}/values-talos.yaml`)
    ]
  }, {
    provider: k8sProvider,
    ignoreChanges: ["*"] // Ignore all changes because Cilium is handled by ArgoCD later on in the bootstrapping process
  });

  return { kubeconfig: "" /* TODO: get kubeconfig from Talos */ };
}