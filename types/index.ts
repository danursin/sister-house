export type Address = {
    OID_: string;
    State: string;
    County: string;
    Zip_Code: string;
    Add_Number: string;
    StreetName: string;
    StN_PosTyp: string | null;
    StN_PosDir: string;
    Longitude: number;
    Latitude: number;
};

export type APIResponse<T> =
    | {
          data: T;
      }
    | { error: string };

export type SearchParameters = {
    Add_Number: string;
};
