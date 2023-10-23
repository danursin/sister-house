import { APIResponse, Address, SearchParameters } from "../../types";
import type { NextApiRequest, NextApiResponse } from "next";
import dynamodb, { GEOHASH_PRECISION, TABLE_NAME } from "../../db/dynamodb";

import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import ngeohash from "ngeohash";

export default async function handler(req: NextApiRequest, res: NextApiResponse<APIResponse<Address[]>>) {
    const { address, bounds } = req.query as SearchParameters;
    if (!address) {
        res.status(400).json({ error: "Missing required parameter 'address'" });
    }

    try {
        const [lat_lo, lng_lo, lat_hi, lng_hi] = bounds.split(",");

        const minLat = +lat_lo;
        const maxLat = +lat_hi;
        const minLng = +lng_lo;
        const maxLng = +lng_hi;

        const hashes = ngeohash.bboxes(minLat, minLng, maxLat, maxLng, GEOHASH_PRECISION - 3);

        const addressNumber = parseInt(address);
        const addresses: Address[] = [];

        await Promise.all(
            hashes.map(async (hash) => {
                const { Items } = await dynamodb.send(
                    new QueryCommand({
                        TableName: TABLE_NAME,
                        KeyConditionExpression: "#PK = :pk AND begins_with(#SK, :sk)",
                        ExpressionAttributeNames: {
                            "#PK": "PK",
                            "#SK": "SK"
                        },
                        ExpressionAttributeValues: {
                            ":pk": addressNumber,
                            ":sk": hash
                        }
                    })
                );

                if (Items) {
                    addresses.push(...(Items as Address[]));
                }
            })
        );

        res.status(200).json({ data: addresses });
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
}
