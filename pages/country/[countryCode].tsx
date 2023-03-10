import { CountryData } from "@/types";
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

export async function getStaticProps(context) {
  let response
  try {
    response = await fetch(`https://restcountries.com/v3.1/alpha/${context.params.countryCode}`)
  } catch (error) {
    console.error("There was an error and", error);
  }

  if (!response?.ok) {
    console.error(`There was an error and the HTTP Code is: ${response?.status}`)
  }

  const data = await response?.json()

  return {
    props: {
      data: data[0],
    }, // will be passed to the page component as props
  };
}

export default function Page({ data }: {
  data: CountryData
}) {
  const {
    query: { countryCode },
  } = useRouter();
  console.log(data);
  return <div>{data.name.official}</div>;
}
