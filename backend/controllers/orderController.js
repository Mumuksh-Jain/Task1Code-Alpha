import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Create a new order from cart
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  const { shippingAddress, contactNumber } = req.body;

  try {
    if (!shippingAddress || !contactNumber) {
      return res.status(400).json({ success: false, message: 'Please provide shipping address and contact number' });
    }

    // Find user's cart
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty' });
    }

    // Verify stock and prepare order items
    const orderProducts = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = item.productId;
      if (!product) {
        return res.status(404).json({ success: false, message: 'One or more products in your cart no longer exist' });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product "${product.name}". Available: ${product.stock}, in cart: ${item.quantity}`
        });
      }

      orderProducts.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        imageUrl: product.imageUrl,
      });

      totalAmount += product.price * item.quantity;
    }

    // Deduct stock from products
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.productId._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Create Order
    const order = await Order.create({
      userId: req.user.id,
      products: orderProducts,
      totalAmount,
      shippingAddress,
      contactNumber,
      status: 'Completed', // For assignment convenience, auto-mark completed upon placement
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
