export interface CountryData {
  name: {
    common: string;
    official: string;
    nativeName?: {};
  };
  languages: {
    [key: string]: string;
  };
  population: number;
  borders?: string[];
  tld: string[];
  cca2: string;
  ccn3: string;
  cca3: string;
  cioc: string;
  independent: boolean;
  status: string;
  unMember: boolean;
  currencies: {};
  idd: {
    root: string;
    suffixes: string[];
  };
  capital: string[];
  altSpellings: string[];
  region: string;
  subregion: string;
  latlng: number[];
  landlocked: boolean;
  area: number;
  flag: string;
  flags: {
    svg: string;
    png: string;
    alt: string;
  };
}
