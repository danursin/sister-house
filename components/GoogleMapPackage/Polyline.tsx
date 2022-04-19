import React, { useEffect, useState } from "react";

const Polyline: React.FC<google.maps.PolylineOptions> = (options) => {
    const [polyline, setPolyline] = useState<google.maps.Polyline>();

    useEffect(() => {
        if (!polyline) {
            setPolyline(new google.maps.Polyline());
        }

        // remove polyline from map on unmount
        return () => {
            if (polyline) {
                polyline.setMap(null);
            }
        };
    }, [polyline]);

    useEffect(() => {
        if (polyline) {
            polyline.setOptions(options);
        }
    }, [polyline, options]);

    return null;
};

export default Polyline;
