import { createDirectus, authentication, rest } from '@directus/sdk';

const envUrl = (import.meta as any).env?.VITE_DIRECTUS_URL || (typeof process !== 'undefined' ? (process as any).env?.VITE_DIRECTUS_URL : undefined);
const BASE_URL = envUrl || (typeof window !== 'undefined' ? `${window.location.origin}/code_server/directus/` : '');

export function createDirectusClient() {
  const client = createDirectus(BASE_URL).with(rest()).with(authentication());

  return {
    sdk: client,
    async login(email: string, password: string) {
      await client.login('email', { email, password });
    },
    async logout() {
      await client.logout();
    },
  } as const;
}
