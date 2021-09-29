
const deliveryManager = require("./lib/delivery-manager");
const customerServiceManager = require("./lib/customer-service-manager");
const { responseCompose } = require("./lib/http-response");

exports.handle = async (event) => {
  const { orderId, deliveryCompanyId, orderReview } = JSON.parse(event.body);

  try {
    const order = await deliveryManager.handleDeliveredOrder(orderId, deliveryCompanyId, orderReview);
    await customerServiceManager.sendReviewForCustomerService(orderId, orderReview);

    return responseCompose(order);
  } catch (error) {
    return responseCompose(error, 400);
  }
};