const fs = require('fs');
const cuid = require('cuid');

function updateDatabase(orders) {
  fs.writeFileSync(`${__dirname}/../db.json`, JSON.stringify(orders), 'utf-8');
}

/**
 * @returns {Object[]} = returns an array of orders
 */
function getAllOrders() {
  const orders = JSON.parse(
    fs.readFileSync(`${__dirname}/../db.json`, 'utf-8')
  );
  return orders;
}

/**
 * @param {string} id = the ID of the order to retrieve
 * @returns {Object} = returns 1 order
 */
function getOrderByID(id) {
  const orders = getAllOrders();
  let order = orders.find(order => order.id === id);
  return order;
}

/**
 * @param {Object} order = object of the new order
 * @returns {Object} = returns the newly created order
 */
function insertOne(order) {
  let newOrder = {
    id: cuid(),
    ...order
  };
  const orders = getAllOrders();
  orders.push(newOrder);
  updateDatabase(orders);
  return newOrder;
}

/**
 * @param {string} id = ID of the order to update
 * @param {Object} input = object containing any fields that need to be updated
 * @returns {Object} = returns the updated order
 */
function updateOrderByID(id, input) {
  const orders = getAllOrders();
  let index = orders.findIndex(order => order.id === id);
  let order = orders[index];
  orders[index] = { ...order, ...input };
  const updatedOrder = orders[index];
  updateDatabase(orders);
  return updatedOrder;
}

function deleteOrderByID(id) {
  let orders = getAllOrders();
  const deletedOrder = { ...orders.find(el => el.id === id) };
  orders = orders.filter(order => order.id !== id);
  updateDatabase(orders);
  return deletedOrder;
}

module.exports = {
  getAllOrders,
  getOrderByID,
  insertOne,
  updateOrderByID,
  deleteOrderByID
};
