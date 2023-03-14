import CardDetail from "@/components/CardDetail";
import { CountryData } from "@/types";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

export async function getStaticPaths() {
  let response;
  try {
    response = await fetch("https://restcountries.com/v3.1/all");
  } catch (error) {
    console.error("There was an error and", error);
  }
  if (!response?.ok) {
    console.error(
      `there was an error and the HTTP code is: ${response?.status}`
    );
  }
  const data = (await response?.json()) as CountryData[];
  const urls = data.map((country) => {
    return { params: { countryCode: country.cca3 } };
  });
  return {
    paths: urls,
    fallback: false,
  };
}

export async function getStaticProps(context: GetStaticPropsContext) {
  let response;
  try {
    response = await fetch(
      `https://restcountries.com/v3.1/alpha/${context.params?.countryCode}`
    );
  } catch (error) {
    console.error("There was an error and", error);
  }

  if (!response?.ok) {
    console.error(
      `There was an error and the HTTP Code is: ${response?.status}`
    );
  }

  const data = (await response?.json()) as CountryData[];

  let resp;

  if (data[0].borders) {
    resp = (await Promise.all(
      data[0].borders?.map(async (border) => {
        const resp = await fetch(
          `https://restcountries.com/v3.1/alpha/${border}`
        );
        return (await resp.json())[0];
      })
    )) as CountryData[];
  }

  const borderCountries =
    resp?.map((item) => {
      return {
        name: item.name.common,
        cca3: item.cca3,
      };
    }) ?? null;

  return {
    props: {
      data: data[0],
      borderCountries: borderCountries,
    }, // will be passed to the page component as props
  };
}

export default function Page({
  data,
  borderCountries,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const {
    query: { countryCode },
  } = useRouter();

  function getCurrencies(currencies: {
    [key: string]: {
      name: string;
      symbol: string;
    };
  }): string {
    // check if object is not undefined
    // create a variable to store the curreny string
    if (currencies) {
      let currencyString: string[] = [];

      if (Object.keys(currencies).length === 0) {
        return "";
      }

      // loop over the Object
      for (const [k] of Object.entries(currencies)) {
        // push the name of currency in currencyString
        currencyString.push(currencies[k].name);
      }

      // join the array into string and the return the string
      return currencyString.join(", ");
    }

    console.error("object is undefined");
    return "";
  }

  function getLanguages(languages: { [key: string]: string }) {
    // create a variable to store the languages
    const languagesString: string[] = [];

    // check if the object is empty
    if (Object.keys(languages).length === 0) {
      // if true return empty string
      return "";
    }

    //loop over the object
    for (const [, v] of Object.entries(languages)) {
      // push the value in the languages
      languagesString.push(v);
    }

    // join the array and the return it
    return languagesString.join(", ");
  }

  console.log({ data, borderCountries });

  return (
    <>
      <div className="grid items-center lg:grid-cols-2">
        <div className="relative aspect-video w-full">
          <Image
            src={data.flags.svg}
            fill={true}
            alt={`Falg of ${data.name.common}`}
          />
        </div>
        <div className="">
          <div>{data.name.official}</div>
          <div>
            <CardDetail
              detail="Population"
              value={data.population.toLocaleString("en-US")}
            />
            <CardDetail detail="Region" value={data.region} />
            <CardDetail detail="Subregion" value={data.subregion} />
            <CardDetail detail="Capital" value={data.capital.join(", ")} />
          </div>
          <div>
            <CardDetail
              detail="Top level domain"
              value={data?.tld?.[0] ?? ""}
            />
            <CardDetail
              detail="Currencies"
              value={getCurrencies(data.currencies)}
            />
            <CardDetail
              detail="Languages"
              value={getLanguages(data.languages)}
            />
          </div>
          <div>
            <h2>Border Countries: </h2>
          </div>
          <div className="flex flex-wrap gap-5">
            {borderCountries?.map((borderCountry) => (
              <Link
                key={borderCountry.cca3}
                href={`/country/${borderCountry.cca3}`}
              >
                {borderCountry.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
