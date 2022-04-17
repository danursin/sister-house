import { calculateRegression } from "./RegressionService";

describe("RegressionService", () => {
    test("Linear Regresssion", () => {
        const x = [43, 21, 25, 42, 57, 59];
        const y = [99, 65, 79, 75, 87, 81];
        const [a, b] = calculateRegression(x, y);
        expect(a).toBeCloseTo(65.14);
        expect(b).toBeCloseTo(0.385225);
    });

    test("Linear Regresssion with R squared", () => {
        const x = [3, 5, 5, 7, 9, 12, 14, 17];
        const y = [22, 24, 28, 20, 28, 31, 37, 33];
        // eslint-disable-next-line no-unused-vars
        const [_a, _b, r] = calculateRegression(x, y);
        expect(r).toBeCloseTo(0.6686);
    });
});
