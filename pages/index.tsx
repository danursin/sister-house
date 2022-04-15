import { APIResponse, Address, SearchParameters } from "../types";
import { SyntheticEvent, useState } from "react";

import AddressMap from "../components/AddressMap";
import Layout from "../components/Layout";
import type { NextPage } from "next";

const Home: NextPage = () => {
    const [addresses, setAddresses] = useState<Address[]>();
    const [params, setParams] = useState<SearchParameters>({
        Add_Number: ""
    });
    const [zoom, setZoom] = useState<number>(3);
    const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat: -45, lng: 15 });

    const onSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
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
                <div>
                    <label>House Number</label>
                    <input
                        type="text"
                        value={params.Add_Number}
                        onChange={(e) => setParams({ ...params, Add_Number: e.target.value })}
                        required
                    />
                </div>
            </form>

            <AddressMap addresses={addresses ?? []} center={center} zoom={zoom} />

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
