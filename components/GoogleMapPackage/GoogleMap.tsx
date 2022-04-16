import React, { CSSProperties, useRef, useState } from "react";

import { Wrapper } from "@googlemaps/react-wrapper";
import { useEffect } from "react";
import { useGoogleMap } from "./useGoogleMap";

interface MapProps {
    style?: CSSProperties;
    children?: React.ReactNode;
}
const Map: React.FC<MapProps> = ({ style, children }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map>();
    const { zoom, center, setZoom, setCenter, setBounds } = useGoogleMap();

    useEffect(() => {
        if (ref.current && !map) {
            setMap(new window.google.maps.Map(ref.current, {}));
        }
    }, [ref, map]);

    useEffect(() => {
        if (map) {
            map.setZoom(zoom);
        }
    }, [zoom, map]);

    useEffect(() => {
        if (map) {
            map.setCenter(center);
        }
    }, [center, map]);

    useEffect(() => {
        if (map) {
            // map.addListener("center_changed", () => {
            //     setCenter(map.getCenter()!);
            // });
            // map.addListener("zoom_changed", () => {
            //     setZoom(map.getZoom()!);
            // });
            map.addListener("idle", () => {
                setCenter(map.getCenter()!);
                setZoom(map.getZoom()!);
                setBounds(map.getBounds());
            });
        }

        return () => {
            if (map) {
                ["idle"].forEach((eventName) => {
                    google.maps.event.clearListeners(map, eventName);
                });
            }
        };
    });

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

interface GoogleMapProps extends MapProps {
    apiKey: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ apiKey, style, children }) => {
    return (
        <Wrapper apiKey={apiKey} render={(status) => <p>{status}</p>}>
            <Map style={style}>{children}</Map>
        </Wrapper>
    );
};

export default GoogleMap;
