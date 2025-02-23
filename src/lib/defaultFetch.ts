import type { HttpsProxyAgent } from 'https-proxy-agent'

export interface FetchOptions {
  method: string
  headers?: HeadersInit
  body?: string | FormData | URLSearchParams | null
  agent?: HttpsProxyAgent<string>
}

export const getDefaultHeaders = (origin: string) => ({
  Accept: '*/*',
  'Accept-Encoding': 'gzip, deflate, br, zstd',
  'Accept-Language': 'en-US,en;q=0.9',
  Connection: 'keep-alive',
  'Content-Type': 'application/json',
  Origin: origin,
  Priority: 'u=1, i',
  Referer: origin + '/',
  'Sec-Ch-Ua': '"Not)A;Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
  'Sec-Ch-Ua-Mobile': '?0',
  'Sec-Ch-Ua-Platform': '"Windows"',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
})
