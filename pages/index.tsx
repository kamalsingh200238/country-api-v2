import Head from "next/head";
import { useEffect, useState } from "react";
import { CountryData } from "@/types";
import ReactPaginate from "react-paginate";

import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { HiCheck, HiChevronUpDown } from "react-icons/hi2";
import Link from "next/link";
import Image from "next/image";
import CardDetail from "@/components/CardDetail";

export async function getStaticProps() {
  let resp;

  try {
    resp = await fetch("https://restcountries.com/v3.1/all");
  } catch (error) {
    console.log("There was an error", error);
  }

  if (!resp?.ok) {
    console.log(
      `there was an error, and the HTTP error code is ${resp?.status}`
    );
  }

  const data = await resp?.json();

  return {
    props: {
      data: data,
    },
  };
}

interface Props {
  data: CountryData[];
}

export default function Home({ data }: Props) {
  const [query, setQuery] = useState(""); // state for query
  const [regionFilter, setRegionFilter] = useState(""); // state for region filter

  const [paginationActivePage, setPaginationActivePage] = useState(1); // state for active pagination number
  const [itemsPerPagination] = useState(12); // state for number of items in single page

  const filteredData = data.filter((country) => {
    // check if current country's region matches the selected region
    if (country.region.toLowerCase().includes(regionFilter.toLowerCase())) {
      // check if the country's name matches query
      return (
        country.name.common.toLowerCase().includes(query.toLowerCase()) ||
        country.name.official.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      // if flase return false so that country get skipped
      return false;
    }
  });

  const indexOfLastPost = paginationActivePage * itemsPerPagination; // index of last post in active page
  const indexOfFirstPost = indexOfLastPost - itemsPerPagination; // index of first post in active page
  const paginationLength = Math.ceil(filteredData.length / itemsPerPagination); // number of total pagination number

  const activePaginationData = filteredData.slice(
    indexOfFirstPost,
    indexOfLastPost
  );

  function paginate({ selected }: { selected: number }) {
    setPaginationActivePage(selected + 1);
  }

  useEffect(() => {
    setPaginationActivePage(1);
  }, [query, regionFilter]);

  return (
    <>
      <Head>
        <title>World wise</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="">
        <section className="py-8 px-5 dark:bg-primary md:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col justify-between gap-10 md:flex-row md:gap-0">
              <input
                type="search"
                placeholder="Search for country"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
                className="max-w-md rounded-md border-gray-300 shadow-lg focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-opacity-75 dark:border-none dark:bg-secondary"
              />
              <DropDown setRegionFilter={setRegionFilter} />
            </div>
            <div className="grid grid-cols-1 gap-14 sm:grid-cols-2 lg:grid-cols-4">
              {activePaginationData.map((country) => {
                const capital = country?.capital?.[0] ?? "";
                return (
                  <Link
                    key={country.name.common}
                    href={`/country/${country.cca3}`}
                    className="block overflow-clip rounded-md shadow-lg transition-all duration-200 hover:scale-105 focus:border-primary focus:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-opacity-75"
                  >
                    <div className="">
                      <div className="relative isolate aspect-video w-full">
                        <Image
                          src={country.flags.svg}
                          alt={`Flag of ${country.name.common}`}
                          fill={true}
                          className="rounded-md object-cover"
                        />
                      </div>
                      <div className="px-5 py-8">
                        <p className="mb-2 text-lg font-bold">
                          {country.name.common}
                        </p>
                        <CardDetail
                          detail="Population"
                          value={country.population.toLocaleString("en-US")}
                        />
                        <CardDetail detail="Region" value={country.region} />
                        <CardDetail detail="Capital" value={capital} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="max-w-full py-14">
              <ReactPaginate
                onPageChange={paginate}
                pageCount={paginationLength}
                pageRangeDisplayed={2}
                marginPagesDisplayed={1}
                previousLabel={"<"}
                nextLabel={">"}
                containerClassName={
                  "flex gap-2 flex-wrap item-center justify-center sm:gap-5"
                }
                pageClassName={"bg-gray-400 rounded-md"}
                pageLinkClassName={`grid place-items-center rounded-md h-full p-2`}
                previousLinkClassName={
                  "rounded-md bg-blue-500 grid place-items-center h-full p-2"
                }
                nextLinkClassName={
                  "rounded-md bg-blue-500 grid place-items-center h-full p-2"
                }
                activeLinkClassName={"bg-blue-500"}
                breakClassName={"p-1"}
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

const regions = [
  { region: "None", value: "" },
  { region: "Americas", value: "Americas" },
  { region: "Asia", value: "Asia" },
  { region: "Africa", value: "Africa" },
  { region: "Antartic", value: "Antartic" },
  { region: "Europe", value: "Europe" },
  { region: "Oceania", value: "Oceania" },
];

function DropDown({
  setRegionFilter,
}: {
  setRegionFilter: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [selected, setSelected] = useState(regions[0]);

  // if selected is changed, then region filter should also change
  useEffect(() => {
    setRegionFilter(selected.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <>
      <div className="min-w-[14rem] max-w-[16rem]">
        <Listbox value={selected} onChange={setSelected}>
          <div className="relative">
            <Listbox.Button className="relative w-full cursor-default rounded-lg border border-gray-300 py-2 pl-3 pr-10 text-left shadow-lg focus:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary">
              <span className="block truncate capitalize">
                {selected.value === "" ? "Filter by Region" : selected.region}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <HiChevronUpDown
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-40 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {regions.map((region, regionIdx) => (
                  <Listbox.Option
                    key={regionIdx}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                      }`
                    }
                    value={region}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-bold" : "font-normal"
                          }`}
                        >
                          {region.region}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                            <HiCheck className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
    </>
  );
}
