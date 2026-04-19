import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Project } from "./pages/Project";
import { HowItWorks } from "./pages/HowItWorks";
import { Features } from "./pages/Features";
import { Contribute } from "./pages/Contribute";
import { Community } from "./pages/Community";
import { Links } from "./pages/Links";
import { Contact } from "./pages/Contact";
import { Imprint } from "./pages/Imprint";
import { Privacy } from "./pages/Privacy";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "projekt", Component: Project },
      { path: "wie-es-funktioniert", Component: HowItWorks },
      { path: "features", Component: Features },
      { path: "mitwirken", Component: Contribute },
      { path: "community", Component: Community },
      { path: "links", Component: Links },
      { path: "kontakt", Component: Contact },
      { path: "impressum", Component: Imprint },
      { path: "datenschutz", Component: Privacy },
      { path: "*", Component: NotFound },
    ],
  },
]);
