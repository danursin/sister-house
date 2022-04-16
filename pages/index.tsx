import { APIResponse, Address, SearchParameters } from "../types";
import { SyntheticEvent, useState } from "react";

import GoogleMap from "../components/GoogleMapPackage/GoogleMap";
import Layout from "../components/Layout";
import Marker from "../components/GoogleMapPackage/Marker";
import type { NextPage } from "next";
import { useGoogleMap } from "../components/GoogleMapPackage/useGoogleMap";

const Home: NextPage = () => {
    const { bounds } = useGoogleMap();
    const [addresses, setAddresses] = useState<Address[]>();
    const [Add_Number, setAdd_Number] = useState<string>("");

    const onSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        const params: SearchParameters = { Add_Number };
        if (bounds) {
            params.Bounds = bounds.toUrlValue();
        }
        const res = await fetch("/api/search?" + new URLSearchParams(params));
        const json: APIResponse<Address[]> = await res.json();

        if ("error" in json) {
            alert(json.error);
            return;
        }
        setAddresses(json.data);
    };
    return (
        <Layout>
            <form onSubmit={onSubmit}>
                <div className="field">
                    <label>House Number</label>
                    <input type="text" value={Add_Number} onChange={(e) => setAdd_Number(e.target.value)} required />
                    <button type="submit">Search this area</button>
                </div>
            </form>

            <GoogleMap apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string} style={{ flexGrow: "1", height: "60vh" }}>
                {addresses?.map((a) => (
                    <Marker key={a.OID_} position={{ lat: a.Latitude, lng: a.Longitude }} />
                ))}
            </GoogleMap>

            {!addresses && <p>Enter parameters to see addresses</p>}
            {!!addresses && (
                <div style={{ display: "flex", height: "100%" }}>
                    <ul>
                        {addresses.map(({ OID_, Add_Number, StreetName }) => (
                            <li key={OID_}>
                                <address>
                                    {Add_Number} {StreetName}
                                </address>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </Layout>
    );
};

export default Home;
