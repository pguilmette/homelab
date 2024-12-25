# Base Variant (Clusters)
Some components are in their own ArgoCD _Application_ because they require customization compared to others (e.g., Cert-Manager needs _ignoredDifferences_).

For the rest of the components, _ApplicationSets_ are used.