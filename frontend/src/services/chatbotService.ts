import {
  getProductById,
} from '@/data/products'

import {
  formatPKR,
} from '@/utils/currency'

const API_BASE = '/api/v1'

/* =====================================================
   API PLACEHOLDER

   Backend is not connected yet.
===================================================== */

async function request<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  void options

  throw new Error(
    `API not yet connected: ${API_BASE}${endpoint}`,
  )
}

export const chatbotService = {
  sendMessage: (
    message: string,
    conversationId?: string,
  ) =>
    request(
      '/chatbot/message',
      {
        method: 'POST',

        body: JSON.stringify({
          message,
          conversationId,
        }),
      },
    ),

  getHistory: () =>
    request(
      '/chatbot/history',
    ),
}

/* =====================================================
   DEAL SAVINGS

   Uses current product data so chatbot prices do not
   become inconsistent with products.ts.
===================================================== */

function getProductSavings(
  productId: string,
): string {
  const product =
    getProductById(
      productId,
    )

  if (
    !product ||
    !product.oldPrice ||
    product.oldPrice <=
      product.price
  ) {
    return formatPKR(0)
  }

  return formatPKR(
    product.oldPrice -
      product.price,
  )
}

/* =====================================================
   MOCK AI RESPONSE GENERATOR

   Demo only.
   Later this can be replaced by the actual local
   chatbot/backend implementation.
===================================================== */

export function generateMockResponse(
  userMessage: string,
): {
  text: string
  productIds?: string[]
} {
  const msg =
    userMessage
      .toLowerCase()
      .trim()

  /* ===================================================
     PRODUCT COMPARISON

     Keep this before general phone detection.
  =================================================== */

  if (msg.includes('compare')) {
    if (
      (
        msg.includes(
          'iphone',
        ) ||
        msg.includes(
          '17 pro',
        )
      ) &&
      (
        msg.includes(
          'galaxy',
        ) ||
        msg.includes(
          's25',
        )
      )
    ) {
      return {
        text:
          'The iPhone 17 Pro and Samsung Galaxy S25 Ultra are both premium flagship phones. The iPhone 17 Pro focuses on Apple ecosystem integration, performance, and its pro camera experience, while the Galaxy S25 Ultra offers a larger display, S Pen support, and a high-resolution 200MP camera system. Open either product below to compare storage options, pricing, and specifications.',

        productIds: [
          'iphone17pro',
          'galaxys25ultra',
        ],
      }
    }

    return {
      text:
        'I can help you compare products. Tell me which two products you would like to compare — for example, "Compare iPhone 17 Pro and Galaxy S25 Ultra" — and I will break down their specifications, prices, and key differences.',
    }
  }

  /* ===================================================
     AUDIO
  =================================================== */

  if (
    msg.includes(
      'headphone',
    ) ||
    msg.includes(
      'audio',
    ) ||
    msg.includes(
      'earbud',
    ) ||
    msg.includes(
      'speaker',
    )
  ) {
    return {
      text:
        'Based on your request, here are some strong audio options. The Sony WH-1000XM5 offers premium active noise cancellation and up to 30 hours of battery life. If you prefer earbuds, the AirPods Pro 2 offer adaptive noise cancellation and spatial audio. For portable sound, the JBL Flip 6 is a compact waterproof Bluetooth speaker.',

      productIds: [
        'sonywh1000xm5',
        'airpodspro2',
        'jblflip6',
      ],
    }
  }

  /* ===================================================
     LAPTOPS
  =================================================== */

  if (
    msg.includes(
      'laptop',
    ) ||
    msg.includes(
      'programming',
    ) ||
    msg.includes(
      'coding',
    ) ||
    msg.includes(
      'developer',
    )
  ) {
    return {
      text:
        'For programming, the MacBook Pro 16" is a powerful option for development and creative workloads, with Apple silicon and a Liquid Retina XDR display. If you prefer Windows, the Dell XPS 15 combines strong performance with a premium OLED display and dedicated graphics.',

      productIds: [
        'macbookpro16',
        'dellxps15',
      ],
    }
  }

  /* ===================================================
     SMARTPHONES
  =================================================== */

  if (
    msg.includes(
      'phone',
    ) ||
    msg.includes(
      'smartphone',
    ) ||
    msg.includes(
      'iphone',
    ) ||
    msg.includes(
      'galaxy',
    ) ||
    msg.includes(
      'pixel',
    ) ||
    msg.includes(
      'xiaomi',
    )
  ) {
    return {
      text:
        'Here are some of the premium smartphones available in NOVA. The iPhone 17 Pro offers Apple flagship performance and a pro-grade camera system. The Samsung Galaxy S25 Ultra combines a large AMOLED display, S Pen, and 200MP camera system. The Google Pixel 9 Pro focuses heavily on AI-assisted photography, while the Xiaomi 14 Ultra offers a Leica-focused camera experience.',

      productIds: [
        'iphone17pro',
        'galaxys25ultra',
        'pixel9pro',
        'xiaomi14ultra',
      ],
    }
  }

  /* ===================================================
     ORDER TRACKING
  =================================================== */

  if (
    msg.includes(
      'order',
    ) ||
    msg.includes(
      'track',
    ) ||
    msg.includes(
      'where',
    ) ||
    msg.includes(
      'delivery',
    )
  ) {
    return {
      text:
        'I can help you track your order. Once you are logged in, your orders area can show the current status, estimated delivery information, and available tracking details.',
    }
  }

  /* ===================================================
     GAMING
  =================================================== */

  if (
    msg.includes(
      'gaming',
    ) ||
    msg.includes(
      'playstation',
    ) ||
    msg.includes(
      'ps5',
    ) ||
    msg.includes(
      'steam deck',
    ) ||
    msg.includes(
      'xbox',
    )
  ) {
    return {
      text:
        'For gaming, the PlayStation 5 Pro is the premium console option in the NOVA catalog. The Steam Deck OLED provides portable PC gaming with an OLED HDR display, while the Xbox Wireless Controller is a flexible accessory for console, PC, and mobile gaming.',

      productIds: [
        'ps5pro',
        'steamdeckoled',
        'xboxcontroller',
      ],
    }
  }

  /* ===================================================
     CAMERAS
  =================================================== */

  if (
    msg.includes(
      'camera',
    ) ||
    msg.includes(
      'photography',
    ) ||
    msg.includes(
      'video',
    ) ||
    msg.includes(
      'drone',
    )
  ) {
    return {
      text:
        'For photography and video, the Canon EOS R5 Mark II is a powerful full-frame hybrid camera, while the Nikon Z9 targets demanding professional photography and video workflows. For aerial photography, the DJI Mavic 3 Pro offers a Hasselblad-based triple-camera system and extended flight capability.',

      productIds: [
        'canonr5mark2',
        'nikonz9',
        'djimavic3pro',
      ],
    }
  }

  /* ===================================================
     DEALS
  =================================================== */

  if (
    msg.includes(
      'discount',
    ) ||
    msg.includes(
      'deal',
    ) ||
    msg.includes(
      'sale',
    ) ||
    msg.includes(
      'offer',
    )
  ) {
    const xiaomiSaving =
      getProductSavings(
        'xiaomi14ultra',
      )

    const boseSaving =
      getProductSavings(
        'boseqcultra',
      )

    const lgSaving =
      getProductSavings(
        'lgoledc4',
      )

    return {
      text:
        `We have several active deals right now. The Xiaomi 14 Ultra currently saves you ${xiaomiSaving}, the Bose QuietComfort Ultra saves ${boseSaving}, and the LG OLED evo C4 saves ${lgSaving} on its base configuration. You can also visit the Deals section to browse all discounted products.`,

      productIds: [
        'xiaomi14ultra',
        'boseqcultra',
        'lgoledc4',
      ],
    }
  }

  /* ===================================================
     SMARTWATCHES
  =================================================== */

  if (
    msg.includes(
      'watch',
    ) ||
    msg.includes(
      'smartwatch',
    )
  ) {
    return {
      text:
        'For smartwatches, the Apple Watch Ultra 2 is designed around fitness, outdoor activities, and the Apple ecosystem. The Samsung Galaxy Watch Ultra offers advanced health monitoring and strong integration with Galaxy devices.',

      productIds: [
        'applewatchultra2',
        'galaxywatchultra',
      ],
    }
  }

  /* ===================================================
     TV
  =================================================== */

  if (
    msg.includes(
      'tv',
    ) ||
    msg.includes(
      'television',
    ) ||
    msg.includes(
      'oled',
    ) ||
    msg.includes(
      'bravia',
    )
  ) {
    return {
      text:
        'For home entertainment, the LG OLED evo C4 delivers self-lit OLED contrast with strong gaming features, while the Sony BRAVIA 9 uses Mini-LED technology for high brightness and cinematic viewing.',

      productIds: [
        'lgoledc4',
        'sonysbr9',
      ],
    }
  }

  /* ===================================================
     DEFAULT RESPONSE
  =================================================== */

  return {
    text:
      `I'm NOVA AI, your shopping assistant. I can help you find products, compare options, track orders, and recommend electronics for your needs. Try asking me things like "Find me headphones under ${formatPKR(300)}" or "Recommend a laptop for programming".`,
  }
}