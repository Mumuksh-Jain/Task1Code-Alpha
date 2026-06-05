import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');

    // Create cart if it doesn't exist yet
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const qty = parseInt(quantity, 10) || 1;

  try {
    // Check if product exists and check stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock < qty) {
      return res.status(400).json({ success: false, message: `Only ${product.stock} items in stock` });
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }

    // Check if item already in cart
    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

    if (itemIndex > -1) {
      // Check total combined stock
      const newQty = cart.items[itemIndex].quantity + qty;
      if (product.stock < newQty) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Max stock is ${product.stock}, and you already have ${cart.items[itemIndex].quantity} in cart.`
        });
      }
      cart.items[itemIndex].quantity = newQty;
    } else {
      cart.items.push({ productId, quantity: qty });
    }

    await cart.save();
    
    // Return populated cart
    const populatedCart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    res.status(200).json({ success: true, cart: populatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update quantity of item in cart
// @route   PUT /api/cart/update
// @access  Private
export const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;
  const qty = parseInt(quantity, 10);

  try {
    if (qty < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    // Check product stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock < qty) {
      return res.status(400).json({ success: false, message: `Only ${product.stock} items in stock` });
    }

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = qty;
      await cart.save();
      
      const populatedCart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
      res.status(200).json({ success: true, cart: populatedCart });
    } else {
      res.status(404).json({ success: false, message: 'Item not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
export const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter((item) => item.productId.toString() !== req.params.productId);
    await cart.save();

    const populatedCart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    res.status(200).json({ success: true, cart: populatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
// @access  Private
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({ success: true, cart, message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
