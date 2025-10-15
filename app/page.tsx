import type { Metadata } from "next";
import MainPage from "./MainPage";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Page() {
  return <MainPage />;
}
