import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';

dotenv.config();

const products = [
  {
    name: 'AeroSound Pro Headphones',
    description: 'Experience studio-grade acoustics with adaptive active noise cancellation, memory-foam ear cushions, and 45 hours of immersive wireless battery life.',
    price: 299,
    imageUrl: '/assets/images/headphones.svg',
    stock: 15,
    category: 'Audio',
  },
  {
    name: 'Vanguard Minimal Smartwatch',
    description: 'Sleek titanium smart wearable with wellness vitals tracking, continuous heart-monitoring, built-in GPS, and ambient always-on AMOLED glass.',
    price: 249,
    imageUrl: '/assets/images/watch.svg',
    stock: 12,
    category: 'Wearables',
  },
  {
    name: 'NeoType mechanical Keyboard',
    description: 'Retro mechanical keyboard featuring hot-swappable linear switches, sleek custom PBT keycaps, and customizable dynamic RGB underglow.',
    price: 149,
    imageUrl: '/assets/images/keyboard.svg',
    stock: 8,
    category: 'Peripherals',
  },
  {
    name: 'Helios Ultra-Thin Laptop',
    description: 'Featherlight power-house featuring a 14-inch HDR display, state-of-the-art multi-core processor, 16GB RAM, and 1TB ultra-fast NVMe storage.',
    price: 1299,
    imageUrl: '/assets/images/laptop.svg',
    stock: 5,
    category: 'Computers',
  },
  {
    name: 'Lumix Prime Mirrorless Camera',
    description: 'Capture detailed visuals with a 24.2 MP full-frame sensor, 4K cinema recording, real-time autofocus tracking, and 5-axis body image stabilization.',
    price: 899,
    imageUrl: '/assets/images/camera.svg',
    stock: 6,
    category: 'Cameras',
  },
  {
    name: 'Orbita Surround Bluetooth Speaker',
    description: 'Immersive 360-degree acoustics inside a water-resistant, fabric-wrapped design. Features booming bass radiator and a 12-hour portable battery.',
    price: 129,
    imageUrl: '/assets/images/speaker.svg',
    stock: 20,
    category: 'Audio',
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected for seeding...');

    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();
    await Order.deleteMany();
    console.log('Cleared existing collections.');

    // Seed Products
    const seededProducts = await Product.insertMany(products);
    console.log(`Seeded ${seededProducts.length} products successfully.`);

    // Seed Admin User
    const adminUser = await User.create({
      name: 'Alpha Admin',
      email: 'admin@alpha.com',
      password: 'adminpassword',
      role: 'admin',
    });
    // Create empty cart for admin
    await Cart.create({ userId: adminUser._id, items: [] });
    console.log('Seeded Admin account (Email: admin@alpha.com, Password: adminpassword)');

    // Seed Standard User
    const normalUser = await User.create({
      name: 'John Doe',
      email: 'user@alpha.com',
      password: 'userpassword',
      role: 'user',
    });
    // Create empty cart for normal user
    await Cart.create({ userId: normalUser._id, items: [] });
    console.log('Seeded User account (Email: user@alpha.com, Password: userpassword)');

    console.log('Data Seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
