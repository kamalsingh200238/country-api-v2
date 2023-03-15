import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Image from "next/image";
import wretch from "wretch";
// ----------------------------------------------------------------------------
import BorderCountries from "@/components/BorderCountries";
import CardDetail from "@/components/CardDetail";
// ----------------------------------------------------------------------------
import { CountryData } from "@/types";
// ----------------------------------------------------------------------------

export async function getStaticPaths() {
  const data = (await wretch("https://restcountries.com/v3.1/all")
    .get()
    .json()
    .catch((error) =>
      console.error("There was an error ======>", error)
    )) as CountryData[];

  const urls = data.map((country) => {
    return { params: { countryCode: country.cca3 } };
  });

  return {
    paths: urls,
    fallback: false,
  };
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const data: CountryData = await wretch(
    `https://restcountries.com/v3.1/alpha/${context.params?.countryCode}`
  )
    .get()
    .json((json) => json[0])
    .catch((error) => console.log("There was an error =======>", error));

  return {
    props: {
      data,
    }, // will be passed to the page component as props
  };
}

export default function Page({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) {
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
    return "None";
  }

  function getLanguages(languages: { [key: string]: string }) {
    if (languages) {
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
    } else {
      return "None";
    }
  }

  return (
    <>
      <main className="">
        <section className="px-5 py-12 dark:text-white">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div className="relative aspect-video w-full">
                <Image
                  src={data.flags.svg}
                  fill={true}
                  alt={data.flags?.alt ?? `Flag of ${data.name.common}`}
                  className="object-cover"
                />
              </div>
              <div className="px-5">
                <h1 className="mb-5 text-2xl font-bold">
                  {data.name.official}
                </h1>
                <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row">
                  <div>
                    <CardDetail
                      detail="Population"
                      value={data.population.toLocaleString("en-US")}
                    />
                    <CardDetail detail="Region" value={data.region} />
                    <CardDetail
                      detail="Subregion"
                      value={data?.subregion ?? "None"}
                    />
                    <CardDetail
                      detail="Capital"
                      value={data.capital?.join(", ") ?? "None"}
                    />
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
                </div>
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <h2 className="">Border Countries: </h2>
                  <div className="flex flex-wrap gap-5">
                    <BorderCountries borders={data.borders} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
