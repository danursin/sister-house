import { Address } from "../types";
import React from "react";
import { calculateRegression } from "../services/RegressionService";

interface StatisticsProps {
    addresses: Address[];
}

const Statistics: React.FC<StatisticsProps> = ({ addresses }) => {
    const x = addresses.map((a) => a.lat);
    const y = addresses.map((a) => a.lng);
    const [a, b] = calculateRegression(x, y);

    return (
        <p>
            Regression line for {addresses.length} points is
            <code>
                Y = {a.toFixed(2)} + {b.toFixed(2)}X
            </code>
        </p>
    );
};

export default Statistics;
