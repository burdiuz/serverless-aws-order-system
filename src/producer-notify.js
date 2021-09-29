"use strict";

const kinesisHelper = require("./lib/kinesis-helper");
const producerManager = require('./lib/producer-manager');

exports.handle = async (event) => {
  const records = kinesisHelper
    .getRecords(event)
    .filter(({ eventType }) => eventType === "order_placed");

    if(!records.length) {
      return 'No orders placed.';
    }

    try{
      await producerManager.handlePlacedOrders(records);
      return 'New orders sent to the producer.';
    } catch (error) {
      return JSON.stringify(error, null, 2);
    }
};