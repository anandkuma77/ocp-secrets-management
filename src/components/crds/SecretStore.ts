// SecretStore and ClusterSecretStore models from external-secrets-operator
export const SecretStoreModel = {
  group: 'external-secrets.io',
  version: 'v1',
  kind: 'SecretStore',
};

export const ClusterSecretStoreModel = {
  group: 'external-secrets.io',
  version: 'v1',
  kind: 'ClusterSecretStore',
};

export interface SecretStore {
  metadata: {
    name: string;
    namespace?: string;
    creationTimestamp: string;
    annotations?: Record<string, string>;
  };
  scope?: 'Namespace' | 'Cluster';
  spec: {
    provider: {
      aws?: { service: string; region?: string };
      azurekv?: { vaultUrl: string };
      bitwardensecretsmanager?: { bitwardenServerSDKURL?: string; apiURL?: string };
      gcpsm?: { projectID?: string };
      vault?: { server: string };
      kubernetes?: { server?: { url?: string } };
      doppler?: { apiUrl?: string; project?: string };
      onepassword?: { connectHost: string };
      gitlab?: { url?: string };
      fake?: { data?: any[] };
    };
  };
  status?: {
    conditions?: Array<{
      type: string;
      status: string;
      reason?: string;
      message?: string;
    }>;
  };
}
