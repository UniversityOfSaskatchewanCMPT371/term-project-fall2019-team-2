/**
 * Purpose: acts like an enum for the list of file types that our website will
 * accept
 */
export class FileType {
    static readonly csv = new FileType('csv', 'csv', '.csv,text/csv');
    static readonly tl = new FileType('tl', 'tl', '.tl');

    public name: string;
    public mimeName: string;

    /**
     * Purpose: FileType constructor
     * @param {string} key: the name to use to access this FileType with '.'
     * @param {string} name: the name of the file type to display to the user
     * @param {string} mimeName: comma delimited list of MIME types for this
     * file type
     */
    private constructor(private readonly key: string,
        name: string,
        mimeName: string) {
      this.name = name;
      this.mimeName = mimeName;
    }
}

interface Parser {
    prompt: string;
    fileType: FileType;
    onChange: (filePath: any) => void;
}
export default Parser;

export interface ParserState {
    prompt: string;
    fileType: FileType;
    data: Array<object>;
    showTimeline: boolean;
    formatString: string;
    fileData: any;
}
