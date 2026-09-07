import { localProductImages } from './productLocalImages'

export interface ProductImageSet {
  listing: string
  detailMain: string
  gallery: string[]
  frames?: string[]
  variantImages?: Record<string, string>
}

/* -------------------------------------------------------
   Helpers
------------------------------------------------------- */

const pexels = (
  id: string,
  format = 'jpeg',
) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.${format}?auto=compress&cs=tinysrgb&h=1000&w=1000`

export const productAsset = (
  productId: string,
  fileName: string,
) =>
  `/images/products/${productId}/${fileName}`

const createImageSet = (
  listing: string,
  detailMain: string,
  gallery: string[] = [],
  variantImages?: Record<string, string>,
  frames: string[] = [],
): ProductImageSet => {
  const uniqueGallery = [
    detailMain,
    ...gallery,
  ].filter(
    (image, index, array) =>
      Boolean(image) &&
      array.indexOf(image) === index,
  )

  return {
    listing,
    detailMain,

    /*
      Main image + whatever real gallery files
      actually exist for this product.
    */
    gallery: uniqueGallery.slice(0, 6),

    variantImages,

    /*
      Gallery images are NOT fake 360 frames.
      Keep this empty until genuine sequential
      360 frames are available.
    */
    frames,
  }
}

/* -------------------------------------------------------
   Hero / Cinematic Images

   Homepage hero imagery can stay cinematic.
------------------------------------------------------- */

export const heroImages = {
  headphones: pexels('9058883'),
  smartphone: pexels('7989741'),
  laptop: pexels('14005916'),
}

/* -------------------------------------------------------
   Category Images

   Category banners remain lifestyle-oriented.
------------------------------------------------------- */

export const categoryImages = {
  smartphones: pexels('1647978'),
  laptops: pexels('1714202'),
  audio: pexels('15840650'),
  smartwatches: pexels('12564670'),
  gaming: pexels('16070479'),
  cameras: pexels('6958462'),
  tv: pexels('32326321', 'png'),
  accessories: pexels('8219211'),
}

/* -------------------------------------------------------
   Ambient / Background Images
------------------------------------------------------- */

export const ambientImages = {
  abstract1:
    'https://images.pexels.com/photos/12627677/pexels-photo-12627677.jpeg?auto=compress&cs=tinysrgb&h=1080&w=1920',

  abstract2:
    'https://images.pexels.com/photos/13027585/pexels-photo-13027585.jpeg?auto=compress&cs=tinysrgb&h=1080&w=1920',

  tunnel:
    'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&h=1080&w=1920',
}

/* -------------------------------------------------------
   Product Image Library

   Generated automatically from:
   public/images/products/<product-id>/

   Expected filenames:
   listing.*
   main.*
   front.*
   back.*
   side.*
   angle.*

   Missing views are automatically ignored.
------------------------------------------------------- */

export const productImages: Record<
  string,
  ProductImageSet
> = Object.fromEntries(
  Object.entries(
    localProductImages,
  ).map(([productId, images]) => [
    productId,

    createImageSet(
      images.listing,
      images.detailMain,
      images.gallery,
    ),
  ]),
) as Record<string, ProductImageSet>

/* -------------------------------------------------------
   Neutral fallback

   Missing product must NEVER become an iPhone.
------------------------------------------------------- */

const fallbackImage =
  categoryImages.accessories

const fallbackProductImage: ProductImageSet = {
  listing: fallbackImage,
  detailMain: fallbackImage,
  gallery: [fallbackImage],
  frames: [],
}

/* -------------------------------------------------------
   Public Helpers
------------------------------------------------------- */

export function getProductImage(
  id: string,
): ProductImageSet {
  return (
    productImages[id] ??
    fallbackProductImage
  )
}

/* -------------------------------------------------------
   Color-specific image

   For now, if no genuine color image exists,
   return the normal main image.

   Later we can add actual product color photos.
------------------------------------------------------- */

export function getProductImageForColor(
  id: string,
  color?: string,
): string {
  const images =
    getProductImage(id)

  if (
    color &&
    images.variantImages &&
    images.variantImages[color]
  ) {
    return images.variantImages[
      color
    ]
  }

  return images.detailMain
}

/* -------------------------------------------------------
   Gallery
------------------------------------------------------- */

export function getProductGallery(
  id: string,
): string[] {
  const images =
    getProductImage(id)

  return images.gallery.length
    ? images.gallery
    : [images.detailMain]
}

/* -------------------------------------------------------
   Genuine 360 availability
------------------------------------------------------- */

export function has360Frames(
  id: string,
): boolean {
  const frames =
    getProductImage(id).frames ??
    []

  return frames.length >= 4
}