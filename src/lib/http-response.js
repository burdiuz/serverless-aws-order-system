"use strict";

exports.responseCompose = (body, statusCode = 200) => ({
  statusCode,
  body: JSON.stringify(body),
});
