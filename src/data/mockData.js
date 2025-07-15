
export const mockProducts = [
  {
    id: 'product_tomato_001',
    name: '有機番茄',
    price: 150,
    originalPrice: 180,
    image: '🍅',
    category: 'vegetable',
    description: '新鮮有機番茄，無農藥殘留，口感鮮甜多汁',
    farm: '陽光農場',
    location: '台中市',
    stock: 25,
    unit: '斤',
    isActive: true,
    featured: true,
    tags: ['有機', '無農藥', '新鮮'],
    nutritionInfo: {
      calories: 18,
      vitamin_c: '高',
      fiber: '中'
    },
    storageInfo: '冷藏保存，建議3-5天內食用完畢'
  },
  {
    id: 'product_cabbage_002',
    name: '高山高麗菜',
    price: 80,
    originalPrice: 100,
    image: '🥬',
    category: 'vegetable',
    description: '來自合歡山的高山高麗菜，清脆爽口',
    farm: '高山農場',
    location: '南投縣',
    stock: 15,
    unit: '顆',
    isActive: true,
    featured: false,
    tags: ['高山', '清脆', '當季'],
    nutritionInfo: {
      calories: 25,
      vitamin_k: '高',
      fiber: '高'
    },
    storageInfo: '冷藏保存，建議7天內食用完畢'
  },
  {
    id: 'product_carrot_003',
    name: '有機胡蘿蔔',
    price: 120,
    originalPrice: 140,
    image: '🥕',
    category: 'vegetable',
    description: '有機栽培胡蘿蔔，營養豐富，適合全家食用',
    farm: '綠野農場',
    location: '彰化縣',
    stock: 30,
    unit: '斤',
    isActive: false,
    featured: false,
    tags: ['有機', '營養', '胡蘿蔔素'],
    nutritionInfo: {
      calories: 41,
      vitamin_a: '極高',
      fiber: '高'
    },
    storageInfo: '陰涼乾燥處保存，可保存2-3週'
  },
  {
    id: 'product_corn_004',
    name: '新鮮玉米',
    price: 100,
    originalPrice: 120,
    image: '🌽',
    category: 'vegetable',
    description: '香甜可口的新鮮玉米，適合烤煮或煮湯',
    farm: '金黃農場',
    location: '雲林縣',
    stock: 20,
    unit: '根',
    isActive: true,
    featured: true,
    tags: ['香甜', '新鮮', '多用途'],
    nutritionInfo: {
      calories: 86,
      carbs: '高',
      fiber: '中'
    },
    storageInfo: '冷藏保存，建議3天內食用完畢'
  },
  {
    id: 'product_mango_005',
    name: '愛文芒果',
    price: 280,
    originalPrice: 320,
    image: '🥭',
    category: 'fruit',
    description: '台南愛文芒果，香甜多汁，果肉細膩',
    farm: '南國果園',
    location: '台南市',
    stock: 12,
    unit: '斤',
    isActive: true,
    featured: true,
    tags: ['愛文', '香甜', '台南特產'],
    nutritionInfo: {
      calories: 60,
      vitamin_c: '高',
      vitamin_a: '高'
    },
    storageInfo: '室溫熟成後冷藏，建議5天內食用完畢'
  },
  {
    id: 'product_banana_006',
    name: '有機香蕉',
    price: 90,
    originalPrice: 110,
    image: '🍌',
    category: 'fruit',
    description: '有機栽培香蕉，天然熟成，營養價值高',
    farm: '熱帶果園',
    location: '屏東縣',
    stock: 35,
    unit: '串',
    isActive: true,
    featured: false,
    tags: ['有機', '天然熟成', '高鉀'],
    nutritionInfo: {
      calories: 89,
      potassium: '高',
      vitamin_b6: '高'
    },
    storageInfo: '室溫保存，避免陽光直射'
  },
  {
    id: 'product_strawberry_007',
    name: '溫室草莓',
    price: 350,
    originalPrice: 400,
    image: '🍓',
    category: 'fruit',
    description: '溫室栽培草莓，香甜可口，顆粒飽滿',
    farm: '莓好農場',
    location: '苗栗縣',
    stock: 8,
    unit: '盒',
    isActive: false,
    featured: true,
    tags: ['溫室', '香甜', '顆粒飽滿'],
    nutritionInfo: {
      calories: 32,
      vitamin_c: '極高',
      antioxidants: '高'
    },
    storageInfo: '冷藏保存，建議2-3天內食用完畢'
  },
  {
    id: 'product_rice_008',
    name: '池上米',
    price: 450,
    originalPrice: 500,
    image: '🌾',
    category: 'grain',
    description: '台東池上優質米，粒粒飽滿，香Q可口',
    farm: '池上農會',
    location: '台東縣',
    stock: 50,
    unit: '包(3kg)',
    isActive: true,
    featured: true,
    tags: ['池上米', '優質', '香Q'],
    nutritionInfo: {
      calories: 130,
      carbs: '高',
      protein: '中'
    },
    storageInfo: '密封乾燥處保存，可保存6個月'
  }
];

export const categories = [
  { id: 'all', name: '全部商品', icon: 'home' },
  { id: 'vegetable', name: '蔬菜類', icon: '🥬' },
  { id: 'fruit', name: '水果類', icon: '🍎' },
  { id: 'grain', name: '穀物類', icon: '🌾' }
];