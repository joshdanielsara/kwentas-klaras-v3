export const FAVICON_CONFIG = {
  default: '/favicon.ico',
  sizes: {
    '16x16': '/favicon-16x16.png',
    '32x32': '/favicon-32x32.png',
    '96x96': '/favicon-96x96.png',
    '192x192': '/favicon-192x192.png',
    '512x512': '/favicon-512x512.png',
  },
  appleTouchIcon: '/apple-touch-icon.png',
  manifest: '/site.webmanifest',
} as const

export const getFaviconLinks = (basePath: string = '') => {
  return [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: `${basePath}${FAVICON_CONFIG.default}`,
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: `${basePath}${FAVICON_CONFIG.sizes['16x16']}`,
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: `${basePath}${FAVICON_CONFIG.sizes['32x32']}`,
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '96x96',
      href: `${basePath}${FAVICON_CONFIG.sizes['96x96']}`,
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '192x192',
      href: `${basePath}${FAVICON_CONFIG.sizes['192x192']}`,
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '512x512',
      href: `${basePath}${FAVICON_CONFIG.sizes['512x512']}`,
    },
    {
      rel: 'apple-touch-icon',
      href: `${basePath}${FAVICON_CONFIG.appleTouchIcon}`,
    },
    {
      rel: 'manifest',
      href: `${basePath}${FAVICON_CONFIG.manifest}`,
    },
  ]
}

