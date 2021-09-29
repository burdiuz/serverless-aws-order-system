const aws = require("aws-sdk");

const {
  region: AWS_REGION,
  producerEmail: PRODUCER_EMAIL,
  orderingSystemEmail: ORDERING_SYSTEM_EMAIL,
} = process.env;

const ses = new aws.SES({ region: AWS_REGION });

const notifyProducerByEmail = (order) =>
  ses.sendEmail({
    Destination: {
      ToAddresses: [PRODUCER_EMAIL],
    },
    Message: {
      Body: {
        Text: {
          Data: JSON.stringify(order, null, 2),
        },
      },
      Subject: {
        Data: "New Order!",
      },
    },
    Source: ORDERING_SYSTEM_EMAIL,
  }).promise();

  exports.handlePlacedOrders = (orders) =>
    Promise.all(orders.map(notifyProducerByEmail));
