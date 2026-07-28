import type { GuidePath } from "@/config/public-routes";
import type { EditorialPage } from "../guides";

export interface LocalizedEditorialBundle {
  howItWorks: EditorialPage;
  guides: Record<GuidePath, EditorialPage>;
  about: EditorialPage;
  privacy: EditorialPage;
  terms: EditorialPage;
}
