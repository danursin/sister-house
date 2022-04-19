import { APIResponse, Address, SearchParameters } from "../types";
import { SyntheticEvent, useEffect, useState } from "react";

import GoogleMap from "../components/GoogleMapPackage/GoogleMap";
import Layout from "../components/Layout";
import Marker from "../components/GoogleMapPackage/Marker";
import type { NextPage } from "next";
import Polyline from "../components/GoogleMapPackage/Polyline";
import Statistics from "../components/Statistics";
import { calculateRegression } from "../services/RegressionService";
import { useGoogleMap } from "../components/GoogleMapPackage/useGoogleMap";

const Home: NextPage = () => {
    const { bounds } = useGoogleMap();
    const [addresses, setAddresses] = useState<Address[]>();
    const [Add_Number, setAdd_Number] = useState<string>("");
    const [polylinePath, setPolylinePath] = useState<google.maps.LatLngLiteral[]>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!addresses || addresses.length < 2) {
            setPolylinePath(undefined);
            return;
        }
        const [a, b] = calculateRegression(
            addresses.map((a) => a.Latitude),
            addresses.map((a) => a.Longitude)
        );

        function getYValue(x: number) {
            return a + b * x;
        }

        function getXValue(y: number) {
            return (y - a) / b;
        }

        if (Math.abs(b) < 1) {
            // this line is mostly vertical
            let minLatitude = Infinity,
                maxLatitude = -Infinity;

            for (const a of addresses) {
                if (a.Latitude < minLatitude) {
                    minLatitude = a.Latitude;
                }
                if (a.Latitude > maxLatitude) {
                    maxLatitude = a.Latitude;
                }
            }

            setPolylinePath([
                { lat: minLatitude, lng: getYValue(minLatitude) },
                { lat: maxLatitude, lng: getYValue(maxLatitude) }
            ]);
        } else {
            // this line is mostly horizontal
            let minLongitude = Infinity,
                maxLongitude = -Infinity;

            for (const a of addresses) {
                if (a.Longitude < minLongitude) {
                    minLongitude = a.Longitude;
                }
                if (a.Longitude > maxLongitude) {
                    maxLongitude = a.Longitude;
                }
            }

            setPolylinePath([
                { lng: minLongitude, lat: getXValue(minLongitude) },
                { lng: maxLongitude, lat: getXValue(maxLongitude) }
            ]);
        }
    }, [addresses]);

    const onSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        setLoading(true);
        const params: SearchParameters = { Add_Number };
        if (bounds) {
            params.Bounds = bounds.toUrlValue();
        }
        const res = await fetch("/api/search?" + new URLSearchParams(params));
        const json: APIResponse<Address[]> = await res.json();
        setLoading(false);
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
                    <input
                        type="tel"
                        pattern="^\d+$"
                        title="House number must consist of only digits"
                        value={Add_Number}
                        onChange={(e) => setAdd_Number(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "Loading..." : "Search this area"}
                    </button>
                </div>
            </form>

            <GoogleMap apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string} style={{ flexGrow: "1", height: "60vh" }}>
                {addresses?.map((a) => (
                    <Marker
                        key={a.OID_}
                        position={{ lat: a.Latitude, lng: a.Longitude }}
                        title={`${a.Add_Number} ${a.StreetName} ${a.StN_PosTyp} (${new google.maps.LatLng({
                            lat: a.Latitude,
                            lng: a.Longitude
                        }).toUrlValue()})`}
                        clickable
                    />
                ))}
                {!!polylinePath && <Polyline path={polylinePath} strokeColor="purple" strokeWeight={5} />}
            </GoogleMap>

            {!!addresses && addresses.length > 1 && <Statistics addresses={addresses} />}
        </Layout>
    );
};

export default Home;
