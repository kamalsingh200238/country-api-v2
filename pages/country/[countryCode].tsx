import { CountryData } from "@/types";
import { GetStaticPropsContext } from "next";
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

export async function getStaticProps(context :GetStaticPropsContext) {
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
    resp = await Promise.all(
      data[0].borders?.map(async (border) => {
      const resp = await fetch(
        `https://restcountries.com/v3.1/alpha/${border}`
      );
      return await resp.json();
      })
    );
  }
  const borderCountries = resp?.map(item => item[0].name.common) ?? null

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
}: {
  data: CountryData;
  borderCountries: string[];
}) {
  const {
    query: { countryCode },
  } = useRouter();
  console.log({ data, borderCountries });
  return <div>{data.name.official}</div>;
}
