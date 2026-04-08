import { createBrowserRouter } from "react-router";
import { MobileLayout } from "./components/MobileLayout";
import { Start } from "./components/Start";
import { Dashboard } from "./components/Dashboard";
import { Home } from "./components/Home";
import { Search } from "./components/Search";
import { AlgorithmDetail } from "./components/AlgorithmDetail";
import { MedicationDetail } from "./components/MedicationDetail";
import { Survey } from "./components/Survey";
import { Einsatzmodus } from "./components/Einsatzmodus";
import { LearnOverview } from "./components/LearnOverview";
import { LearnMode } from "./components/LearnMode";
import { ReviewDetail } from "./components/ReviewDetail";
import { ReviewsList } from "./components/ReviewsList";
import { MoreMenu } from "./components/MoreMenu";
import { MarketplaceOverview } from "./components/MarketplaceOverview";
import { PartnerDetail } from "./components/PartnerDetail";
import { ContentDetail } from "./components/ContentDetail";

import { QuizOverview } from "./components/QuizOverview";
import { QuizSession } from "./components/QuizSession";
import { QuizResult } from "./components/QuizResult";

import { AISummary } from "./components/AISummary";
import { News } from "./components/News";
import { ECGSpicker } from "./components/ECGSpicker";
import { RhythmDetail } from "./components/RhythmDetail";

import { SettingsOverview } from "./components/SettingsOverview";
import { ProfileSettings } from "./components/ProfileSettings";
import { OrganizationSettings } from "./components/OrganizationSettings";
import { PersonalizationSettings } from "./components/PersonalizationSettings";
import { LearningSettings } from "./components/LearningSettings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MobileLayout,
    children: [
      { index: true, Component: Start },
      { path: "dashboard", Component: Dashboard },
      { path: "home", Component: Home },
      { path: "einsatz", Component: Einsatzmodus },
      { path: "learn", Component: LearnOverview },
      { path: "learn/mode", Component: LearnMode },
      { path: "learn/review/:id", Component: ReviewDetail },
      { path: "reviews", Component: ReviewsList },
      { path: "tests", Component: QuizOverview },
      { path: "tests/run/:id", Component: QuizSession },
      { path: "tests/result/:id", Component: QuizResult },
      { path: "search", Component: Search },
      { path: "algorithms", Component: Search }, // Placeholder for algorithms list
      { path: "medications", Component: Search }, // Placeholder for meds list
      { path: "algorithm/:id", Component: AlgorithmDetail },
      { path: "medication/:id", Component: MedicationDetail },
      { path: "survey", Component: Survey },
      { path: "more", Component: MoreMenu },
      { path: "settings", Component: SettingsOverview },
      { path: "settings/profile", Component: ProfileSettings },
      { path: "settings/organization", Component: OrganizationSettings },
      { path: "settings/personalization", Component: PersonalizationSettings },
      { path: "settings/learning", Component: LearningSettings },
      { path: "marketplace", Component: MarketplaceOverview },
      { path: "marketplace/partner/:id", Component: PartnerDetail },
      { path: "marketplace/content/:id", Component: ContentDetail },
      { path: "ai-summary", Component: AISummary },
      { path: "news", Component: News },
      { path: "ekg-spicker", Component: ECGSpicker },
      { path: "ekg-spicker/:id", Component: RhythmDetail },
    ],
  },
]);
