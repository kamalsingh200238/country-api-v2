import { useEffect, useState } from "react";
import Link from "next/link";
import wretch from "wretch";
import { CountryData } from "@/types";

interface Props {
  borders: string[] | undefined;
}
export default function BorderCountries({ borders }: Props) {
  if (borders) {
    return (
      <>
        {borders.map((border) => (
          <BorderLinks key={border} borderCode={border} />
        ))}
      </>
    );
  } else {
    return <p>No border Countries</p>;
  }
}

export function BorderLinks({ borderCode }: { borderCode: string }) {
  const [borderCountry, setBorderCountry] = useState<CountryData | null>(null);

  useEffect(() => {
    // fetch the data
    async function getData() {
      const resp = await wretch(
        `https://restcountries.com/v3.1/alpha/${borderCode}`
      )
        .get()
        .json((json) => json[0])
        .catch((error) => console.log("There was an error", error));

      setBorderCountry(resp);
    }

    getData();
  }, [borderCode]);

  if (borderCountry) {
    return (
      <>
        <Link
          key={borderCountry.cca3}
          href={`/country/${borderCountry.cca3}`}
          className="inline-block rounded-md border border-gray-300 px-5 py-2 shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-transparent dark:bg-secondary dark:focus-visible:ring-white"
        >
          {borderCountry.name.common}
        </Link>
      </>
    );
  } else {
    return <p className="animate-pulse">Loading...</p>;
  }
}
