import { APIResponse, Address, SearchParameters } from "../../types";
import type { NextApiRequest, NextApiResponse } from "next";
import dynamodb, { GEOHASH_PRECISION, TABLE_NAME } from "../../db/dynamodb";

import { BatchGetCommand } from "@aws-sdk/lib-dynamodb";
import ngeohash from "ngeohash";

export default async function handler(req: NextApiRequest, res: NextApiResponse<APIResponse<Address[]>>) {
    const { address, bounds } = req.query as SearchParameters;
    if (!address) {
        res.status(400).json({ error: "Missing required parameter 'address'" });
    }

    const [lat_lo, lng_lo, lat_hi, lng_hi] = bounds.split(",");

    const minLat = +lat_lo;
    const maxLat = +lat_hi;
    const minLng = +lng_lo;
    const maxLng = +lng_hi;

    const hashes = ngeohash.bboxes(minLat, minLng, maxLat, maxLng, GEOHASH_PRECISION);

    const addressNumber = parseInt(address);
    const addresses: Address[] = [];
    const batchSize = 100;

    while (hashes.length) {
        const batch = hashes.splice(0, batchSize);
        const { Responses } = await dynamodb.send(
            new BatchGetCommand({
                RequestItems: {
                    [TABLE_NAME]: {
                        Keys: batch.map((geohash) => ({
                            PK: addressNumber,
                            SK: geohash
                        }))
                    }
                }
            })
        );
        const data = (Responses?.[TABLE_NAME] ?? []) as Address[];
        addresses.push(...data);
    }

    res.status(200).json({ data: addresses });
}
