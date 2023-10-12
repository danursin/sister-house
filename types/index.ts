export type Address = {
    PK: number;
    SK: string;
    address: number;
    street?: string | undefined;
    type?: string | undefined;
    dir?: string | undefined;
    lat: number;
    lng: number;
};

export type APIResponse<T> =
    | {
          data: T;
      }
    | { error: string };

export type SearchParameters = {
    address: string;
    bounds: string;
};
