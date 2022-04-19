import React, { useEffect, useState } from "react";

interface MarkerProps extends google.maps.MarkerOptions {
    onClick?: () => void;
}

const Marker: React.FC<MarkerProps> = ({ onClick, ...options }) => {
    const [marker, setMarker] = useState<google.maps.Marker>();

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

    useEffect(() => {
        if (marker) {
            google.maps.event.clearListeners(marker, "click");

            if (onClick) {
                marker.addListener("click", onClick);
            }
        }
    }, [marker, onClick]);

    return null;
};

export default Marker;
