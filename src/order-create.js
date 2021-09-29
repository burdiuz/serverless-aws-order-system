"use strict";

const orderManager = require("./lib/order-manager");
const { responseCompose } = require("./lib/http-response");

exports.handle = async (event) => {
  const body = JSON.parse(event.body);
  const order = orderManager.createOrder(body);

  try {
    await orderManager.placeNewOrder(order);
    return responseCompose(order);
  } catch (error) {
    return responseCompose(error, 400);
  }
};