# Guilmette's Homelab

## Directories
- `infrastructure`: Everything related to infrastructure provisioning
- `docs`: Useful documentation on technical aspects of the homelab setup
- `kubernetes`: Manifests for the various components deployed in Kubernetes clusters
- `scripts`: Miscellaneous scripts

## Local Development
### Getting Started
> Because the cluster uses the Cilium CNI, follow [this guide](/docs/cgroup-version-validation.md) to make sure that your Docker instance is using _cgroup v2_; otherwise, Cilium will fail to install properly.

To locally start a Kubernetes cluster using KinD (Kubernetes-in-Docker), you can create one quickly with the following steps:
1. Ensure you have the Pulumi CLI installed
2. Ensure you have Docker installed and running
3. In a console, go to the `infrastructure/kubernetes-cluster` directory
4. Log in to Pulumi locally: `pulumi login --local`
5. Create the cluster: `pulumi up --stack kind.local --yes`
> You will be asked for a passphrase to protect your infrastructure secrets. You can put anything you want.
6. Be patient 😊