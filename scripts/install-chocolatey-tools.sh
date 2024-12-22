#!/bin/sh

choco feature enable -n=allowGlobalConfirmation

# Install useful tools to work with this repository on Windows
choco install pulumi
choco install kind
choco install k9s
choco install kubernetes-helm
choco install argocd-cli
choco install yq
choco install jq
choco install openssl
choco install kubelogin
choco install kubernetes-cli