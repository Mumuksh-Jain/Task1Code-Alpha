import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';

dotenv.config();

const products = [
  {
    name: 'Minimalist Wireless Headphones',
    description: 'Experience studio-grade acoustics with active noise cancellation, matte-finish ear cushions, and 45 hours of immersive wireless battery life.',
    price: 14999,
    imageUrl: '/assets/images/headphones.svg',
    stock: 15,
    category: 'Audio',
  },
  {
    name: 'Classic Slate Smartwatch',
    description: 'Sleek matte titanium smart wearable with health vitals monitoring, built-in GPS, and a clean ambient AMOLED layout.',
    price: 8499,
    imageUrl: '/assets/images/watch.svg',
    stock: 12,
    category: 'Wearables',
  },
  {
    name: 'Tenkeyless Mechanical Keyboard',
    description: 'Compact mechanical keyboard featuring silent linear switches, textured custom keycaps, and warm monochrome backlight accents.',
    price: 4999,
    imageUrl: '/assets/images/keyboard.svg',
    stock: 8,
    category: 'Peripherals',
  },
  {
    name: 'Ultra-Slim Aluminium Laptop',
    description: 'Featherlight notebook featuring a 14-inch IPS display, efficient multi-core processor, 16GB RAM, and 512GB ultra-fast storage.',
    price: 89999,
    imageUrl: '/assets/images/laptop.svg',
    stock: 5,
    category: 'Computers',
  },
  {
    name: 'Compact Mirrorless Camera',
    description: 'Capture detailed visuals with a modern APS-C sensor, 4K video recording capability, and lightweight body construction.',
    price: 54999,
    imageUrl: '/assets/images/camera.svg',
    stock: 6,
    category: 'Cameras',
  },
  {
    name: 'Portable Cylindrical Speaker',
    description: 'Clean acoustics inside a fabric-wrapped water-resistant design. Features deep bass radiator and a 12-hour portable battery.',
    price: 3499,
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
