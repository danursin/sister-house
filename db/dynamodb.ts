import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string
    }
});

const dynamodb = DynamoDBDocumentClient.from(client, { marshallOptions: { removeUndefinedValues: true } });

export const TABLE_NAME = "sister-house";
export const GEOHASH_PRECISION = 7;

export default dynamodb;
