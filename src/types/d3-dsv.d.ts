declare module 'd3-dsv' {
    export function autoType(object: any);
    export function csvParse<Columns extends string>(csvString: string): DSVRowArray<Columns>;
}