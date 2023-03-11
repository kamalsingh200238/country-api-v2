import Head from "next/head";
import { useEffect, useState } from "react";
import { CountryData } from "@/types";
import ReactPaginate from "react-paginate";

import { Fragment } from "react";
import { Listbox, Switch, Transition } from "@headlessui/react";
import { HiCheck, HiChevronUpDown } from "react-icons/hi2";
import { BsFillMoonFill, BsSunFill } from "react-icons/bs";
import Link from "next/link";

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
      <header className="flex h-24 items-center justify-between px-6 dark:bg-secodary md:px-12 shadow-md">
        <Link href={"/"} className="dark:text-white">
          World Wise
        </Link>
        <div className="flex items-center gap-2">
          <div className="text-xl dark:text-white">
            <BsSunFill />
          </div>
          <ThemeToggle />
          <div className="text-xl dark:text-white">
            <BsFillMoonFill />
          </div>
        </div>
      </header>
      <main className="">
        <section className="py-8 dark:bg-primary">
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
          <DropDown setRegionFilter={setRegionFilter} />
          <div className="">
            {activePaginationData.map((country) => (
              <Link
                key={country.name.common}
                href={`/country/${country.cca3}`}
                className="block"
              >
                {country.name.official}
              </Link>
            ))}
          </div>
          <ReactPaginate
            onPageChange={paginate}
            pageCount={paginationLength}
            pageRangeDisplayed={1}
            marginPagesDisplayed={1}
            previousLabel={"<"}
            nextLabel={">"}
            containerClassName={"flex gap-2 item-center justify-between"}
            pageClassName={"bg-gray-400 rounded-md"}
            pageLinkClassName={`grid place-items-center rounded-md h-full p-2`}
            previousLinkClassName={"rounded-md bg-blue-500 grid place-items-center h-full"}
            nextLinkClassName={"rounded-md bg-blue-500 grid place-items-center h-full"}
            activeLinkClassName={"bg-blue-500"}
            breakClassName={"p-1"}
          />
        </section>
      </main>
    </>
  );
}

function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      if (
        localStorage.theme === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        return "dark";
      } else {
        return "light";
      }
    } else {
      // if window is not defined that means we are on the server
      // so retun "dark" mode as default
      return "dark";
    }
  });

  const [enabled, setEnabled] = useState(() => {
    if (theme === "dark") {
      return true;
    } else {
      return false;
    }
  });

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  }, [theme]);

  useEffect(() => {
    if (enabled) {
      // if selcted is true that means dark mode is on
      setTheme("dark");
    } else {
      // if selcted is false that means dark mode is on
      setTheme("light");
    }
  }, [enabled]);

  return (
    <>
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={`${enabled ? "bg-primary" : "bg-gray-200"}
          relative inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full border-2 border-primary transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white  focus-visible:ring-opacity-75 dark:border-white`}
      >
        <span className="sr-only">Theme Toggler</span>
        <span
          aria-hidden="true"
          className={`${
            enabled ? "translate-x-8" : "translate-x-0.5"
          } pointer-events-none relative inline-block h-6 w-[26px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
        ></span>
      </Switch>
    </>
  );
}

const regions = [
  { region: "none", value: "" },
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
      <div className="w-72">
        <Listbox value={selected} onChange={setSelected}>
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
              <span className="block truncate">{selected.region}</span>
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
              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
                            selected ? "font-medium" : "font-normal"
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
