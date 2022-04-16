import "../styles/site.scss";

import type { AppProps } from "next/app";
import { GoogleMapContextProvider } from "../components/GoogleMapPackage/useGoogleMap";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <GoogleMapContextProvider defaultCenter={{ lat: 44.9212, lng: -93.4687 }} defaultZoom={7}>
            <Component {...pageProps} />
        </GoogleMapContextProvider>
    );
}

export default MyApp;
