import type { DirectusClient } from '@directus/sdk';

export interface DirectusConnection {
  sdk: DirectusClient<any>;
}

export async function fetchCollections(d: DirectusConnection) {
  const res = await d.sdk.request<any>({
    method: 'GET',
    path: '/collections',
  });
  return res?.data || res;
}

export async function fetchRelations(d: DirectusConnection) {
  const res = await d.sdk.request<any>({ method: 'GET', path: '/relations' });
  return res?.data || res;
}

export async function fetchFields(d: DirectusConnection, collection?: string) {
  const path = collection ? `/fields/${encodeURIComponent(collection)}` : '/fields';
  const res = await d.sdk.request<any>({ method: 'GET', path });
  return res?.data || res;
}
