import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Switch } from "@headlessui/react";
import { BsFillMoonFill, BsSunFill } from "react-icons/bs";

export default function Navbar() {
  return (
    <header className="flex h-24 items-center justify-between px-6 shadow-md dark:bg-secondary md:px-12">
      <Link href={"/"} className="dark:text-white">
        World Wise
      </Link>
      <div className="flex items-center gap-2">
        <div className="text-xl text-secondary dark:text-white">
          <BsSunFill />
        </div>
        <ThemeToggle />
        <div className="text-xl dark:text-white text-secondary">
          <BsFillMoonFill />
        </div>
      </div>
    </header>
  );
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [enabled, setEnabled] = useState(false);
  const firstRender = useRef<boolean>(true);

  useEffect(() => {
    // check if it is the first render
    if (firstRender.current) {
      // first render: true
      // change firstRender to false
      firstRender.current = !firstRender.current;
      // check if localStorage.theme is dark OR (there is no theme in localStorage and at the same time user prefers dark theme)
      if (
        localStorage.theme === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        // setEnabled to true which means dark mode is on
        setEnabled(true);
      } else {
        // setEnabled to flase which means dark mode is off
        setEnabled(false);
      }
    }

    // check if enabled = flase
    if (!enabled) {
      // set the theme to light
      setTheme("light");
      // remove dark class from document
      document.documentElement.classList.remove("dark");
      // add theme = "light" in localStorage
      localStorage.setItem("theme", "light");
    } else {
      // set the theme to dark
      setTheme("dark");
      // add dark class in document
      document.documentElement.classList.add("dark");
      // add theme = "dark" in localStorage
      localStorage.setItem("theme", "dark");
    }
  }, [enabled]);

  return (
    <>
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={`${enabled ? "bg-primary" : "bg-gray-200"}
          relative inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full border-2 border-secondary transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-opacity-75 dark:border-white`}
      >
        <span className="sr-only">Theme Toggler</span>
        <span
          aria-hidden="true"
          className={`${enabled ? "translate-x-8" : "translate-x-0.5"
            } pointer-events-none relative inline-block h-6 w-[26px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
        ></span>
      </Switch>
    </>
  );
}
