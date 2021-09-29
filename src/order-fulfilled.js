"use strict";

const { responseCompose } = require("./lib/http-response");
const orderManager = require("./lib/order-manager");

exports.handle = async (event) => {
  const { orderId, fulfillmentId } = JSON.parse(event.body) || {};

  try {
    const order = await orderManager.fulfillOrderById(orderId, fulfillmentId);
    return responseCompose(order);
  } catch (error) {
    return responseCompose(error, 400);
  }
};