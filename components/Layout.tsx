import Head from "next/head";
import Navbar from "./Navbar";
import React from "react";
import { ReactNode } from "react";

interface LayoutProps {
    title?: string;
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ title = "Sister House", children }) => {
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <Navbar />
            <main>{children}</main>
        </>
    );
};

export default Layout;
