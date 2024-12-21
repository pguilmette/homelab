import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";

const stackConfig = new pulumi.Config();

export function ciliumChart(
  k8sProvider: k8s.Provider,
  apiServerPort: number,
  apiServiceHost: string
) {
  new k8s.helm.v3.Chart("cilium", {
    chart: "cilium",
    version: stackConfig.require("ciliumVersion"),
    fetchOpts: {
      repo: "https://helm.cilium.io/",
    },
    namespace: "kube-system",
    values: {
      kubeProxyReplacement: true,
      k8sServiceHost: apiServiceHost,
      k8sServicePort: apiServerPort,
      externalIPs: {
        enabled: true,
      },
      nodePort: {
        enabled: true,
      },
      hostServices: {
        enabled: false,
      },
      hostPort: {
        enabled: true
      },
      image: {
        pullPolicy: "IfNotPresent"
      },
      ipam: {
        mode: "kuberetes"
      },
      hubble: {
        enabled: true,
        relay: {
          enabled: true
        }
      },
      securityContext: {
        capabilities: {
          ciliumAgent: "{CHOWN,KILL,NET_ADMIN,NET_RAW,IPC_LOCK,SYS_ADMIN,SYS_RESOURCE,DAC_OVERRIDE,FOWNER,SETGID,SETUID}",
          cleanCiliumState: "{NET_ADMIN,SYS_ADMIN,SYS_RESOURCE}"
        }
      },
      cgroup: {
        autoMount: {
          enabled: false
        },
        hostRoot: "/sys/fs/cgroup"
      }
    },
  }, { provider: k8sProvider });

}