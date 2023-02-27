import Head from 'next/head'

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
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="">
        {JSON.stringify(data)}
      </main>
    </>
  )
}
