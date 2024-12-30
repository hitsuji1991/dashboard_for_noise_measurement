import { util } from "@aws-appsync/utils";
import * as ddb from "@aws-appsync/utils/dynamodb";

export function request(ctx) {
  console.log('resolver(insertNoiseLevelData)#request', ctx);
  const { device_id, timestamp, noise_level } = ctx.args;
  return ddb.put({
    key: { device_id, timestamp },
    item: { device_id, timestamp, noise_level }
  });
}

export function response(ctx) {
  console.log('resolver(insertNoiseLevelData)#response', ctx);

  const { error, result } = ctx;
  if (error) {
    return util.appendError(error.message, error.type, result);
  }
  return result;
}
