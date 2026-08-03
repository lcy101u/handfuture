import type { GuidePath } from "@/config/public-routes";
import type { EditorialPage } from "../guides";

type LegacyGuidePath = Extract<
  GuidePath,
  | "/guides/palmistry-basics"
  | "/guides/science-and-limitations"
  | "/guides/hand-photo-guide"
>;

export interface LocalizedEditorialBundle {
  howItWorks: EditorialPage;
  guides: Record<LegacyGuidePath, EditorialPage>;
  about: EditorialPage;
  privacy: EditorialPage;
  terms: EditorialPage;
}
