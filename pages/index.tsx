import { APIResponse, Address } from "../types";
import { SyntheticEvent, useState } from "react";

import Layout from "../components/Layout";
import type { NextPage } from "next";
import { SearchParameters } from "./api/search";

const Home: NextPage = () => {
    const [addresses, setAddresses] = useState<Address[]>();
    const [params, setParams] = useState<SearchParameters>({
        Add_Number: ""
    });

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

                {!addresses && <p>Enter parameters to see addresses</p>}
                {!!addresses && (
                    <ul>
                        {addresses.map(({ OID_, Add_Number, StreetName }) => (
                            <li key={OID_}>
                                <address>
                                    {Add_Number} {StreetName}
                                </address>
                            </li>
                        ))}
                    </ul>
                )}
            </form>
        </Layout>
    );
};

export default Home;
