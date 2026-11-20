const fs = require('fs');
const path = require('path');
const DATA_DIR = process.env.VERCEL ? '/tmp' : path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

function readOrders() {
  try {
    if (!fs.existsSync(ORDERS_FILE)) {
      fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    const content = fs.readFileSync(ORDERS_FILE, 'utf-8');
    return JSON.parse(content || '[]');
  } catch (err) {
    console.error('Error reading orders.json:', err);
    return [];
  }
}

function writeOrders(orders) {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing orders.json:', err);
  }
}

const db = {
  getOrders() {
    return readOrders();
  },

  getOrderById(id) {
    const orders = readOrders();
    return orders.find(o => o.id === id || o.autogopayOrderId === id || o.autogopayTransactionId === id);
  },

  createOrder(order) {
    const orders = readOrders();
    orders.unshift(order);
    writeOrders(orders);
    return order;
  },

  updateOrder(id, updates) {
    const orders = readOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) return null;
    orders[index] = { ...orders[index], ...updates, updatedAt: new Date().toISOString() };
    writeOrders(orders);
    return orders[index];
  },

  findOrdersByContact(contact) {
    if (!contact) return [];
    const clean = contact.replace(/\D/g, '');
    const orders = readOrders();
    return orders.filter(o => {
      const wa = (o.whatsapp || '').replace(/\D/g, '');
      const email = (o.email || '').toLowerCase();
      return (clean && wa.includes(clean)) || (email && email.includes(contact.toLowerCase()));
    });
  }
};

module.exports = db;
