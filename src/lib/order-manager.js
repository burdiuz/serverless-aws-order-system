"use strict";

const { v1: uuidv1 } = require("uuid");
const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const kinesis = new AWS.Kinesis();

const { ordersTableName: TABLE_NAME, ordersStreamName: STREAM_NAME } =
  process.env;

exports.createOrder = ({ name, address, productId, quantity }) => ({
  name,
  address,
  productId,
  quantity,
  orderId: uuidv1(),
  orderDate: Date.now(),
  eventType: "order_placed",
});

exports.placeNewOrder = async (order) => {
  await saveOrder(order);
  const result = await placeOrderIntoStream(order);
  return result;
};

exports.fulfillOrderById = async (orderId, fulfillmentId) => {
  const order = await getOrderById(orderId);

  if (!order) {
    throw new Error(`Order with id "${orderId}" could not be found.`);
  }

  const updOrder = await fulfillOrder(order, fulfillmentId);
  const result = await placeOrderIntoStream(updOrder);

  return result;
};

exports.updateOrderForDeliveryById = async (orderId) => {
  const order = await getOrderById(orderId);
  const updatedOrder = { ...order, sentToDeliveryDate: Date.now() };

  saveOrder(updatedOrder);
  
  return updatedOrder;
};

exports.updateDeliveredOrderById = async (orderId, deliveryCompanyId) => {
  const order = await getOrderById(orderId);
  const updatedOrder = {
    ...order,
    deliveryCompanyId,
    deliveryDate: Date.now(),
    eventType: "order_delivered",
  };

  saveOrder(updatedOrder);
  
  return updatedOrder;

}

const getOrderById = (orderId) =>
  dynamo
    .get({
      Key: { orderId },
      TableName: TABLE_NAME,
    })
    .promise()
    .then(({ Item }) => Item);

const fulfillOrder = (order, fulfillmentId, fulfillmentDate = Date.now()) => {
  const updOrder = {
    ...order,
    fulfillmentId,
    fulfillmentDate,
    eventType: "order_fulfilled",
  };

  return dynamo
    .put({
      TableName: TABLE_NAME,
      Item: updOrder,
    })
    .promise()
    .then(() => updOrder);
};

const saveOrder = (order) =>
  dynamo
    .put({
      TableName: TABLE_NAME,
      Item: order,
    })
    .promise();

const placeOrderIntoStream = (order) =>
  kinesis
    .putRecord({
      Data: JSON.stringify(order),
      PartitionKey: order.orderId,
      StreamName: STREAM_NAME,
    })
    .promise();
