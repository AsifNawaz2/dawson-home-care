/**
 * Reviews — the 10 real Google reviews from the design, confirmed by the owner
 * (BUILD_DECISIONS §H answer 1). Text is verbatim (the family's own words). Names are shown as
 * first name + last initial (COPY_TRUST privacy rule); a full-name sign-off at the end of a review
 * is left out for the same reason. Data shape = COPY_TRUST `reviews.json`.
 *
 * `service` is set only where the review's own words point to that kind of care
 * (BUILD_DECISIONS row 27). Service pages show a review only when one matches (COPY_SERVICES §0).
 * `placeholder: true` items render with a [Sample] chip and fail `npm run prelaunch`.
 */
import type { ServiceSlug } from "./navigation";

export type Review = {
  id: string;
  name: string;
  relation: string | null;
  town: string | null;
  service: ServiceSlug | null;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  date: string | null;
  source: "Google" | null;
  url: string | null;
  placeholder: boolean;
};

const google = (
  id: string,
  name: string,
  text: string,
  service: ServiceSlug | null = null,
): Review => ({
  id,
  name,
  relation: null,
  town: null,
  service,
  rating: 5,
  text,
  date: null,
  source: "Google",
  url: null,
  placeholder: false,
});

export const reviews: Review[] = [
  google(
    "google-linda-p",
    "Linda P.",
    "I call Dawson agency Angels on the ground .They help me thru a tough situation with my elderly Mother they were there thru physical and mental experience. Thanking again for all making My Mother happy comfortable and knowing she was safe and in good hands",
  ),
  google(
    "google-ali-h",
    "Ali H.",
    "Dawson & Dawson is fantastic and has provided incredible care for our in-laws. They are reliable, skilled, and have been a huge gift to our family!",
  ),
  google(
    "google-holly-h",
    "Holly H.",
    "Monique and her business have been an answer to our prayers. She has worked with our family for over a year and enabled our mother to thrive with her new health challenges. She is intuitive and receptive to her changing needs . My mother …",
  ),
  google(
    "google-mary-w",
    "Mary W.",
    "Dawson and Dawson provided excellent service for my husband during a very difficult time. They guided myself and my sons through a very trying time. My husband was treated with great respect and dignity. My mind was eased so much with all of their assistance. I would highly recommend Dawson and Dawson.",
  ),
  google(
    "google-kathy-m",
    "Kathy M.",
    "Dawson and Dawson Home Health Care was referred to me by a neighbor. They provided excellent care for my husband. I would like to point out that both Yulaunda and Molly are the absolute best when it comes to caring for your loved ones. The care that they both showed when caring for my husband was beyond their scope of work!",
  ),
  google(
    "google-maureen-m",
    "Maureen M.",
    "During the latest storm, Dawson and Dawson provided continuous care, despite the difficult weather conditions. They made sure my elderly Mother had the care she needed. The wonderful caregivers went above and beyond to keep my Mother safe and comfortable. I can’t emphasize enough their exceptional service.",
    "24-hour-care",
  ),
  google(
    "google-penny-b",
    "Penny B.",
    "Dawson & Dawson followed my husband in continuing care, and they were excellent at keeping him clean and presentable. Monique kept us up to date on any changes in medications, and she was excellent in answering our questions. Several of her caregivers were quite adept at refocusing him when he tired out. Thank you, Monique, and your crew!",
    "personal-care",
  ),
  google(
    "google-virginia-l",
    "Virginia L.",
    "Monique Dawson and her staff have been a pleasure to work with. Each one offers a warm willingness to assist whenever I call. They make every effort to resolve any issue. Grateful for their service.",
  ),
  google(
    "google-allison-g",
    "Allison G.",
    "I would give Monique and Jay 10 stars if I could. They are extremely professional and dedicated to the care service they provide. They both escorted each new caregiver to ensure the best experience possible. Top class.",
  ),
  google(
    "google-jim-h",
    "Jim H.",
    "The staff at Dawson and Dawson did a fabulous job caring for my mother for two years before her passing. Excellent communications and completely trustworthy. Their help allowed her to live out her days in the place she loved…",
  ),
];

export const realReviews = () => reviews.filter((r) => !r.placeholder);
export const reviewForService = (slug: ServiceSlug) =>
  reviews.find((r) => r.service === slug && !r.placeholder) ?? null;

/** Avatar colors from the design (plum-600 · orchid-700 · leaf-700 · plum-800). */
export const AVATAR_BG = ["bg-plum-600", "bg-orchid-700", "bg-leaf-700", "bg-plum-800"] as const;
