import React, { CSSProperties, useEffect, useState } from "react";

import { Address } from "../types";
import { Wrapper } from "@googlemaps/react-wrapper";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string;

const Marker: React.FC<google.maps.MarkerOptions> = (options) => {
    const [marker, setMarker] = React.useState<google.maps.Marker>();

    useEffect(() => {
        if (!marker) {
            setMarker(new google.maps.Marker());
        }

        // remove marker from map on unmount
        return () => {
            if (marker) {
                marker.setMap(null);
            }
        };
    }, [marker]);

    useEffect(() => {
        if (marker) {
            marker.setOptions(options);
        }
    }, [marker, options]);

    return null;
};

interface MapProps extends google.maps.MapOptions {
    style?: CSSProperties;
    children?: React.ReactNode;
}
const Map: React.FC<MapProps> = ({ style, children, ...options }) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map>();

    useEffect(() => {
        if (ref.current && !map) {
            setMap(new window.google.maps.Map(ref.current, {}));
        }
    }, [ref, map]);

    //useDeepCompareEffectForMaps(() => {
    useEffect(() => {
        if (map) {
            map.setOptions(options);
        }
    }, [map, options]);

    return (
        <>
            <div ref={ref} style={style} />
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    // set the map prop on the child component
                    return React.cloneElement(child, { map });
                }
            })}
        </>
    );
};

interface AddressMapProps extends MapProps {
    addresses: Address[];
}

const AddressMap: React.FC<AddressMapProps> = ({ addresses, ...options }) => {
    return (
        <Wrapper apiKey={apiKey} render={(status) => <p>{status}</p>}>
            <Map {...options} style={{ flexGrow: "1", height: "50vh" }}>
                {addresses.map((a) => (
                    <Marker key={a.OID_} position={{ lat: a.Latitude, lng: a.Longitude }} />
                ))}
            </Map>
        </Wrapper>
    );
};

export default AddressMap;
