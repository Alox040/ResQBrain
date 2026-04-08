import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Mitwirkung } from "./pages/Mitwirkung";
import { Links } from "./pages/Links";
import { Kontakt } from "./pages/Kontakt";
import { Impressum } from "./pages/Impressum";
import { Datenschutz } from "./pages/Datenschutz";
import { Anmeldung } from "./pages/Anmeldung";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "mitwirkung", Component: Mitwirkung },
      { path: "kontakt", Component: Kontakt },
      { path: "impressum", Component: Impressum },
      { path: "datenschutz", Component: Datenschutz },
    ],
  },
  {
    path: "/anmeldung",
    Component: Anmeldung,
  },
  {
    path: "/links",
    Component: Links,
  }
]);