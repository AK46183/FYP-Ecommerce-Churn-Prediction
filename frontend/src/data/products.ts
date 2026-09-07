export interface VariantOption {
  name: string
  values: string[]
}

export interface VariantConfig {
  values: Record<string, string>
  price: number
  oldPrice?: number
  stock: number
  sku: string
}

export interface Product {
  id: string
  name: string
  brand: string
  category: string
  price: number
  oldPrice?: number
  rating: number
  reviewCount: number
  shortSpec: string
  description: string
  specifications: Record<string, string>
  variants: VariantOption[]
  variantConfigs?: VariantConfig[]
  stock: number
  isNew?: boolean
  isDeal?: boolean
  isFeatured?: boolean
  colors: { name: string; hex: string }[]
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  productCount: number
}

export const categories: Category[] = [
  {
    id: 'smartphones',
    name: 'Smartphones',
    slug: 'smartphones',
    description: 'Flagship phones engineered for the future.',
    productCount: 4,
  },
  {
    id: 'laptops',
    name: 'Laptops',
    slug: 'laptops',
    description: 'Portable powerhouses for creators and pros.',
    productCount: 4,
  },
  {
    id: 'audio',
    name: 'Audio',
    slug: 'audio',
    description: 'Immersive sound, wireless freedom.',
    productCount: 4,
  },
  {
    id: 'smartwatches',
    name: 'Smartwatches',
    slug: 'smartwatches',
    description: 'Health, fitness, and connectivity on your wrist.',
    productCount: 2,
  },
  {
    id: 'gaming',
    name: 'Gaming',
    slug: 'gaming',
    description: 'Next-gen gaming hardware and accessories.',
    productCount: 3,
  },
  {
    id: 'cameras',
    name: 'Cameras',
    slug: 'cameras',
    description: 'Capture every detail in cinematic clarity.',
    productCount: 3,
  },
  {
    id: 'tv',
    name: 'TV & Entertainment',
    slug: 'tv',
    description: 'Cinematic displays for your space.',
    productCount: 2,
  },
  {
    id: 'accessories',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Essential gear that elevates your setup.',
    productCount: 2,
  },
]

export const brands = [
  'Apple',
  'Samsung',
  'Sony',
  'Dell',
  'HP',
  'Lenovo',
  'ASUS',
  'Acer',
  'JBL',
  'Bose',
  'Canon',
  'Nikon',
  'LG',
  'Xiaomi',
  'Google',
  'Logitech',
  'Microsoft',
  'Valve',
  'DJI',
]

export const products: Product[] = [
  // =====================================================
  // SMARTPHONES
  // =====================================================

  {
    id: 'iphone17pro',
    name: 'iPhone 17 Pro',
    brand: 'Apple',
    category: 'smartphones',
    price: 1099,
    rating: 4.9,
    reviewCount: 2841,
    shortSpec: 'A19 Pro · 6.3" OLED ProMotion · 48MP Triple Camera',
    description:
      'The most advanced iPhone yet. A titanium frame, the powerful A19 Pro chip, and a pro-grade camera system that redefines mobile photography. All-day battery life and Apple Intelligence built in.',
    specifications: {
      Display: '6.3" Super Retina XDR OLED, 120Hz ProMotion',
      Chip: 'A19 Pro, 6-core GPU',
      Camera: '48MP Main + 48MP Ultra Wide + 12MP Telephoto 5x',
      Battery: 'Up to 30 hours video playback',
      Connectivity: '5G, Wi-Fi 7, USB-C 3.2',
      'Water Resistance': 'IP68 (6m for 30 min)',
      Weight: '187g',
    },
    variants: [
      {
        name: 'Storage',
        values: ['256GB', '512GB', '1TB'],
      },
    ],
    variantConfigs: [
      {
        values: { Storage: '256GB' },
        price: 1099,
        stock: 15,
        sku: 'IP17P-256',
      },
      {
        values: { Storage: '512GB' },
        price: 1299,
        stock: 12,
        sku: 'IP17P-512',
      },
      {
        values: { Storage: '1TB' },
        price: 1499,
        stock: 8,
        sku: 'IP17P-1TB',
      },
    ],
    stock: 35,
    isNew: true,
    isFeatured: true,
    colors: [
      { name: 'Black', hex: '#1a1a1c' },
      { name: 'White', hex: '#f0f0f2' },
      { name: 'Blue', hex: '#3b5b8c' },
      { name: 'Natural Titanium', hex: '#8c8a85' },
    ],
  },

  {
    id: 'galaxys25ultra',
    name: 'Samsung Galaxy S25 Ultra',
    brand: 'Samsung',
    category: 'smartphones',
    price: 1299,
    rating: 4.8,
    reviewCount: 1956,
    shortSpec:
      'Snapdragon 8 Elite · 6.9" QHD+ AMOLED · 200MP Quad Camera',
    description:
      'Galaxy AI meets the ultimate Ultra. A 200MP quad camera, integrated S Pen, and the brightest display Samsung has ever made. Built for those who demand everything.',
    specifications: {
      Display: '6.9" Dynamic AMOLED 2X, 120Hz, 2600 nits',
      Chip: 'Snapdragon 8 Elite',
      Camera:
        '200MP Main + 50MP Periscope 5x + 10MP Telephoto 3x + 50MP Ultra Wide',
      Battery: '5000mAh, 45W fast charging',
      Connectivity: '5G, Wi-Fi 7, USB-C 3.2',
      'Water Resistance': 'IP68',
      Weight: '218g',
    },
    variants: [
      {
        name: 'Storage',
        values: ['256GB', '512GB', '1TB'],
      },
    ],
    variantConfigs: [
      {
        values: { Storage: '256GB' },
        price: 1299,
        stock: 14,
        sku: 'GS25U-256',
      },
      {
        values: { Storage: '512GB' },
        price: 1419,
        stock: 10,
        sku: 'GS25U-512',
      },
      {
        values: { Storage: '1TB' },
        price: 1659,
        stock: 6,
        sku: 'GS25U-1TB',
      },
    ],
    stock: 30,
    isNew: true,
    isFeatured: true,
    colors: [
      { name: 'Titanium Black', hex: '#1a1a1c' },
      { name: 'Titanium Gray', hex: '#4a4a52' },
      { name: 'Titanium White', hex: '#e8e8ea' },
      { name: 'Titanium Blue', hex: '#2a4a7f' },
    ],
  },

  {
    id: 'pixel9pro',
    name: 'Google Pixel 9 Pro',
    brand: 'Google',
    category: 'smartphones',
    price: 999,
    oldPrice: 1099,
    rating: 4.7,
    reviewCount: 1203,
    shortSpec:
      'Tensor G4 · 6.3" LTPO OLED · 50MP Triple Camera with AI',
    description:
      'The AI phone. Google Tensor G4 powers the smartest Pixel yet, with real-time language translation, Magic Editor, and the best computational photography in the industry.',
    specifications: {
      Display: '6.3" LTPO OLED, 120Hz',
      Chip: 'Google Tensor G4',
      Camera: '50MP Main + 48MP Ultra Wide + 48MP Telephoto 5x',
      Battery: '4700mAh',
      Connectivity: '5G, Wi-Fi 7, USB-C',
      'Water Resistance': 'IP68',
      Weight: '198g',
    },
    variants: [
      {
        name: 'Storage',
        values: ['128GB', '256GB', '512GB'],
      },
    ],
    variantConfigs: [
      {
        values: { Storage: '128GB' },
        price: 999,
        oldPrice: 1099,
        stock: 18,
        sku: 'PX9P-128',
      },
      {
        values: { Storage: '256GB' },
        price: 1099,
        oldPrice: 1199,
        stock: 14,
        sku: 'PX9P-256',
      },
      {
        values: { Storage: '512GB' },
        price: 1219,
        oldPrice: 1319,
        stock: 8,
        sku: 'PX9P-512',
      },
    ],
    stock: 40,
    isDeal: true,
    isFeatured: true,
    colors: [
      { name: 'Obsidian', hex: '#1c1c1e' },
      { name: 'Porcelain', hex: '#e8e8ea' },
      { name: 'Hazel', hex: '#5a6e5d' },
      { name: 'Rose Quartz', hex: '#c4a5a0' },
    ],
  },

  {
    id: 'xiaomi14ultra',
    name: 'Xiaomi 14 Ultra',
    brand: 'Xiaomi',
    category: 'smartphones',
    price: 1299,
    oldPrice: 1399,
    rating: 4.6,
    reviewCount: 876,
    shortSpec:
      'Snapdragon 8 Gen 3 · 6.73" AMOLED · Leica Quad Camera',
    description:
      'Photography, redefined with Leica. A quad-camera beast with a 1-inch sensor, Snapdragon 8 Gen 3, and a stunning AMOLED display. Flagship specs without the flagship tax.',
    specifications: {
      Display: '6.73" AMOLED, 120Hz, 3000 nits',
      Chip: 'Snapdragon 8 Gen 3',
      Camera:
        '50MP Main (1") + 50MP Periscope 5x + 50MP Telephoto 3x + 50MP Ultra Wide',
      Battery: '5300mAh, 90W fast charging',
      Connectivity: '5G, Wi-Fi 7, USB-C',
      'Water Resistance': 'IP68',
      Weight: '220g',
    },
    variants: [
      {
        name: 'Storage',
        values: ['256GB', '512GB', '1TB'],
      },
    ],
    variantConfigs: [
      {
        values: { Storage: '256GB' },
        price: 1299,
        oldPrice: 1399,
        stock: 10,
        sku: 'X14U-256',
      },
      {
        values: { Storage: '512GB' },
        price: 1499,
        oldPrice: 1599,
        stock: 7,
        sku: 'X14U-512',
      },
      {
        values: { Storage: '1TB' },
        price: 1699,
        oldPrice: 1799,
        stock: 4,
        sku: 'X14U-1TB',
      },
    ],
    stock: 21,
    isDeal: true,
    colors: [
      { name: 'Black', hex: '#1a1a1c' },
      { name: 'White', hex: '#f0f0f2' },
      { name: 'Silver', hex: '#c8c8ce' },
    ],
  },

  // =====================================================
  // LAPTOPS
  // =====================================================

  {
    id: 'macbookpro16',
    name: 'MacBook Pro 16"',
    brand: 'Apple',
    category: 'laptops',
    price: 3199,
    rating: 4.9,
    reviewCount: 1432,
    shortSpec:
      'M4 Max · 16.2" Liquid Retina XDR · 36GB Unified Memory',
    description:
      'The pro laptop redefined. M4 Max delivers workstation-class performance in a portable package. A stunning Liquid Retina XDR display, all-day battery, and pro-level graphics.',
    specifications: {
      Display: '16.2" Liquid Retina XDR, 3456×2234, 120Hz',
      Chip: 'Apple M4 Max, 40-core GPU',
      Memory: '36GB Unified Memory (configurable to 128GB)',
      Storage: '1TB SSD (configurable to 8TB)',
      Battery: 'Up to 22 hours',
      Ports: '3× Thunderbolt 5, HDMI, SDXC, MagSafe 3',
      Weight: '2.14kg',
    },
    variants: [
      {
        name: 'Memory',
        values: ['36GB', '48GB', '64GB'],
      },
      {
        name: 'Storage',
        values: ['1TB', '2TB', '4TB'],
      },
    ],
    variantConfigs: [
      {
        values: { Memory: '36GB', Storage: '1TB' },
        price: 3199,
        stock: 8,
        sku: 'MBP16-36-1',
      },
      {
        values: { Memory: '36GB', Storage: '2TB' },
        price: 3599,
        stock: 6,
        sku: 'MBP16-36-2',
      },
      {
        values: { Memory: '48GB', Storage: '1TB' },
        price: 3599,
        stock: 5,
        sku: 'MBP16-48-1',
      },
      {
        values: { Memory: '48GB', Storage: '2TB' },
        price: 3999,
        stock: 4,
        sku: 'MBP16-48-2',
      },
      {
        values: { Memory: '64GB', Storage: '2TB' },
        price: 4399,
        stock: 3,
        sku: 'MBP16-64-2',
      },
      {
        values: { Memory: '64GB', Storage: '4TB' },
        price: 4999,
        stock: 2,
        sku: 'MBP16-64-4',
      },
    ],
    stock: 28,
    isNew: true,
    isFeatured: true,
    colors: [
      { name: 'Space Black', hex: '#2a2a2e' },
      { name: 'Silver', hex: '#e2e2e6' },
    ],
  },

  {
    id: 'dellxps15',
    name: 'Dell XPS 15',
    brand: 'Dell',
    category: 'laptops',
    price: 1499,
    rating: 4.7,
    reviewCount: 968,
    shortSpec:
      'Intel Core Ultra 9 · 15.6" OLED 3.5K · 32GB RAM · RTX 4070',
    description:
      'Precision engineering meets creative power. The XPS 15 combines a stunning OLED display, Intel Core Ultra 9, and NVIDIA RTX graphics in a CNC-machined aluminum chassis.',
    specifications: {
      Display: '15.6" OLED 3.5K, 400 nits, Touch',
      Processor: 'Intel Core Ultra 9 285H',
      Memory: '32GB DDR5 (configurable to 64GB)',
      Storage: '1TB NVMe SSD (configurable to 2TB)',
      Graphics: 'NVIDIA RTX 4070 8GB',
      Ports: '2× Thunderbolt 4, USB-C, SD card',
      Weight: '1.86kg',
    },
    variants: [
      {
        name: 'RAM',
        values: ['16GB', '32GB', '64GB'],
      },
      {
        name: 'Storage',
        values: ['512GB', '1TB', '2TB'],
      },
    ],
    variantConfigs: [
      {
        values: { RAM: '16GB', Storage: '512GB' },
        price: 1499,
        stock: 12,
        sku: 'XPS15-16-512',
      },
      {
        values: { RAM: '16GB', Storage: '1TB' },
        price: 1699,
        stock: 10,
        sku: 'XPS15-16-1',
      },
      {
        values: { RAM: '32GB', Storage: '1TB' },
        price: 1899,
        stock: 8,
        sku: 'XPS15-32-1',
      },
      {
        values: { RAM: '32GB', Storage: '2TB' },
        price: 2099,
        stock: 6,
        sku: 'XPS15-32-2',
      },
      {
        values: { RAM: '64GB', Storage: '2TB' },
        price: 2499,
        stock: 4,
        sku: 'XPS15-64-2',
      },
    ],
    stock: 40,
    isFeatured: true,
    colors: [
      { name: 'Platinum Silver', hex: '#d4d4d8' },
      { name: 'Graphite', hex: '#3a3a3e' },
    ],
  },

  {
    id: 'asusrogstrix',
    name: 'ASUS ROG Strix G18',
    brand: 'ASUS',
    category: 'laptops',
    price: 1899,
    oldPrice: 2199,
    rating: 4.8,
    reviewCount: 745,
    shortSpec:
      'RTX 4080 · Ryzen 9 8945HX · 18" QHD+ 240Hz · 32GB',
    description:
      'Dominate every game. The ROG Strix G18 packs desktop-class performance with an RTX 4080, a blazing 240Hz display, and an advanced cooling system that keeps temps low under load.',
    specifications: {
      Display: '18" QHD+ 2560×1600, 240Hz, 100% DCI-P3',
      Processor: 'AMD Ryzen 9 8945HX',
      Memory: '32GB DDR5-5600',
      Storage: '1TB PCIe 4.0 NVMe',
      Graphics: 'NVIDIA RTX 4080 12GB',
      Cooling: 'ROG Intelligent Cooling, Tri-Fan',
      Weight: '3.1kg',
    },
    variants: [
      {
        name: 'RAM',
        values: ['16GB', '32GB', '64GB'],
      },
      {
        name: 'Storage',
        values: ['1TB', '2TB'],
      },
    ],
    variantConfigs: [
      {
        values: { RAM: '16GB', Storage: '1TB' },
        price: 1899,
        oldPrice: 2199,
        stock: 8,
        sku: 'ROG18-16-1',
      },
      {
        values: { RAM: '32GB', Storage: '1TB' },
        price: 2199,
        oldPrice: 2399,
        stock: 6,
        sku: 'ROG18-32-1',
      },
      {
        values: { RAM: '32GB', Storage: '2TB' },
        price: 2399,
        oldPrice: 2599,
        stock: 4,
        sku: 'ROG18-32-2',
      },
      {
        values: { RAM: '64GB', Storage: '2TB' },
        price: 2599,
        oldPrice: 2799,
        stock: 3,
        sku: 'ROG18-64-2',
      },
    ],
    stock: 21,
    isNew: true,
    isDeal: true,
    colors: [
      { name: 'Eclipse Black', hex: '#1a1a1c' },
      { name: 'Volt Green', hex: '#3d8b40' },
    ],
  },

  {
    id: 'lenovothinkpad',
    name: 'Lenovo ThinkPad X1 Carbon Gen 12',
    brand: 'Lenovo',
    category: 'laptops',
    price: 1399,
    rating: 4.7,
    reviewCount: 1120,
    shortSpec:
      'Core Ultra 7 · 14" OLED 2.8K · 32GB · 1TB · 1.09kg',
    description:
      'The business ultrabook benchmark. Featherlight at 1.09kg, military-grade durability, and a stunning OLED display. Built for professionals who never compromise.',
    specifications: {
      Display: '14" OLED 2.8K, 120Hz, 400 nits',
      Processor: 'Intel Core Ultra 7 155H',
      Memory: '32GB LPDDR5x',
      Storage: '1TB PCIe 4.0 NVMe',
      Battery: 'Up to 18 hours',
      Ports: '2× Thunderbolt 4, USB-A, HDMI',
      Weight: '1.09kg',
    },
    variants: [
      {
        name: 'RAM',
        values: ['16GB', '32GB', '64GB'],
      },
      {
        name: 'Storage',
        values: ['512GB', '1TB', '2TB'],
      },
    ],
    variantConfigs: [
      {
        values: { RAM: '16GB', Storage: '512GB' },
        price: 1399,
        stock: 14,
        sku: 'X1C12-16-512',
      },
      {
        values: { RAM: '16GB', Storage: '1TB' },
        price: 1499,
        stock: 12,
        sku: 'X1C12-16-1',
      },
      {
        values: { RAM: '32GB', Storage: '1TB' },
        price: 1699,
        stock: 10,
        sku: 'X1C12-32-1',
      },
      {
        values: { RAM: '32GB', Storage: '2TB' },
        price: 1899,
        stock: 6,
        sku: 'X1C12-32-2',
      },
      {
        values: { RAM: '64GB', Storage: '2TB' },
        price: 2199,
        stock: 4,
        sku: 'X1C12-64-2',
      },
    ],
    stock: 46,
    colors: [
      { name: 'Storm Grey', hex: '#4a4a52' },
      { name: 'Black', hex: '#1a1a1c' },
    ],
  },

  // =====================================================
  // AUDIO
  // =====================================================

  {
    id: 'sonywh1000xm5',
    name: 'Sony WH-1000XM5',
    brand: 'Sony',
    category: 'audio',
    price: 399,
    oldPrice: 449,
    rating: 4.9,
    reviewCount: 3210,
    shortSpec:
      'Industry-Leading ANC · 30hr Battery · LDAC Hi-Res Audio',
    description:
      'The noise-cancelling king. Eight microphones, AI-powered ANC, and crystal-clear call quality. With 30 hours of battery and LDAC support, this is audio perfection.',
    specifications: {
      Type: 'Over-ear, Wireless',
      'Noise Cancelling': '8-mic AI-powered ANC',
      Battery: '30 hours (ANC on)',
      Connectivity: 'Bluetooth 5.3, LDAC, Multipoint',
      Charging: 'USB-C, 3 min = 3 hours',
      Weight: '250g',
    },
    variants: [],
    stock: 65,
    isNew: true,
    isFeatured: true,
    colors: [
      { name: 'Black', hex: '#1a1a1c' },
      { name: 'Silver', hex: '#c8c8ce' },
      { name: 'Midnight Blue', hex: '#1e3a5f' },
    ],
  },

  {
    id: 'airpodspro2',
    name: 'AirPods Pro 2',
    brand: 'Apple',
    category: 'audio',
    price: 249,
    rating: 4.8,
    reviewCount: 4520,
    shortSpec:
      'Adaptive ANC · H2 Chip · USB-C · 6hr Listening',
    description:
      'Audio that adapts to you. The H2 chip powers adaptive noise cancellation, personalized spatial audio, and conversation awareness. A redesigned fit for all-day comfort.',
    specifications: {
      Type: 'In-ear, Wireless',
      Chip: 'Apple H2',
      'Noise Cancelling': 'Adaptive ANC + Transparency',
      Battery: '6 hours (ANC on), 30 hours with case',
      Connectivity: 'Bluetooth 5.3',
      'Water Resistance': 'IP54 (sweat & dust)',
    },
    variants: [],
    stock: 120,
    isFeatured: true,
    colors: [
      {
        name: 'White',
        hex: '#f0f0f2',
      },
    ],
  },

  {
    id: 'boseqcultra',
    name: 'Bose QuietComfort Ultra',
    brand: 'Bose',
    category: 'audio',
    price: 379,
    oldPrice: 429,
    rating: 4.8,
    reviewCount: 1890,
    shortSpec:
      'Immersive Audio · 24hr Battery · Snapdragon Sound',
    description:
      "Bose Immersive Audio places sound in front of you, creating a spatial experience like never before. World-class ANC and Bose's signature sound profile.",
    specifications: {
      Type: 'Over-ear, Wireless',
      'Noise Cancelling':
        'Adaptive ANC with Immersive Audio',
      Battery: '24 hours (ANC on)',
      Connectivity:
        'Bluetooth 5.3, Snapdragon Sound',
      Charging: 'USB-C',
      Weight: '253g',
    },
    variants: [],
    stock: 48,
    isDeal: true,
    colors: [
      { name: 'Black', hex: '#1a1a1c' },
      { name: 'White Smoke', hex: '#d8d6d0' },
      { name: 'Sandstone', hex: '#c8b89a' },
    ],
  },

  {
    id: 'jblflip6',
    name: 'JBL Flip 6',
    brand: 'JBL',
    category: 'audio',
    price: 99,
    oldPrice: 129,
    rating: 4.7,
    reviewCount: 5630,
    shortSpec:
      'IP67 Waterproof · 12hr Battery · Bold JBL Pro Sound',
    description:
      'Take your music anywhere. Rugged, waterproof, and packed with JBL Pro Sound. A dedicated tweeter delivers crisp highs while the racetrack-shaped driver pumps deep bass.',
    specifications: {
      Type: 'Portable Bluetooth Speaker',
      'Water Resistance':
        'IP67 (dust & waterproof)',
      Battery: '12 hours',
      Connectivity: 'Bluetooth 5.1',
      Charging: 'USB-C',
      Weight: '550g',
    },
    variants: [],
    stock: 200,
    isDeal: true,
    colors: [
      { name: 'Black', hex: '#1a1a1c' },
      { name: 'Blue', hex: '#2a6cc4' },
      { name: 'Red', hex: '#c43a3a' },
      { name: 'Teal', hex: '#3aa5a0' },
    ],
  },

  // =====================================================
  // SMARTWATCHES
  // =====================================================

  {
    id: 'applewatchultra2',
    name: 'Apple Watch Ultra 2',
    brand: 'Apple',
    category: 'smartwatches',
    price: 799,
    rating: 4.9,
    reviewCount: 982,
    shortSpec:
      'S9 Chip · 72hr Battery · Titanium · Precision GPS',
    description:
      'Built for the extreme. A titanium case, brightest Apple display ever, and precision dual-frequency GPS. Up to 72 hours of battery life in low-power mode.',
    specifications: {
      Display:
        '3000 nits LTPO OLED Always-On',
      Chip: 'Apple S9 SiP',
      Battery:
        '36 hours (72h Low Power)',
      'Water Resistance':
        '100m (EN13319 dive)',
      Connectivity:
        'GPS + Cellular, Bluetooth 5.3',
      Material: 'Grade 5 Titanium',
    },
    variants: [],
    stock: 55,
    isNew: true,
    isFeatured: true,
    colors: [
      {
        name: 'Natural Titanium',
        hex: '#8c8a85',
      },
      {
        name: 'Black Titanium',
        hex: '#2a2a2e',
      },
    ],
  },

  {
    id: 'galaxywatchultra',
    name: 'Samsung Galaxy Watch Ultra',
    brand: 'Samsung',
    category: 'smartwatches',
    price: 649,
    oldPrice: 749,
    rating: 4.7,
    reviewCount: 645,
    shortSpec:
      'Exynos W1000 · 47mm · 80hr Battery · BIA Sensor',
    description:
      'The ultimate Galaxy Watch. Advanced health monitoring with BIA body composition, ECG, and sleep coaching. A 3nm chip delivers smooth performance and longer battery life.',
    specifications: {
      Display:
        '1.5" Super AMOLED, 60Hz, 3000 nits',
      Chip: 'Exynos W1000 3nm',
      Battery: '80 hours',
      'Water Resistance':
        'IP68, 5ATM, 10m diving',
      Health:
        'BIA, ECG, BP, SpO2, Sleep',
      Material: 'Titanium',
    },
    variants: [
      {
        name: 'Connectivity',
        values: ['Bluetooth', 'LTE'],
      },
    ],
    variantConfigs: [
      {
        values: {
          Connectivity: 'Bluetooth',
        },
        price: 649,
        oldPrice: 749,
        stock: 35,
        sku: 'GWU-BT',
      },
      {
        values: {
          Connectivity: 'LTE',
        },
        price: 749,
        oldPrice: 849,
        stock: 25,
        sku: 'GWU-LTE',
      },
    ],
    stock: 60,
    isDeal: true,
    colors: [
      {
        name: 'Titanium Gray',
        hex: '#4a4a52',
      },
      {
        name: 'Titanium White',
        hex: '#e8e8ea',
      },
      {
        name: 'Titanium Sleet',
        hex: '#2a2a2e',
      },
    ],
  },

  // =====================================================
  // GAMING
  // =====================================================

  {
    id: 'ps5pro',
    name: 'PlayStation 5 Pro',
    brand: 'Sony',
    category: 'gaming',
    price: 699,
    rating: 4.9,
    reviewCount: 2105,
    shortSpec:
      'PS5 Pro Enhanced GPU · 2TB SSD · 8K Output · Ray Tracing',
    description:
      'The most powerful PlayStation ever. A 45% faster GPU, advanced ray tracing, and AI-driven upscaling. Experience games at their absolute best with stunning fidelity and performance.',
    specifications: {
      GPU: 'Custom RDNA, 45% faster than PS5',
      Storage: '2TB Custom SSD',
      'Ray Tracing': 'Advanced, 2-3x faster',
      Resolution: 'Up to 8K, 4K 120fps',
      'AI Upscaling':
        'PlayStation Spectral Super Resolution',
      Connectivity:
        'Wi-Fi 7, Bluetooth 5.1',
    },
    variants: [],
    stock: 22,
    isNew: true,
    isFeatured: true,
    colors: [
      {
        name: 'White',
        hex: '#f0f0f2',
      },
    ],
  },

  {
    id: 'xboxcontroller',
    name: 'Xbox Wireless Controller',
    brand: 'Microsoft',
    category: 'gaming',
    price: 59,
    oldPrice: 64,
    rating: 4.8,
    reviewCount: 8420,
    shortSpec:
      'Textured Grips · Hybrid D-pad · Bluetooth · USB-C',
    description:
      'Refined ergonomics, a hybrid D-pad, and textured grip. Connect via Bluetooth, Xbox Wireless, or USB-C. Custom button mapping via the Xbox Accessories app.',
    specifications: {
      Connectivity:
        'Xbox Wireless, Bluetooth, USB-C',
      Battery:
        'AA (up to 40 hours)',
      Features:
        'Hybrid D-pad, Textured grip, Share button',
      Compatibility:
        'Xbox, PC, Android, iOS',
    },
    variants: [],
    stock: 300,
    isDeal: true,
    colors: [
      {
        name: 'Carbon Black',
        hex: '#1a1a1c',
      },
      {
        name: 'Robot White',
        hex: '#f0f0f2',
      },
      {
        name: 'Shock Blue',
        hex: '#2a6cc4',
      },
      {
        name: 'Pulse Red',
        hex: '#c43a3a',
      },
    ],
  },

  {
    id: 'steamdeckoled',
    name: 'Steam Deck OLED',
    brand: 'Valve',
    category: 'gaming',
    price: 449,
    oldPrice: 549,
    rating: 4.8,
    reviewCount: 1567,
    shortSpec:
      '7.4" OLED HDR · AMD APU · 1TB NVMe · 12hr Battery',
    description:
      'Your Steam library, anywhere. A gorgeous HDR OLED display, longer battery life, and a faster, cooler-running chip. The definitive handheld PC gaming experience.',
    specifications: {
      Display:
        '7.4" OLED HDR, 90Hz, 1000 nits',
      Chip: 'AMD APU, 6nm',
      Storage:
        '512GB or 1TB NVMe SSD',
      Battery: '3-12 hours',
      Connectivity:
        'Wi-Fi 6E, Bluetooth 5.3, USB-C',
      Weight: '670g',
    },
    variants: [
      {
        name: 'Storage',
        values: ['512GB', '1TB'],
      },
    ],
    variantConfigs: [
      {
        values: {
          Storage: '512GB',
        },
        price: 449,
        oldPrice: 549,
        stock: 20,
        sku: 'SDO-512',
      },
      {
        values: {
          Storage: '1TB',
        },
        price: 549,
        oldPrice: 649,
        stock: 15,
        sku: 'SDO-1TB',
      },
    ],
    stock: 35,
    isNew: true,
    colors: [
      {
        name: 'Black',
        hex: '#1a1a1c',
      },
    ],
  },

  // =====================================================
  // CAMERAS
  // =====================================================

  {
    id: 'canonr5mark2',
    name: 'Canon EOS R5 Mark II',
    brand: 'Canon',
    category: 'cameras',
    price: 4299,
    rating: 4.9,
    reviewCount: 423,
    shortSpec:
      '45MP Full-Frame · 8K60 Video · Eye Control AF · Stacked Sensor',
    description:
      "A full-frame powerhouse for pros. 45MP stacked CMOS sensor, 8K60 raw video, and Canon's most advanced autofocus with Eye Control AF. The hybrid camera redefined.",
    specifications: {
      Sensor:
        '45MP Full-Frame Stacked CMOS',
      Video: '8K60 RAW, 4K120 10-bit',
      Autofocus:
        'Dual Pixel Intelligent AF, Eye Control',
      Stabilization: '8 stops IBIS',
      Burst:
        '30 fps electronic shutter',
      Connectivity:
        'Wi-Fi 6E, Bluetooth 5.3, 2.5G Ethernet',
    },
    variants: [
      {
        name: 'Kit',
        values: [
          'Body Only',
          '24-105mm Kit',
          '28-70mm Kit',
        ],
      },
    ],
    variantConfigs: [
      {
        values: {
          Kit: 'Body Only',
        },
        price: 4299,
        stock: 5,
        sku: 'CR5M2-BO',
      },
      {
        values: {
          Kit: '24-105mm Kit',
        },
        price: 4999,
        stock: 3,
        sku: 'CR5M2-24105',
      },
      {
        values: {
          Kit: '28-70mm Kit',
        },
        price: 5299,
        stock: 2,
        sku: 'CR5M2-2870',
      },
    ],
    stock: 10,
    isFeatured: true,
    colors: [
      {
        name: 'Black',
        hex: '#1a1a1c',
      },
    ],
  },

  {
    id: 'nikonz9',
    name: 'Nikon Z9',
    brand: 'Nikon',
    category: 'cameras',
    price: 5499,
    oldPrice: 5999,
    rating: 4.9,
    reviewCount: 312,
    shortSpec:
      '45.7MP Stacked CMOS · 8K60 · 120fps Burst · No Mechanical Shutter',
    description:
      "Nikon's flagship mirrorless. A stacked sensor with no mechanical shutter, 120fps burst, and 8K60 video. Built like a tank for professional wildlife, sports, and studio work.",
    specifications: {
      Sensor:
        '45.7MP Full-Frame Stacked CMOS',
      Video: '8K60 N-RAW, 4K120',
      Autofocus:
        '493-point hybrid AF',
      Burst:
        '120 fps (11MP), 20 fps (45MP)',
      Stabilization: '6 stops IBIS',
      Connectivity:
        'Wi-Fi 6, Bluetooth, 1000BASE-T',
    },
    variants: [
      {
        name: 'Kit',
        values: [
          'Body Only',
          '24-70mm Kit',
          '70-200mm Kit',
        ],
      },
    ],
    variantConfigs: [
      {
        values: {
          Kit: 'Body Only',
        },
        price: 5499,
        oldPrice: 5999,
        stock: 4,
        sku: 'NZ9-BO',
      },
      {
        values: {
          Kit: '24-70mm Kit',
        },
        price: 6499,
        oldPrice: 6999,
        stock: 2,
        sku: 'NZ9-2470',
      },
      {
        values: {
          Kit: '70-200mm Kit',
        },
        price: 7499,
        oldPrice: 7999,
        stock: 2,
        sku: 'NZ9-70200',
      },
    ],
    stock: 8,
    isDeal: true,
    colors: [
      {
        name: 'Black',
        hex: '#1a1a1c',
      },
    ],
  },

  {
    id: 'djimavic3pro',
    name: 'DJI Mavic 3 Pro',
    brand: 'DJI',
    category: 'cameras',
    price: 2199,
    rating: 4.8,
    reviewCount: 567,
    shortSpec:
      'Hasselblad Triple Camera · 5.1K50 Video · 43min Flight',
    description:
      'Aerial cinematography perfected. A Hasselblad triple-camera system, 5.1K50 video, and 43 minutes of flight time. Omnidirectional obstacle sensing and O3+ transmission.',
    specifications: {
      Camera:
        'Hasselblad + Medium Tele + Tele, 4/3 CMOS',
      Video: '5.1K50, 4K120',
      'Flight Time': '43 minutes',
      'Max Speed': '75 km/h',
      Transmission:
        'O3+, 15 km range',
      Obstacle:
        'Omnidirectional binocular vision',
    },
    variants: [
      {
        name: 'Kit',
        values: [
          'Standard',
          'Fly More Combo',
        ],
      },
    ],
    variantConfigs: [
      {
        values: {
          Kit: 'Standard',
        },
        price: 2199,
        stock: 8,
        sku: 'DM3P-STD',
      },
      {
        values: {
          Kit: 'Fly More Combo',
        },
        price: 2999,
        stock: 5,
        sku: 'DM3P-FMC',
      },
    ],
    stock: 13,
    isNew: true,
    colors: [
      {
        name: 'Gray',
        hex: '#4a4a52',
      },
    ],
  },

  // =====================================================
  // TV & ENTERTAINMENT
  // =====================================================

  {
    id: 'lgoledc4',
    name: 'LG OLED evo C4',
    brand: 'LG',
    category: 'tv',
    price: 1499,
    oldPrice: 1799,
    rating: 4.9,
    reviewCount: 892,
    shortSpec:
      '4K OLED evo · α9 Gen7 AI · 144Hz · Dolby Vision',
    description:
      'Self-lit OLED perfection. The α9 Gen7 AI processor enhances every frame, while 144Hz delivers buttery-smooth motion. Dolby Vision and Atmos for a cinematic home theater.',
    specifications: {
      Display: 'OLED evo 4K',
      Processor:
        'α9 Gen7 AI Processor 4K',
      'Refresh Rate': '144Hz',
      HDR:
        'Dolby Vision IQ, HDR10, HLG',
      Gaming:
        'G-Sync, FreeSync, VRR, 0.1ms response',
      Sound:
        'Dolby Atmos, 2.2ch 40W',
    },
    variants: [
      {
        name: 'Size',
        values: [
          '55"',
          '65"',
          '77"',
          '83"',
        ],
      },
    ],
    variantConfigs: [
      {
        values: {
          Size: '55"',
        },
        price: 1499,
        oldPrice: 1799,
        stock: 12,
        sku: 'LGC4-55',
      },
      {
        values: {
          Size: '65"',
        },
        price: 1999,
        oldPrice: 2299,
        stock: 8,
        sku: 'LGC4-65',
      },
      {
        values: {
          Size: '77"',
        },
        price: 2999,
        oldPrice: 3299,
        stock: 5,
        sku: 'LGC4-77',
      },
      {
        values: {
          Size: '83"',
        },
        price: 4499,
        oldPrice: 4999,
        stock: 3,
        sku: 'LGC4-83',
      },
    ],
    stock: 28,
    isFeatured: true,
    isDeal: true,
    colors: [
      {
        name: 'Black',
        hex: '#1a1a1c',
      },
    ],
  },

  {
    id: 'sonysbr9',
    name: 'Sony BRAVIA 9',
    brand: 'Sony',
    category: 'tv',
    price: 2999,
    rating: 4.8,
    reviewCount: 345,
    shortSpec:
      'Mini-LED 4K · XR Processor · 120Hz · Dolby Vision',
    description:
      "Brightness that rivals OLED. Sony's mini-LED XR Backlight Master Drive delivers stunning contrast and peak brightness. The ultimate cinematic display for large rooms.",
    specifications: {
      Display: 'Mini-LED 4K',
      Processor: 'XR Processor',
      'Refresh Rate': '120Hz',
      HDR: 'Dolby Vision, HDR10, HLG',
      Brightness:
        'Up to 3000 nits',
      Sound:
        'Acoustic Multi-Audio, Dolby Atmos',
    },
    variants: [
      {
        name: 'Size',
        values: [
          '75"',
          '85"',
          '98"',
        ],
      },
    ],
    variantConfigs: [
      {
        values: {
          Size: '75"',
        },
        price: 2999,
        stock: 6,
        sku: 'SB9-75',
      },
      {
        values: {
          Size: '85"',
        },
        price: 4499,
        stock: 4,
        sku: 'SB9-85',
      },
      {
        values: {
          Size: '98"',
        },
        price: 7999,
        stock: 2,
        sku: 'SB9-98',
      },
    ],
    stock: 12,
    colors: [
      {
        name: 'Black',
        hex: '#1a1a1c',
      },
    ],
  },

  // =====================================================
  // ACCESSORIES
  // =====================================================

  {
    id: 'logitechmx3s',
    name: 'Logitech MX Master 3S',
    brand: 'Logitech',
    category: 'accessories',
    price: 99,
    rating: 4.8,
    reviewCount: 3210,
    shortSpec:
      '8000 DPI · MagSpeed Scroll · 3-Device Flow · 70-day Battery',
    description:
      'The productivity mouse, perfected. An 8000 DPI sensor tracks on any surface, MagSpeed scrolling switches between precision and speed, and Logi Flow works across three devices.',
    specifications: {
      Sensor:
        '8000 DPI Darkfield Laser',
      Connectivity:
        'Bluetooth, Logi Bolt USB',
      Battery:
        '70 days per charge, USB-C',
      Features:
        'MagSpeed Scroll, Logi Flow, Customizable',
      'Surface Tracking':
        'Any surface, even glass',
    },
    variants: [],
    stock: 150,
    isNew: true,
    colors: [
      {
        name: 'Graphite',
        hex: '#3a3a3e',
      },
      {
        name: 'Pale Gray',
        hex: '#b8b8bc',
      },
      {
        name: 'Ivory White',
        hex: '#e8e6e0',
      },
    ],
  },

  {
    id: 'samsungt9ssd',
    name: 'Samsung T9 Portable SSD',
    brand: 'Samsung',
    category: 'accessories',
    price: 129,
    oldPrice: 179,
    rating: 4.7,
    reviewCount: 2150,
    shortSpec:
      'USB 3.2 2x2 · 2000MB/s · IP65 · Pocket-Sized',
    description:
      'Studio-grade speed in your pocket. 2000MB/s read and write over USB 3.2 2x2, rugged IP65 durability, and drop resistance up to 3 meters. The ultimate portable storage.',
    specifications: {
      Interface:
        'USB 3.2 2x2 (20Gbps)',
      Speed:
        '2000 MB/s read & write',
      Durability:
        'IP65, 3m drop, shockproof',
      Connectivity: 'USB-C',
      Weight: '98g',
    },
    variants: [
      {
        name: 'Capacity',
        values: [
          '1TB',
          '2TB',
          '4TB',
        ],
      },
    ],
    variantConfigs: [
      {
        values: {
          Capacity: '1TB',
        },
        price: 129,
        oldPrice: 179,
        stock: 80,
        sku: 'ST9-1T',
      },
      {
        values: {
          Capacity: '2TB',
        },
        price: 179,
        oldPrice: 229,
        stock: 60,
        sku: 'ST9-2T',
      },
      {
        values: {
          Capacity: '4TB',
        },
        price: 329,
        oldPrice: 399,
        stock: 30,
        sku: 'ST9-4T',
      },
    ],
    stock: 170,
    isDeal: true,
    colors: [
      {
        name: 'Black',
        hex: '#1a1a1c',
      },
    ],
  },
]

// =====================================================
// VARIANT HELPERS
// =====================================================

export function getVariantConfig(
  product: Product,
  selected: Record<string, string>,
): VariantConfig | undefined {
  if (!product.variantConfigs?.length) {
    return undefined
  }

  return product.variantConfigs.find((config) =>
    Object.entries(config.values).every(
      ([key, value]) =>
        selected[key] === value,
    ),
  )
}

/**
 * Returns a safe, real default configuration.
 *
 * This is much safer than independently choosing
 * the first RAM + first Storage value because some
 * combinations may not actually exist.
 */
export function getDefaultVariantSelection(
  product: Product,
): Record<string, string> {
  let selection: Record<string, string> = {}

  if (
    product.variantConfigs &&
    product.variantConfigs.length > 0
  ) {
    selection = {
      ...product.variantConfigs[0].values,
    }
  } else {
    selection = Object.fromEntries(
      product.variants
        .filter(
          (variant) =>
            variant.values.length > 0,
        )
        .map((variant) => [
          variant.name,
          variant.values[0],
        ]),
    )
  }

  if (product.colors.length > 0) {
    selection.Color =
      product.colors[0].name
  }

  return selection
}

export function getVariantPrice(
  product: Product,
  selected: Record<string, string>,
): number {
  if (!product.variantConfigs?.length) {
    return product.price
  }

  const config =
    getVariantConfig(product, selected)

  return config?.price ?? product.price
}

export function getVariantOldPrice(
  product: Product,
  selected: Record<string, string>,
): number | undefined {
  if (!product.variantConfigs?.length) {
    return product.oldPrice
  }

  const config =
    getVariantConfig(product, selected)

  return config?.oldPrice
}

export function getVariantStock(
  product: Product,
  selected: Record<string, string>,
): number {
  if (!product.variantConfigs?.length) {
    return product.stock
  }

  const config =
    getVariantConfig(product, selected)

  // Invalid configuration must NEVER use
  // the parent's total stock.
  return config?.stock ?? 0
}

export function getVariantSku(
  product: Product,
  selected: Record<string, string>,
): string {
  if (!product.variantConfigs?.length) {
    return product.id.toUpperCase()
  }

  const config =
    getVariantConfig(product, selected)

  // Do not create a fake SKU for an
  // impossible configuration.
  return config?.sku ?? ''
}

export function hasVariantPricing(
  product: Product,
): boolean {
  return (
    (product.variantConfigs?.length ?? 0) >
    0
  )
}

export function getMinPrice(
  product: Product,
): number {
  if (!product.variantConfigs?.length) {
    return product.price
  }

  return Math.min(
    ...product.variantConfigs.map(
      (config) => config.price,
    ),
  )
}

export function getMaxPrice(
  product: Product,
): number {
  if (!product.variantConfigs?.length) {
    return product.price
  }

  return Math.max(
    ...product.variantConfigs.map(
      (config) => config.price,
    ),
  )
}

export function getTotalStock(
  product: Product,
): number {
  if (!product.variantConfigs?.length) {
    return product.stock
  }

  return product.variantConfigs.reduce(
    (total, config) =>
      total + config.stock,
    0,
  )
}

export function isVariantConfigAvailable(
  product: Product,
  selected: Record<string, string>,
): boolean {
  if (!product.variantConfigs?.length) {
    return product.stock > 0
  }

  const config =
    getVariantConfig(product, selected)

  return Boolean(
    config && config.stock > 0,
  )
}

/**
 * Used by ProductDetails / QuickView.
 *
 * Example:
 * If MacBook 36GB + 4TB does not exist,
 * 4TB can be disabled while 36GB is active.
 */
export function isVariantValueAvailable(
  product: Product,
  variantName: string,
  value: string,
  currentSelection: Record<string, string>,
): boolean {
  if (!product.variantConfigs?.length) {
    return true
  }

  return product.variantConfigs.some(
    (config) => {
      if (
        config.values[variantName] !== value
      ) {
        return false
      }

      if (config.stock <= 0) {
        return false
      }

      return Object.entries(
        currentSelection,
      ).every(
        ([key, selectedValue]) => {
          // Color is currently a visual/cart
          // attribute and not part of pricing matrix.
          if (key === 'Color') {
            return true
          }

          // Ignore old selection for the field
          // currently being tested.
          if (key === variantName) {
            return true
          }

          // Ignore attributes not used by
          // this configuration.
          if (!(key in config.values)) {
            return true
          }

          return (
            config.values[key] ===
            selectedValue
          )
        },
      )
    },
  )
}

// =====================================================
// PRODUCT / CATEGORY HELPERS
// =====================================================

export function getCategoryBySlug(
  slug: string,
): Category | undefined {
  return categories.find(
    (category) =>
      category.slug === slug,
  )
}

export function getProductById(
  id: string,
): Product | undefined {
  return products.find(
    (product) => product.id === id,
  )
}

export function getProductsByCategory(
  categorySlug: string,
): Product[] {
  return products.filter(
    (product) =>
      product.category === categorySlug,
  )
}

export function getFeaturedProducts(): Product[] {
  return products.filter(
    (product) => product.isFeatured,
  )
}

export function getNewArrivals(): Product[] {
  return products.filter(
    (product) => product.isNew,
  )
}

export function getDeals(): Product[] {
  return products.filter(
    (product) => product.isDeal,
  )
}

export function getRelatedProducts(
  product: Product,
  limit = 4,
): Product[] {
  return products
    .filter(
      (candidate) =>
        candidate.category ===
          product.category &&
        candidate.id !== product.id,
    )
    .slice(0, limit)
}

export function searchProducts(
  query: string,
): Product[] {
  const normalizedQuery =
    query.toLowerCase().trim()

  if (!normalizedQuery) {
    return []
  }

  return products.filter((product) => {
    const searchableText = [
      product.name,
      product.brand,
      product.category,
      product.shortSpec,
      product.description,
      ...Object.values(
        product.specifications,
      ),
    ]
      .join(' ')
      .toLowerCase()

    return searchableText.includes(
      normalizedQuery,
    )
  })
}