import Head from 'next/head'
import { useState } from 'react';

export async function getStaticProps() {
  let resp;

  try {
    resp = await fetch("https://restcountries.com/v3.1/all");
  } catch (error) {
    console.log("There was an error", error)
  }

  if (!resp?.ok) {
    console.log(`there was an error, and the HTTP error code is ${resp?.status}`)
  }

  const data = await resp?.json()

  return {
    props: {
      data: data
    }
  }
}

export default function Home({ data }) {
  const [query, setQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("")

  const filteredData = data.filter((country) => {
    if (country.region.toLowerCase().includes(regionFilter.toLowerCase())) {
      return (country.name.common.toLowerCase().includes(query.toLowerCase()) || country.name.official.toLowerCase().includes(query.toLowerCase()))
    } else {
      return false
    }
  })

  console.log({ query, data, filteredData })

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="">
        <input type="search" value={query} onChange={(e) => {
          setQuery(e.target.value)
        }} />
        <div>
          {filteredData.map(country => <div key={country.name.common}>{country.name.official}</div>)}
        </div>
      </main>
    </>
  )
}
