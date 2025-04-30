// lib/fetchWithoutAuth.ts
export const fetchWithoutAuth = async (
    url: string | URL,
    options: RequestInit = {}
  ) => {
    return fetch(url, options)
  }