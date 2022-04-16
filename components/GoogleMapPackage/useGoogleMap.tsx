import React, { createContext, useContext, useState } from "react";

interface GoogleMapContextProps {
    zoom: number;
    setZoom: React.Dispatch<React.SetStateAction<number>>;
    center: google.maps.LatLngLiteral | google.maps.LatLng;
    setCenter: React.Dispatch<React.SetStateAction<google.maps.LatLngLiteral | google.maps.LatLng>>;
    bounds?: google.maps.LatLngBounds;
    setBounds: React.Dispatch<React.SetStateAction<google.maps.LatLngBounds | undefined>>;
}

const notInitializedError = () => {
    throw new Error("not initialized");
};

const GoogleMapContext = createContext<GoogleMapContextProps>({
    zoom: 0,
    setZoom: notInitializedError,
    center: { lat: 0, lng: 0 },
    setCenter: notInitializedError,
    setBounds: notInitializedError
});

export const useGoogleMap = () => useContext(GoogleMapContext);

interface GoogleMapContextProviderProps {
    children: React.ReactNode;
    defaultZoom?: number;
    defaultCenter?: google.maps.LatLngLiteral | google.maps.LatLng;
}
export const GoogleMapContextProvider: React.FC<GoogleMapContextProviderProps> = ({ children, defaultZoom, defaultCenter }) => {
    const [zoom, setZoom] = useState<number>(defaultZoom ?? 4);
    const [center, setCenter] = useState<google.maps.LatLngLiteral | google.maps.LatLng>(defaultCenter ?? { lat: 0, lng: 0 });
    const [bounds, setBounds] = useState<google.maps.LatLngBounds>();
    return (
        <GoogleMapContext.Provider value={{ zoom, setZoom, center, setCenter, bounds, setBounds }}>{children}</GoogleMapContext.Provider>
    );
};
