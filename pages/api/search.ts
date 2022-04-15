import { APIResponse, Address, SearchParameters } from "../../types";
import type { NextApiRequest, NextApiResponse } from "next";

import { getKnex } from "../../db";

export default async function handler(req: NextApiRequest, res: NextApiResponse<APIResponse<Address[]>>) {
    const { Add_Number } = req.query as SearchParameters;
    if (!Add_Number) {
        res.status(400).json({ error: "Missing required parameter 'Add_Number'" });
    }
    const data = await getKnex()
        .from<Address>("NationalAddressDatabase")
        .where({ Add_Number })
        .select(["OID_", "State", "County", "Zip_Code", "Add_Number", "StreetName", "StN_PosTyp", "StN_PosDir", "Longitude", "Latitude"]);

    res.status(200).json({ data });
}
