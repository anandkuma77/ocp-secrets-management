/**
 * Core Kubernetes Event model and helpers for use with useK8sWatchResource.
 * Events are core/v1 resources (not from CRDs).
 */

import { K8sModel } from '@openshift-console/dynamic-plugin-sdk';

/** Core v1 Event model; includes version/group for useK8sWatchResource groupVersionKind. */
export const EventModel: K8sModel & { version: string; group: string } = {
  abbr: 'Ev',
  apiVersion: 'v1',
  apiGroup: '',
  version: 'v1',
  group: '',
  kind: 'Event',
  label: 'Event',
  labelPlural: 'Events',
  plural: 'events',
  namespaced: true,
} as const;

/** Minimal Event shape for listing (involvedObject, reason, message, lastTimestamp). */
export interface K8sEvent {
  metadata?: {
    name?: string;
    namespace?: string;
    creationTimestamp?: string;
  };
  involvedObject?: {
    kind?: string;
    name?: string;
    namespace?: string;
    uid?: string;
    apiVersion?: string;
  };
  reason?: string;
  message?: string;
  lastTimestamp?: string;
  firstTimestamp?: string;
  type?: string;
  count?: number;
}

/**
 * Maps URL resourceType (e.g. 'certificates', 'clusterissuers') to the Kubernetes
 * kind string used in Event.involvedObject.kind for field selectors.
 */
export function getInvolvedObjectKind(resourceType: string): string {
  const kindMap: Record<string, string> = {
    certificates: 'Certificate',
    issuers: 'Issuer',
    clusterissuers: 'ClusterIssuer',
    certificaterequests: 'CertificateRequest',
    externalsecrets: 'ExternalSecret',
    clusterexternalsecrets: 'ClusterExternalSecret',
    secretstores: 'SecretStore',
    clustersecretstores: 'ClusterSecretStore',
    pushsecrets: 'PushSecret',
    clusterpushsecrets: 'ClusterPushSecret',
    secretproviderclasses: 'SecretProviderClass',
    secretproviderclasspodstatuses: 'SecretProviderClassPodStatus',
  };
  return kindMap[resourceType] ?? resourceType;
}
