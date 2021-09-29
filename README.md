This serverless app is a part of [AWS for Developers - Data-Driven Serverless Applications with Kinesis](https://www.linkedin.com/learning/aws-for-developers-data-driven-serverless-applications-with-kinesis) course.

Deploy it with [serverless framework](https://www.serverless.com/).
After deployment it will expose three API endpoints.
 * **POST /order** -- expects to contain a JSON object in body with fields `{ name, address, productId, quantity }`
 * **POST /order/fulfilled** -- expects to contain a JSON object in body with fields `{ orderId, fulfillmentId }`
 * **POST /order/delivered** -- expects to contain a JSON object in body with fields `{ orderId, deliveryCompanyId, orderReview }`
 All the fields may contain information in free form, except of `orderId`, where applicable -- must be a string and ID of existing order in DynamoDB.

 **POST /order/fulfilled** sends an email to `zppxxagv-producer@grr.la` from `zppxxagv-ordering-system@grr.la`, both emails must be validated in AWS. These emails were created on [guerrillamail.com](https://www.guerrillamail.com/inbox) and can be verified/viewed there.

 Both lambdas hooked to SQS `customer-service-notify.js` and `delivery-service-notify.js` are empty, these are final stages for `/order/fulfilled` and `/order/delivered` and for testing purposes it is enough to have logs in there. Logs can be observed in AWS CloudWatch.