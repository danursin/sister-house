import { APIResponse, Address, SearchParameters } from "../../types";
import type { NextApiRequest, NextApiResponse } from "next";

import { getKnex } from "../../db";

export default async function handler(req: NextApiRequest, res: NextApiResponse<APIResponse<Address[]>>) {
    const { Add_Number, Bounds } = req.query as SearchParameters;
    if (!Add_Number) {
        res.status(400).json({ error: "Missing required parameter 'Add_Number'" });
    }

    const query = getKnex().from<Address>("NationalAddressDatabase").where({ Add_Number });

    if (Bounds) {
        const [lat_lo, lng_lo, lat_hi, lng_hi] = Bounds.split(",");
        query.andWhereBetween("Latitude", [+lat_lo, +lat_hi]).andWhereBetween("Longitude", [+lng_lo, +lng_hi]);
    }

    const data = await query.select([
        "OID_",
        "State",
        "County",
        "Zip_Code",
        "Add_Number",
        "StreetName",
        "StN_PosTyp",
        "StN_PosDir",
        "Longitude",
        "Latitude"
    ]);

    res.status(200).json({ data });
}
