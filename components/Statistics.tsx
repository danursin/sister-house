import { Address } from "../types";
import React from "react";
import { calculateRegression } from "../services/RegressionService";

interface StatisticsProps {
    addresses: Address[];
}

const Statistics: React.FC<StatisticsProps> = ({ addresses }) => {
    const x = addresses.map((a) => a.Latitude);
    const y = addresses.map((a) => a.Longitude);
    const [a, b, rSquared] = calculateRegression(x, y);

    return (
        <p>
            Regression line is{" "}
            <code>
                Y = {a.toFixed(2)} + {b.toFixed(2)}X
            </code>
            With R^2 statistic {rSquared.toFixed(3)}
        </p>
    );
};

export default Statistics;
