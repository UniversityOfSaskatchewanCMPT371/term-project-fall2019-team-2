declare module 'd3-dsv' {
    export function autoType(object: any);
    export function csvParse<Columns extends string>(csvString: string):
        DSVRowArray<Columns>;

    export function csvParse<ParsedRow extends object, Columns extends string>(
        csvString: string,
        row: (rawRow: DSVRowString<Columns>, index: number,
              columns: Columns[]) =>
            ParsedRow | undefined | null
    ): DSVParsedArray<ParsedRow>;
}
