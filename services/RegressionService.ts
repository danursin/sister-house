/**
 * Calculates the linear regression slope formula
 *
 * @param x independent variable
 * @param y dependent variable
 *
 * @returns `[a, b, R^2]` where `Y = a + bX` and `R^2` is the R squared statistic
 */
export function calculateRegression(x: number[], y: number[]): [number, number, number] {
    if (x.length !== y.length) {
        throw new Error(`Dependent and independent variables must have the same number of entries.`);
    }

    let sumY = 0,
        sumX = 0,
        sumXSquared = 0,
        sumYSquared = 0,
        sumXY = 0;

    for (let i = 0; i < x.length; i += 1) {
        const xVal = x[i];
        const yVal = y[i];
        sumX += xVal;
        sumY += yVal;
        sumXSquared += xVal * xVal;
        sumYSquared += yVal * yVal;
        sumXY += xVal * yVal;
    }

    const n = x.length;
    const a = (sumY * sumXSquared - sumX * sumXY) / (n * sumXSquared - sumX * sumX);
    const b = (n * sumXY - sumX * sumY) / (n * sumXSquared - sumX * sumX);
    const rSquared = Math.pow(
        (n * sumXY - sumX * sumY) / (Math.sqrt(n * sumXSquared - sumXSquared * sumXSquared) * Math.sqrt(n * sumYSquared - sumY * sumY)),
        2
    );
    return [a, b, rSquared];
}
