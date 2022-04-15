import React, { CSSProperties, useEffect, useState } from "react";

import { Address } from "../types";
import { Wrapper } from "@googlemaps/react-wrapper";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string;

interface MapProps extends google.maps.MapOptions {
    style?: CSSProperties;
}
const Map: React.FC<MapProps> = ({ style, ...options }) => {
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

    return <div ref={ref} style={style} />;
};

interface AddressMapProps extends MapProps {
    addresses: Address[];
}

const AddressMap: React.FC<AddressMapProps> = ({ addresses, ...options }) => {
    return (
        <Wrapper apiKey={apiKey} render={(status) => <p>{status}</p>}>
            <Map {...options} style={{ flexGrow: "1", height: "85vh" }} />
        </Wrapper>
    );
};

export default AddressMap;
