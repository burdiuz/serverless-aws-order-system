"use strict";

const parsePayload = ({ kinesis: { data } }) =>
  JSON.parse(new Buffer(data, "base64").toString("utf8"));

exports.getRecords = ({ Records }) => Records.map(parsePayload);
