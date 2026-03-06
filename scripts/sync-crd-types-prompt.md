# Sync CRD types and interfaces with current code

After code changes that add or change usage of CRD types or the `./components/crds` module, run this task to keep generated types and shims in sync.

## What to do

1. **Find all imports** of `./crds`, `./components/crds`, and `./components/crds/Events` in the repo (src/). List every symbol that is imported (e.g. CertificateModel, EventModel, ExternalSecretResource, isClusterExternalSecret, getInvolvedObjectKind, K8sEvent).

2. **CRD sources** (`crd-sources.json`): For every CRD *kind* used by the code (e.g. Certificate, Issuer, ClusterIssuer, ExternalSecret, ClusterExternalSecret, SecretStore, ClusterSecretStore, PushSecret, ClusterPushSecret, SecretProviderClass, SecretProviderClassPodStatus), ensure there is a corresponding entry in `crd-sources.json` with the correct `repo`, `ref`, `file`, `kind`, `group`, and `version`. Add any missing CRDs from the appropriate upstream (cert-manager, external-secrets, secrets-store-csi-driver).

3. **Generator** (`scripts/generate-types.ts`): Ensure each generated `*Model` constant includes both `apiVersion`/`apiGroup` (for K8sModel) and `version`/`group` (for K8sGroupVersionKind used by useK8sWatchResource). Regenerate types by running `make update-types` (or `make fetch-crds` then `make generate-types`).

4. **Shim** (`src/components/crds/`):
   - `index.ts`: Re-export everything from `../../generated/crds` and from `./Events`. Define and export any union types and type-guard functions the code expects (e.g. `ExternalSecretResource`, `PushSecretResource`, `isClusterExternalSecret`, `isClusterPushSecret`).
   - `Events.ts`: Export `EventModel` (core v1 Event with `version` and `group` for useK8sWatchResource), `K8sEvent`, and `getInvolvedObjectKind(resourceType)` mapping URL resourceType strings to Kubernetes kind strings for Event.involvedObject.kind.

5. **Table components**: If the code uses a union type (e.g. PushSecretResource = PushSecret | ClusterPushSecret), ensure table code uses the correct spec shape per variant (e.g. ClusterPushSecret uses `spec.pushSecretSpec` for display fields; PushSecret uses `spec`). Use type guards (e.g. isClusterPushSecret) and narrow before accessing spec fields.

6. **Verify**: Run `make plugin-typecheck` (or `yarn typecheck`). Fix any remaining type errors. Then run `make verify` to ensure all checks pass.

Do not add or remove features; only sync types, exports, and generator output so that the existing code type-checks and builds.
