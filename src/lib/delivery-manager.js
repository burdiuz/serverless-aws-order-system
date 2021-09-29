"use strict";

const aws = require("aws-sdk");
const orderManager = require("./order-manager");

const { region: AWS_REGION, deliveryQueue: DELIVERY_QUEUE } = process.env;

const sqs = new aws.SQS({
  region: AWS_REGION,
});

const notifyDeliveryService = (order) =>
  sqs
    .sendMessage({
      MessageBody: JSON.stringify(order),
      QueueUrl: DELIVERY_QUEUE,
    })
    .promise();

exports.handleFulfilledOrders = (orders) =>
  Promise.all(
    orders.map(async (order) => {
      const updatedOrder = await orderManager.updateOrderForDeliveryById(
        order.orderId
      );

      await notifyDeliveryService(updatedOrder);

      return updatedOrder;
    })
  );

exports.handleDeliveredOrder = async (orderId, deliveryCompanyId) => {
  const updatedOrder = await orderManager.updateDeliveredOrderById(
    orderId,
    deliveryCompanyId
  );

  return updatedOrder;
};
