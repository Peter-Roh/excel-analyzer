import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { GitHubLogoIcon, SunIcon, MoonIcon } from "@radix-ui/react-icons";

const Footer: NextPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode =
      (typeof window !== "undefined"
        ? localStorage.getItem("darkMode")
        : null) ?? "false";
    setDarkMode(savedMode === "true" ? true : false);
  }, []);

  useEffect(() => {
    const html = window.document.documentElement;
    const prevDarkMode = html.classList.contains("dark");
    if (darkMode !== prevDarkMode) {
      html.classList.toggle("dark", darkMode);
      localStorage.setItem("darkMode", darkMode.toString());
    }
  }, [darkMode]);

  return (
    <footer className="mx-auto mt-auto w-full p-4">
      <div className="flex items-center justify-between">
        <div className="pb-1 pl-2 text-xs font-light text-foreground">
          © Peter Roh 2024
        </div>
        <div className="flex space-x-2">
          <div
            className="cursor-pointer"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </div>
          <a
            href="https://github.com/Peter-Roh/excel-analyzer"
            target="_blank"
            className="focus:outline-none"
          >
            <GitHubLogoIcon />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
