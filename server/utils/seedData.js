const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const Review = require('../models/Review');
const { getRawProducts } = require('./seedProducts');

const categoriesData = [
  {
    name: 'Fashion',
    slug: 'fashion',
    description: 'Trending ethnic wear, western apparel, and designer outfits for men and women.',
    icon: 'Shirt',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=60'
  },
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest audio gear, smartphones, wearables, smart home devices and gadgets.',
    icon: 'Smartphone',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop&q=60'
  },
  {
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    description: 'Modern cookware, aesthetic living room decor, ergonomic dining and appliances.',
    icon: 'Home',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=60'
  },
  {
    name: 'Beauty',
    slug: 'beauty',
    description: 'Cruelty-free cosmetics, rejuvenating skincare, wellness perfumes and organic care.',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=60'
  },
  {
    name: 'Books',
    slug: 'books',
    description: 'National bestsellers, self-help guides, literature, technology and academic titles.',
    icon: 'BookOpen',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=60'
  },
  {
    name: 'Sports',
    slug: 'sports',
    description: 'High-performance fitness gear, yoga accessories, gym equipment and outdoor kits.',
    icon: 'Dumbbell',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=60'
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Leather wallets, luxury polarized sunglasses, jewelry, belts and travel bags.',
    icon: 'Watch',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=60'
  },
  {
    name: 'Footwear',
    slug: 'footwear',
    description: 'Running trainers, casual sneakers, formal shoes and comfortable flip-flops.',
    icon: 'Footprints',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60'
  }
];

const runSeed = async () => {
  console.log('Seeding Categories...');
  await Category.deleteMany({});
  await Category.insertMany(categoriesData);

  console.log('Seeding Demo Users (Admin, Vendors, Customers)...');
  await User.deleteMany({});

  // 1. Admin
  const admin = await User.create({
    name: 'Marketplace Admin',
    email: 'admin@marketplace.com',
    password: 'admin123',
    phone: '+91 99000 00001',
    role: 'admin'
  });

  // 2. Vendor 1 - Fashion Aura (Approved)
  const vendor1 = await User.create({
    name: 'Aarav Sharma',
    email: 'vendor1@marketplace.com',
    password: 'vendor123',
    phone: '+91 98765 11111',
    role: 'vendor',
    vendorProfile: {
      storeName: 'Fashion Aura & Apparels',
      storeDescription: 'Premier ethnic collection, handcrafted kurtis, genuine leather bags and accessories.',
      storeLogo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&auto=format&fit=crop&q=60',
      status: 'approved',
      contactDetails: {
        phone: '+91 98765 11111',
        email: 'fashionaura@vendor.marketplace.com',
        address: 'Block B, Textile Market, Surat, Gujarat'
      }
    }
  });

  // 3. Vendor 2 - ElectroTech Gadgets (Approved)
  const vendor2 = await User.create({
    name: 'Priya Patel',
    email: 'vendor2@marketplace.com',
    password: 'vendor123',
    phone: '+91 98765 22222',
    role: 'vendor',
    vendorProfile: {
      storeName: 'ElectroTech Gadgets',
      storeDescription: 'Certified brand distributor of high-fidelity audio, smart watches, chargers and gaming accessories.',
      storeLogo: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=300&auto=format&fit=crop&q=60',
      status: 'approved',
      contactDetails: {
        phone: '+91 98765 22222',
        email: 'support@electrotech.com',
        address: 'Electronic City Phase 1, Bengaluru, Karnataka'
      }
    }
  });

  // 4. Vendor 3 - Luxe Home & Living (Approved)
  const vendor3 = await User.create({
    name: 'Vikram Malhotra',
    email: 'vendor3@marketplace.com',
    password: 'vendor123',
    phone: '+91 98765 33333',
    role: 'vendor',
    vendorProfile: {
      storeName: 'Luxe Home & Living',
      storeDescription: 'Artisanal kitchenware, ergonomic accents, smart planters, and premium home essentials.',
      storeLogo: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&auto=format&fit=crop&q=60',
      status: 'approved',
      contactDetails: {
        phone: '+91 98765 33333',
        email: 'hello@luxehome.com',
        address: 'Sector 29, Cyber City, Gurugram, Haryana'
      }
    }
  });

  // 5. Vendor 4 - Organic Oasis (Pending Approval)
  const pendingVendor = await User.create({
    name: 'Ananya Deshmukh',
    email: 'pending@marketplace.com',
    password: 'vendor123',
    phone: '+91 98765 44444',
    role: 'vendor',
    vendorProfile: {
      storeName: 'Organic Oasis Ayurveda',
      storeDescription: 'All-natural herbal wellness, cold-pressed oils, and certified organic health foods awaiting verification.',
      storeLogo: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=300&auto=format&fit=crop&q=60',
      status: 'pending',
      contactDetails: {
        phone: '+91 98765 44444',
        email: 'ananya@organicoasis.in',
        address: 'Kalyan Nagar, Pune, Maharashtra'
      }
    }
  });

  // 6. Customers
  const customer1 = await User.create({
    name: 'Rahul Verma',
    email: 'customer@marketplace.com',
    password: 'customer123',
    phone: '+91 98765 99999',
    role: 'customer',
    addresses: [
      {
        street: '42 MG Road, 3rd Floor, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560038',
        isDefault: true
      }
    ]
  });

  const customer2 = await User.create({
    name: 'Meghana Sharma',
    email: 'meghana@example.com',
    password: 'customer123',
    phone: '+91 98123 45678',
    role: 'customer',
    addresses: [
      {
        street: 'Flat 402, Green Glen Layout, Outer Ring Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560103',
        isDefault: true
      }
    ]
  });

  console.log('Seeding Multi-Vendor Products (21+ per category across 8 categories)...');
  await Product.deleteMany({});

  const rawProducts = getRawProducts(vendor1, vendor2, vendor3);
  const createdProducts = await Product.insertMany(rawProducts);
  console.log(`Seeded ${createdProducts.length} multi-vendor products with unique photos!`);

  const prodBySku = {};
  createdProducts.forEach((p) => {
    prodBySku[p.sku] = p;
  });

  console.log('Seeding Sample Multi-Vendor Orders...');
  await Order.deleteMany({});

  const pKurti = prodBySku['KURTI-COT-01'];
  const pBag = prodBySku['BAG-LEA-02'];
  const pHeadphones = prodBySku['HEAD-ANC-01'];
  const pWatch = prodBySku['WATCH-SMT-02'];
  const pAirFryer = prodBySku['KIT-AF-01'];
  const pShoe = prodBySku['SHOE-RUN-05'];

  const multiVendorOrderItems = [
    {
      product: pKurti._id,
      name: pKurti.name,
      price: pKurti.price,
      quantity: 1,
      image: pKurti.images[0],
      vendor: vendor1._id,
      vendorStoreName: vendor1.vendorProfile.storeName,
      itemStatus: 'processing'
    },
    {
      product: pBag._id,
      name: pBag.name,
      price: pBag.price,
      quantity: 1,
      image: pBag.images[0],
      vendor: vendor1._id,
      vendorStoreName: vendor1.vendorProfile.storeName,
      itemStatus: 'confirmed'
    },
    {
      product: pHeadphones._id,
      name: pHeadphones.name,
      price: pHeadphones.price,
      quantity: 1,
      image: pHeadphones.images[0],
      vendor: vendor2._id,
      vendorStoreName: vendor2.vendorProfile.storeName,
      itemStatus: 'shipped'
    },
    {
      product: pWatch._id,
      name: pWatch.name,
      price: pWatch.price,
      quantity: 1,
      image: pWatch.images[0],
      vendor: vendor2._id,
      vendorStoreName: vendor2.vendorProfile.storeName,
      itemStatus: 'processing'
    }
  ];

  const subtotal1 = 699 + 899 + 1299 + 1999;
  const delivery1 = 0;
  const grandTotal1 = subtotal1 + delivery1;

  await Order.create({
    orderNumber: 'ORD-20261114-100234',
    customer: customer1._id,
    customerInfo: {
      name: customer1.name,
      email: customer1.email,
      phone: customer1.phone
    },
    shippingAddress: customer1.addresses[0],
    items: multiVendorOrderItems,
    subtotal: subtotal1,
    deliveryCharge: delivery1,
    grandTotal: grandTotal1,
    orderStatus: 'processing',
    paymentMethod: 'simulated_card',
    paymentStatus: 'paid',
    paymentResult: {
      id: 'SIM-TXN-DEMO-001',
      status: 'succeeded',
      update_time: new Date().toISOString(),
      simulated: true
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  });

  await Order.create({
    orderNumber: 'ORD-20261112-984512',
    customer: customer2._id,
    customerInfo: {
      name: customer2.name,
      email: customer2.email,
      phone: customer2.phone
    },
    shippingAddress: customer2.addresses[0],
    items: [
      {
        product: pAirFryer._id,
        name: pAirFryer.name,
        price: pAirFryer.price,
        quantity: 1,
        image: pAirFryer.images[0],
        vendor: vendor3._id,
        vendorStoreName: vendor3.vendorProfile.storeName,
        itemStatus: 'delivered'
      },
      {
        product: pShoe._id,
        name: pShoe.name,
        price: pShoe.price,
        quantity: 1,
        image: pShoe.images[0],
        vendor: vendor2._id,
        vendorStoreName: vendor2.vendorProfile.storeName,
        itemStatus: 'delivered'
      }
    ],
    subtotal: 2799 + 1599,
    deliveryCharge: 0,
    grandTotal: 4398,
    orderStatus: 'delivered',
    paymentMethod: 'simulated_upi',
    paymentStatus: 'paid',
    paymentResult: {
      id: 'SIM-TXN-DEMO-002',
      status: 'succeeded',
      update_time: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      simulated: true
    },
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
  });

  console.log('Seeding Sample Reviews...');
  await Review.deleteMany({});
  await Review.create([
    {
      product: pKurti._id,
      user: customer1._id,
      userName: customer1.name,
      rating: 5,
      comment: 'Outstanding stitch quality and pure soft cotton! Fits true to size and color is vibrant.'
    },
    {
      product: pHeadphones._id,
      user: customer2._id,
      userName: customer2.name,
      rating: 5,
      comment: 'The noise cancellation is remarkably good for this price bracket. Battery lasts multiple days easily.'
    }
  ]);

  console.log('Seed completed successfully!');
};

module.exports = { runSeed, categoriesData };
