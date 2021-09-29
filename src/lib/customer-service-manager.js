"use strict";

const aws = require("aws-sdk");

const { region: AWS_REGION, customerServiceQueue: CUSTOMER_SERVICE_QUEUE } =
  process.env;

const sqs = new aws.SQS({
  region: AWS_REGION,
});

const notifyCustomerService = (review) =>
  sqs
    .sendMessage({
      MessageBody: JSON.stringify(review),
      QueueUrl: CUSTOMER_SERVICE_QUEUE,
    })
    .promise();

exports.sendReviewForCustomerService = (orderId, orderReview) =>
  notifyCustomerService({
    orderId,
    orderReview,
    reviewDate: Date.now(),
  });
