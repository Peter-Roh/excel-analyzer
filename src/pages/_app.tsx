import { type AppType } from "next/app";
import { GeistSans } from "geist/font/sans";

import { api } from "@/utils/api";

import "@/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <main
      className={`${GeistSans.className} flex-y min-h-screen w-full font-sans antialiased scrollbar-hide`}
    >
      <Component {...pageProps} />
    </main>
  );
};

export default api.withTRPC(MyApp);
