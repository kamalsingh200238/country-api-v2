import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { HiCheck, HiChevronUpDown } from "react-icons/hi2";

const regions = [
  { region: "None", value: "" },
  { region: "Americas", value: "Americas" },
  { region: "Asia", value: "Asia" },
  { region: "Africa", value: "Africa" },
  { region: "Antartic", value: "Antartic" },
  { region: "Europe", value: "Europe" },
  { region: "Oceania", value: "Oceania" },
];

export default function DropDown({
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
            <Listbox.Button className="relative w-full cursor-default rounded-lg border border-gray-300 py-2 pl-3 pr-10 text-left shadow-lg focus:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary dark:border-transparent dark:bg-secondary dark:focus-visible:border-white dark:focus-visible:ring-white">
              <span className="block truncate capitalize">
                {selected.value === "" ? "Filter by Region" : selected.region}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <HiChevronUpDown
                  className="h-5 w-5 text-gray-400 dark:text-white"
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
              <Listbox.Options className="absolute z-40 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-secondary sm:text-sm">
                {regions.map((region, regionIdx) => (
                  <Listbox.Option
                    key={regionIdx}
                    className={({ active, selected }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 dark:text-white ${
                        selected
                          ? "bg-blue-100 !text-blue-900 dark:!text-blue-900"
                          : ""
                      } ${
                        active && !selected
                          ? "bg-amber-100 !text-amber-900 dark:!text-amber-900"
                          : ""
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
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <HiCheck
                              className="h-5 w-5 font-bold text-blue-500"
                              aria-hidden="true"
                            />
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
