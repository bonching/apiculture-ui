/**
 * Convert honey production weight from grams to an appropriate unit (g or kg).
 * If the weight is 1000g or more, it will be displayed in kg.
 * @param grams - Weight in grams
 * @returns Formatted weight string with appropriate unit.
 */
export function formatHoneyWeight(grams: number): string {
    if (grams >= 1000) {
        const kg = grams / 1000;
        // format with 1 decimal place, but remove trailing .0
        const formatted = kg % 1 === 0 ? kg.toFixed(0) : kg.toFixed(1);
        return `${formatted}kg`;
    } else {
        return `${grams}g`;
    }
}

// React hook for using in components
export function useHoneyWeight(grams: number) {
    return formatHoneyWeight(grams);
}