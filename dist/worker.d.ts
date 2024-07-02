declare const parentPort: any;
declare const axios: any;
declare const config: {
    method: string;
    maxBodyLength: number;
    url: string;
    headers: {
        Accept: string;
        'Api-Version': string;
        Authorization: string;
    };
};
declare function fetchData(): void;
