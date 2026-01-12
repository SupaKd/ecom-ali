import * as orderService from '../services/orderService.js';

export async function getOrders(req, res, next) {
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (error) {
    next(error);
  }
}

export async function getOrderById(req, res, next) {
  try {
    const order = await orderService.getOrderById(req.params.id);
    res.json(order);
  } catch (error) {
    next(error);
  }
}

export async function getOrderByNumber(req, res, next) {
  try {
    const order = await orderService.getOrderByNumber(req.params.orderNumber);
    res.json(order);
  } catch (error) {
    next(error);
  }
}

export async function getOrdersByEmail(req, res, next) {
  try {
    const orders = await orderService.getOrdersByEmail(req.params.email);
    res.json(orders);
  } catch (error) {
    next(error);
  }
}

export async function createOrder(req, res, next) {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    const order = await orderService.changeOrderStatus(req.params.id, status);
    res.json(order);
  } catch (error) {
    next(error);
  }
}