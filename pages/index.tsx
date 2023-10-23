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
    const [address, setAddress] = useState<string>("");
    const [polylinePath, setPolylinePath] = useState<google.maps.LatLngLiteral[]>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!addresses || addresses.length < 2) {
            setPolylinePath(undefined);
            return;
        }
        const [a, b] = calculateRegression(
            addresses.map((a) => a.lat),
            addresses.map((a) => a.lng)
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
                if (a.lat < minLatitude) {
                    minLatitude = a.lat;
                }
                if (a.lat > maxLatitude) {
                    maxLatitude = a.lat;
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
                if (a.lng < minLongitude) {
                    minLongitude = a.lng;
                }
                if (a.lng > maxLongitude) {
                    maxLongitude = a.lng;
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
        if (!bounds) {
            return;
        }

        setLoading(true);
        const params: SearchParameters = { address, bounds: bounds.toUrlValue() };
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
                        placeholder="Enter House Number"
                        title="House number must consist of only digits"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "Loading..." : "Search this area"}
                    </button>
                </div>
            </form>

            <GoogleMap apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string} style={{ flexGrow: "1", height: "60vh" }}>
                {addresses?.map((a) => {
                    const key = [a.PK, a.SK].join();
                    return (
                        <Marker
                            key={key}
                            position={{ lat: a.lat, lng: a.lng }}
                            title={`${a.address} ${a.street} ${a.type} (${new google.maps.LatLng({
                                lat: a.lat,
                                lng: a.lng
                            }).toUrlValue()})`}
                            onClick={() => {
                                setAddresses(addresses.filter((thisA) => [thisA.PK, thisA.SK].join() !== key));
                            }}
                        />
                    );
                })}
                {!!polylinePath && <Polyline path={polylinePath} strokeColor="purple" strokeWeight={5} />}
            </GoogleMap>

            {!!addresses && addresses.length > 1 && <Statistics addresses={addresses} />}
        </Layout>
    );
};

export default Home;
