import type { ImgHTMLAttributes } from 'react'
import { useEffect, useState } from 'react'
import { resolveAssetUrl, resolveCoverThumbnailUrl } from '../utils/asset'

type CoverImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src?: string
  thumbnail?: boolean
}

export function CoverImage({
  src,
  thumbnail = false,
  onError,
  ...props
}: CoverImageProps) {
  const originalUrl = resolveAssetUrl(src)
  const thumbnailUrl = thumbnail ? resolveCoverThumbnailUrl(src) : originalUrl
  const [failedThumbnail, setFailedThumbnail] = useState(false)
  const imageUrl = failedThumbnail ? originalUrl : thumbnailUrl

  useEffect(() => {
    setFailedThumbnail(false)
  }, [src])

  if (!imageUrl) return null

  return (
    <img
      {...props}
      src={imageUrl}
      onError={(event) => {
        if (thumbnail && !failedThumbnail && thumbnailUrl !== originalUrl) {
          setFailedThumbnail(true)
          return
        }
        onError?.(event)
      }}
    />
  )
}
