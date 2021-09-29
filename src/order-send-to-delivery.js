"use strict";

const kinesisHelper = require("./lib/kinesis-helper");
const deliveryManager = require("./lib/delivery-manager");

exports.handle = async (event) => {
  const records = kinesisHelper
    .getRecords(event)
    .filter(({ eventType }) => eventType === "order_fulfilled");

  if (!records.length) {
    return "No new orders fulfilled.";
  }

  try {
    await deliveryManager.handleFulfilledOrders(records);
    return "Orders sent to the delivery service.";
  } catch (error) {
    return JSON.stringify(error, null, 2);
  }
};
