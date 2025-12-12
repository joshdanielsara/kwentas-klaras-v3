import { getFaviconLinks, FAVICON_CONFIG } from '~/utils/favicon'

export const useFavicon = () => {
  const setFavicon = (iconPath: string) => {
    useHead({
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: iconPath,
        },
      ],
    })
  }

  const setDefaultFavicons = () => {
    useHead({
      link: getFaviconLinks(),
    })
  }

  const setCustomFavicon = (config: {
    default?: string
    sizes?: Partial<typeof FAVICON_CONFIG.sizes>
    appleTouchIcon?: string
    manifest?: string
  }) => {
    const links = getFaviconLinks()
    
    if (config.default) {
      const defaultLink = links.find(link => link.rel === 'icon' && !link.sizes)
      if (defaultLink) {
        defaultLink.href = config.default
      }
    }

    if (config.sizes) {
      links.forEach(link => {
        if (link.sizes && config.sizes?.[link.sizes as keyof typeof FAVICON_CONFIG.sizes]) {
          link.href = config.sizes[link.sizes as keyof typeof FAVICON_CONFIG.sizes]!
        }
      })
    }

    if (config.appleTouchIcon) {
      const appleLink = links.find(link => link.rel === 'apple-touch-icon')
      if (appleLink) {
        appleLink.href = config.appleTouchIcon
      }
    }

    if (config.manifest) {
      const manifestLink = links.find(link => link.rel === 'manifest')
      if (manifestLink) {
        manifestLink.href = config.manifest
      }
    }

    useHead({
      link: links,
    })
  }

  return {
    setFavicon,
    setDefaultFavicons,
    setCustomFavicon,
    FAVICON_CONFIG,
  }
}

