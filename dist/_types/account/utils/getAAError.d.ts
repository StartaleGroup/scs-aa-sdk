export type KnownError = {
    name: string;
    regex: string;
    description: string;
    causes: string[];
    solutions: string[];
    docsUrl?: string;
};
export declare const ERRORS_URL = "https://raw.githubusercontent.com/bcnmy/aa-errors/main/docs/errors.json";
export declare const DOCS_URL = "https://docs.biconomy.io/troubleshooting/commonerrors";
export declare const getAAError: (message: string, httpStatus?: number) => Promise<{
    title: string;
    docsSlug: string;
    metaMessages: string[];
    message: string;
}>;
//# sourceMappingURL=getAAError.d.ts.map