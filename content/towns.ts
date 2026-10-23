/**
 * Town pages — COPY_AREAS §4–§11, verbatim (generated from the doc; edit the copy here).
 * Paragraphs are segments: plain text always shows; { chip } marks an unconfirmed fact (shown only
 * with placeholders on); { pending } is a whole sentence that only shows with placeholders on.
 * Facts about each town (drive time, ZIPs, tier, confirmed) live in content/areas.ts.
 */
export type Seg = string | { chip: string } | { pending: (string | { chip: string })[] };
export type Segs = Seg[];

export type TownPage = {
  slug: string;
  eyebrow: string;
  lead: string;
  photo: string;
  alt: string;
  intro: { title: string; paras: Segs[] };
  route: string;
  who: { title: string; text: Segs }[];
  care: { name: string; line: Segs }[];
  /** href "maps" = the Google Maps link in site.config.ts. */
  faqs: { id: string; q: string; a: Segs[]; link?: { label: string; href: string } }[];
  nearby: string[];
  cta: string;
};

export const townPages: TownPage[] = [
  {
    slug: "beaufort",
    eyebrow: "Beaufort · Home base",
    lead: "Beaufort is home base. Our office is on Robert Smalls Parkway, and our owner meets every family in person. Help at home for a few hours or around the clock.",
    photo: "town-beaufort.jpg",
    alt: "Live oaks and older homes along a quiet street in Beaufort's historic district.",
    intro: {
      title: "Care from right down the road.",
      paras: [
        [
          "When you call us, you're calling our office here in Beaufort. The person who visits your home is the person who runs the company.",
        ],
        [
          "Beaufort is full of people who've lived in the same house for decades — and people who moved here to retire and never want to leave. Either way, the goal is usually the same: stay home, keep the routine, and keep the good parts of the week. Coffee on the porch. A walk along the waterfront. Lunch downtown with a friend.",
        ],
      ],
    },
    route: "Robert Smalls Parkway to Boundary Street and into town.",
    who: [
      {
        title: "People who love their older homes",
        text: [
          "Historic houses are beautiful. They can also mean steep stairs and small bathrooms. We plan care around the house your parent loves.",
        ],
      },
      {
        title: "Families coming home from the hospital",
        text: [
          "The first weeks home can be the hardest. We help with bathing, meals and getting around safely — alongside your home health team.",
        ],
      },
      {
        title: "Neighbors who want to stay part of town life",
        text: [
          "Errands, the library, lunch with friends. A caregiver's company can keep the week full.",
        ],
      },
    ],
    care: [
      {
        name: "Personal Care",
        line: ["Safe showers and dressing, even in an older bathroom."],
      },
      {
        name: "Home Help",
        line: ["Meals, laundry, errands around town and medication reminders."],
      },
      {
        name: "Companionship",
        line: ["A walk by the water, a trip downtown, a good talk on the porch."],
      },
      {
        name: "Respite Care",
        line: ["A few hours off for the family member who's been doing it all."],
      },
      {
        name: "24-Hour & Overnight Care",
        line: ["Someone there at night, especially after a fall or a hospital stay."],
      },
    ],
    faqs: [
      {
        id: "visit-office",
        q: "Can I visit your office?",
        a: [
          [
            "Yes. We're at 69 Robert Smalls Parkway, Suite 3F, Beaufort, SC 29906. The office is open Monday–Friday, 8 AM–5 PM. Call ahead so the right person is there to meet you. Care itself is available 24 hours a day, 7 days a week.",
          ],
        ],
        link: { label: "Get directions →", href: "maps" },
      },
      {
        id: "hospital-discharge",
        q: "Mom is coming home from the hospital. Can you help right away?",
        a: [
          [
            "We help with the non-medical side: bathing, meals, getting around safely and company. If you can, call us before she's discharged so we can plan the first days together.",
            {
              chip: "[typical start time]",
            },
            " If she also needs nursing or therapy, that's home health — and we're happy to work alongside them.",
          ],
        ],
      },
      {
        id: "stairs",
        q: "Her house has steep stairs. Is that a problem?",
        a: [
          [
            "No. At the free assessment, our owner walks through the home with you — stairs, bathroom, bedroom, the way she moves around. We plan care around what we see, and we'll point out simple changes that could make the house safer.",
          ],
        ],
      },
    ],
    nearby: ["Port Royal", "Lady's Island", "Burton"],
    cta: "Let's talk about care in Beaufort.",
  },
  {
    slug: "port-royal",
    eyebrow: "Port Royal · Just down Ribaut Road",
    lead: "Port Royal is a small town where people know each other. We help neighbors here stay at home — with a few hours of help or care around the clock.",
    photo: "town-port-royal.jpg",
    alt: "The boardwalk and observation tower at The Sands in Port Royal, at sunset.",
    intro: {
      title: "Small town. Close by.",
      paras: [
        [
          "Port Royal's Old Village is made for slow walks — down Paris Avenue, out to the boardwalk at The Sands. Many people here want to keep doing exactly that. Sometimes they just need a steady arm.",
        ],
        [
          "The town sits beside Parris Island, and many military families and veterans live in the area. Some retired here after years of service. Some are caring for a parent who moved closer. We help with the everyday, so home stays home.",
        ],
      ],
    },
    route: "Down Ribaut Road.",
    who: [
      {
        title: "Veterans and their spouses",
        text: [
          "People who served — and the spouses who held everything together. We help with daily routines at home, with respect. Ask us whether VA benefits could help pay for care.",
        ],
      },
      {
        title: "Walkers who need a steady arm",
        text: [
          "If balance is getting shaky, a caregiver can walk alongside — to the boardwalk, the post office or just around the block.",
        ],
      },
      {
        title: "Brothers and sisters sharing the load",
        text: [
          "When siblings split care between them, we fill the gaps — the shifts nobody can cover.",
        ],
      },
    ],
    care: [
      {
        name: "Personal Care",
        line: ["Help bathing and dressing, so mornings start right."],
      },
      {
        name: "Home Help",
        line: ["Groceries, laundry, light housekeeping and medication reminders."],
      },
      {
        name: "Companionship",
        line: ["A walk out to The Sands, cards at the kitchen table, good conversation."],
      },
      {
        name: "Respite Care",
        line: ["A weekend off for the family caregiver."],
      },
      {
        name: "24-Hour & Overnight Care",
        line: ["Someone awake and nearby through the night."],
      },
    ],
    faqs: [
      {
        id: "short-visits",
        q: "Is Port Royal close enough for short visits?",
        a: [
          [
            "Yes. We're about 15 minutes away",
            {
              chip: "[drive time]",
            },
            ". Visits can be a few hours or much longer.",
            {
              pending: [
                "Visits start at",
                {
                  chip: "[minimum hours]",
                },
                " hours.",
              ],
            },
          ],
        ],
      },
      {
        id: "va-benefits",
        q: "My dad is a veteran. Can VA benefits help pay?",
        a: [
          [
            "Sometimes. Some VA programs help veterans and surviving spouses pay for help at home. The rules vary, so ask us and we'll talk through what might apply.",
            {
              chip: "[does Dawson accept VA benefits?]",
            },
          ],
        ],
        link: { label: "See ways families pay →", href: "/paying-for-care#ways-to-pay" },
      },
      {
        id: "outings",
        q: "Can a caregiver go out with Mom, not just stay at home?",
        a: [
          [
            "Yes. Walks, errands and outings are part of companionship and home help.",
            {
              chip: "[do caregivers drive clients in their own cars?]",
            },
          ],
        ],
      },
    ],
    nearby: ["Beaufort", "Lady's Island", "Burton"],
    cta: "Let's talk about care in Port Royal.",
  },
  {
    slug: "ladys-island",
    eyebrow: "Lady's Island · Across the bridge",
    lead: "Just over the bridge from downtown Beaufort. We help Lady's Island families with care at home — a few hours a week or around the clock.",
    photo: "town-ladys-island.jpg",
    alt: "Marsh grass and a tidal creek at golden hour on Lady's Island.",
    intro: {
      title: "Island life, close to town.",
      paras: [
        [
          "Lady's Island feels like its own world — marsh views, quiet roads, long driveways. But downtown Beaufort is only a bridge away.",
        ],
        [
          "We know those bridges. The Woods Memorial Bridge swings open for boats, and traffic can back up near Sea Island Parkway at busy times. We plan visit times with that in mind, so your loved one isn't left waiting.",
        ],
      ],
    },
    route: "Over the Woods Memorial Bridge or the McTeer Bridge.",
    who: [
      {
        title: "Retirees who chose the water",
        text: [
          "You moved here for the view. We help you keep it — with help around the house and a hand when you need it.",
        ],
      },
      {
        title: "Parents with appointments in town",
        text: [
          "Doctor visits often mean a trip across the bridge. A caregiver can go with your mom and help her in and out safely.",
        ],
      },
      {
        title: "Families who want someone there at night",
        text: [
          "Island nights are quiet. If a parent shouldn't be alone, overnight care means someone is right there.",
        ],
      },
    ],
    care: [
      {
        name: "Personal Care",
        line: ["Bathing, dressing and moving safely around the house."],
      },
      {
        name: "Home Help",
        line: ["Meals, laundry, grocery runs and medication reminders."],
      },
      {
        name: "Companionship",
        line: ["Conversation, games and a slow walk outside to see the marsh."],
      },
      {
        name: "Respite Care",
        line: ["A real break for the person who's been on call all week."],
      },
      {
        name: "24-Hour & Overnight Care",
        line: ["Overnight care, so no one is alone after dark."],
      },
    ],
    faqs: [
      {
        id: "bridge-traffic",
        q: "What if the bridge is open or traffic is backed up?",
        a: [
          [
            "We plan for it. We know the busy times and leave room in the schedule. If a caregiver is ever running late, we'll call you.",
            {
              chip: "[late-arrival process]",
            },
          ],
        ],
      },
      {
        id: "appointments",
        q: "Can a caregiver take Dad to his appointments in Beaufort?",
        a: [
          [
            "A caregiver can go with him to appointments and help him in and out of the car and the office.",
            {
              chip: "[do caregivers drive clients in their own cars?]",
            },
          ],
        ],
      },
      {
        id: "visit-length",
        q: "Do you only do short visits out here?",
        a: [
          [
            "No. Care on Lady's Island is the same as everywhere we serve: a few hours, full days, overnight or around the clock — 7 days a week.",
          ],
        ],
      },
    ],
    nearby: ["Beaufort", "St. Helena Island", "Port Royal"],
    cta: "Let's talk about care on Lady's Island.",
  },
  {
    slug: "st-helena-island",
    eyebrow: "St. Helena Island · Out Sea Island Parkway",
    lead: "Many St. Helena families care for their elders at home. When you need an extra pair of hands, we're here — on your family's terms.",
    photo: "town-st-helena-island.jpg",
    alt: "A shaded country road under live oaks on St. Helena Island.",
    intro: {
      title: "Respect for how families here do things.",
      paras: [
        [
          "St. Helena is farmland, tidal creeks and family land passed down through generations. Penn Center, founded in 1862, still anchors the island's Gullah Geechee heritage.",
        ],
        [
          "Here, caring for an elder is often shared — a daughter, a grandson, a neighbor down the road. We don't replace that. We support it: a few hours so the family caregiver can work or rest, or help with the harder parts, like bathing.",
        ],
      ],
    },
    route: "Over the bridges and out Sea Island Parkway (US 21).",
    who: [
      {
        title: "Family caregivers who need a break",
        text: [
          "If you've been caring for your grandmother by yourself, respite care gives you time back — to work, rest or just breathe.",
        ],
      },
      {
        title: "Elders who want to stay on family land",
        text: ["Home is more than a house here. We help make staying there safe, day and night."],
      },
      {
        title: "Neighbors who live farther out",
        text: [
          "Homes on the island can be far apart. We come to you, wherever the driveway leads.",
        ],
      },
    ],
    care: [
      {
        name: "Personal Care",
        line: ["Gentle help with bathing, dressing and getting around."],
      },
      {
        name: "Home Help",
        line: ["Cooking, laundry, tidying up and medication reminders."],
      },
      {
        name: "Companionship",
        line: ["Company on the porch, a walk in the yard, stories and conversation."],
      },
      {
        name: "Respite Care",
        line: ["Time off for the family member who's always there."],
      },
      {
        name: "24-Hour & Overnight Care",
        line: ["Someone there through the night, so no one has to sit up alone."],
      },
    ],
    faqs: [
      {
        id: "island-visits",
        q: "Will a caregiver really come all the way out on the island?",
        a: [
          [
            "Yes. St. Helena is part of the area we serve, about 25 minutes from our office",
            {
              chip: "[drive time]",
            },
            ". Tell us where the house is when you call, and we'll plan the visit.",
          ],
        ],
      },
      {
        id: "respite",
        q: "We take care of Mama ourselves. Can you just give us a break?",
        a: [
          [
            "Yes. That's what respite care is for. We can step in for a few hours, a day or longer, and keep her routine the same while you're away.",
          ],
        ],
        link: { label: "About respite care →", href: "/care/respite-care" },
      },
      {
        id: "hurricanes",
        q: "What happens with care during a hurricane?",
        a: [
          [
            "Storms are part of life on the islands. At your free assessment, we'll talk through your family's storm plan and how care fits into it.",
            {
              chip: "[Dawson's emergency and evacuation plan]",
            },
          ],
        ],
      },
    ],
    nearby: ["Lady's Island", "Beaufort"],
    cta: "Let's talk about care on St. Helena.",
  },
  {
    slug: "burton",
    eyebrow: "Burton · Our neighborhood",
    lead: "Our office is on Robert Smalls Parkway — a road many Burton families drive every day. When you need help, we're close.",
    photo: "town-burton.jpg",
    alt: "A quiet Burton road lined with pines and live oaks.",
    intro: {
      title: "Close enough to be neighbors.",
      paras: [
        [
          "Burton is where Beaufort spreads out — quiet roads, big yards, neighborhoods off Robert Smalls Parkway and Parris Island Gateway. It's near the Air Station and Laurel Bay, so many families here have a military connection.",
        ],
        [
          "Some parents moved to Burton to be near a son or daughter in the service. Others have lived here all their lives. Either way, help is right around the corner.",
        ],
      ],
    },
    route: "Robert Smalls Parkway — our office is on it.",
    who: [
      {
        title: "Military families",
        text: [
          "Long shifts, deployments, moves. If your parent lives near you while you serve, we can cover the days you can't.",
        ],
      },
      {
        title: "People who want just a little help",
        text: [
          "Not everyone needs much. A few hours a week for housekeeping, errands or a shower can make a big difference.",
        ],
      },
      {
        title: "Families whose needs are changing",
        text: [
          "After a fall, a new diagnosis or a hard few months, needs change. We adjust the plan as you go.",
        ],
      },
    ],
    care: [
      {
        name: "Personal Care",
        line: ["Bathing, dressing and safe moves from bed to chair."],
      },
      {
        name: "Home Help",
        line: ["Light housekeeping, laundry, meals and errands."],
      },
      {
        name: "Companionship",
        line: ["Good company and a reason to get out of the house."],
      },
      {
        name: "Respite Care",
        line: ["A few hours for the family member juggling work and care."],
      },
      {
        name: "24-Hour & Overnight Care",
        line: ["Overnight care when someone shouldn't be alone."],
      },
    ],
    faqs: [
      {
        id: "office-distance",
        q: "How close is your office to Burton?",
        a: [
          [
            "Very close. We're at 69 Robert Smalls Parkway, Suite 3F — about 5 minutes from much of Burton",
            {
              chip: "[drive time]",
            },
            ". The office is open Monday–Friday, 8 AM–5 PM. Care is available 24 hours a day, 7 days a week.",
          ],
        ],
      },
      {
        id: "deployment",
        q: "I'm active duty and may deploy. Can you keep an eye on my mom?",
        a: [
          [
            "Yes. We can set up regular visits, and our owner keeps checking in as her needs change. Tell us how you'd like to get updates while you're away.",
            {
              chip: "[how families receive updates]",
            },
          ],
        ],
      },
      {
        id: "start-small",
        q: "Can I start with just a few hours a week?",
        a: [
          [
            "Yes. You can start small and add more help later.",
            {
              pending: [
                "Visits start at",
                {
                  chip: "[minimum hours]",
                },
                " hours.",
              ],
            },
          ],
        ],
        link: { label: "Estimate your cost →", href: "/paying-for-care" },
      },
    ],
    nearby: ["Beaufort", "Port Royal", "Okatie"],
    cta: "Let's talk about care in Burton.",
  },
  {
    slug: "bluffton",
    eyebrow: "Bluffton · Across the Broad River",
    lead: "Bluffton has grown fast. Lots of families here are new to the area — and far from the people who'd usually help. We can be that help.",
    photo: "town-bluffton.jpg",
    alt: "The May River at sunrise, seen from Old Town Bluffton.",
    intro: {
      title: "New to Bluffton? You're not on your own.",
      paras: [
        [
          "Old Town and the May River still set the pace, but new neighborhoods keep coming. Many people here moved in from somewhere else — to retire, or to be near grandchildren. That can mean the closest family is a plane ride away.",
        ],
        [
          "Bluffton is part of our extended service area. Our office is in Beaufort, across the Broad River Bridge. Call us and we'll talk through scheduling for your part of town.",
          {
            chip: "[Bluffton in service area]",
          },
        ],
      ],
    },
    route: "SC 170 over the Broad River Bridge.",
    who: [
      {
        title: "Parents who retired here",
        text: [
          "You chose Bluffton for this stage of life. A little help at home lets you keep enjoying it.",
        ],
      },
      {
        title: "Adult children who live out of state",
        text: [
          "When you're hours away, it helps to know someone local is checking in — and that our owner has met your mom in person.",
        ],
      },
      {
        title: "Couples who want to stay together at home",
        text: [
          "When one partner needs more help, care at home means you can stay together, in the home you chose.",
        ],
      },
    ],
    care: [
      {
        name: "Personal Care",
        line: ["Help with showers, dressing and getting around, with dignity."],
      },
      {
        name: "Home Help",
        line: ["Meals, laundry, errands and medication reminders."],
      },
      {
        name: "Companionship",
        line: ["A stroll in Old Town, lunch out or a good conversation at home."],
      },
      {
        name: "Respite Care",
        line: ["A break for the spouse who's been caring around the clock."],
      },
      {
        name: "24-Hour & Overnight Care",
        line: ["Overnight and round-the-clock care, 7 days a week."],
      },
    ],
    faqs: [
      {
        id: "bluffton-coverage",
        q: "Your office is in Beaufort. Do you really come to Bluffton?",
        a: [
          [
            "Yes. Bluffton is part of our extended service area, about 35–40 minutes from our office",
            {
              chip: "[drive time]",
            },
            ". Call us with the address and the hours you need, and we'll tell you straight away what we can do.",
          ],
        ],
      },
      {
        id: "family-updates",
        q: "I live out of state. How will I know how Mom is doing?",
        a: [
          [
            "Our owner stays involved after care starts, with regular follow-ups and check-ins. Tell us who should hear from us, and how.",
            {
              chip: "[how families receive updates]",
            },
          ],
        ],
      },
      {
        id: "remote-family",
        q: "Can the free assessment happen if I'm not there?",
        a: [
          [
            "Yes. Our owner can meet your parent at home, and you can join by phone.",
            {
              chip: "[phone or video join]",
            },
          ],
        ],
      },
    ],
    nearby: ["Okatie", "Hilton Head Island"],
    cta: "Let's talk about care in Bluffton.",
  },
  {
    slug: "hilton-head-island",
    eyebrow: "Hilton Head Island · Extended area",
    lead: "Beaches, bike paths and gated neighborhoods. We help island residents stay home and keep the life they came here for.",
    photo: "town-hilton-head-island.jpg",
    alt: "A bike path under pines and live oaks on Hilton Head Island.",
    intro: {
      title: "Island living, with help close at hand.",
      paras: [
        [
          "Hilton Head draws people who planned this chapter carefully. Then life changes — a fall, a surgery, a spouse who needs more help.",
        ],
        [
          "Many homes here sit inside gated communities with their own visitor rules. Some people live on the island only part of the year. We plan care around both. Hilton Head is the farthest part of our extended service area, so call us first — we'll be honest about what we can schedule.",
          {
            chip: "[Hilton Head in service area]",
          },
        ],
      ],
    },
    route: "SC 170 and US 278 onto the island.",
    who: [
      {
        title: "Residents of gated communities",
        text: [
          "We'll sort out gate access with you before the first visit, so care starts on time.",
        ],
      },
      {
        title: "Part-year residents",
        text: [
          "Here for the winter, or spending more time on the island than you planned? Talk to us about care that fits your season.",
        ],
      },
      {
        title: "Family who notice changes on a visit",
        text: [
          "Holiday visits are often when families see Dad isn't coping like he used to. If that's you, call us before you fly home.",
        ],
      },
    ],
    care: [
      {
        name: "Personal Care",
        line: ["Help with bathing, dressing and moving safely."],
      },
      {
        name: "Home Help",
        line: ["Meals, laundry, groceries and medication reminders."],
      },
      {
        name: "Companionship",
        line: ["A walk to the beach access, cards, conversation and outings."],
      },
      {
        name: "Respite Care",
        line: ["Time off for a spouse who's been caring alone."],
      },
      {
        name: "24-Hour & Overnight Care",
        line: ["Someone there day and night, 7 days a week."],
      },
    ],
    faqs: [
      {
        id: "gate-access",
        q: "My parents live in a gated community. Can your caregiver get in?",
        a: [
          [
            "Yes. Each community has its own visitor and pass rules. At your free assessment, we'll go over how yours works and set up access before the first visit.",
            {
              chip: "[gate-pass process and who covers any pass fees]",
            },
          ],
        ],
      },
      {
        id: "seasonal-care",
        q: "We only live here part of the year. Can care be seasonal?",
        a: [
          [
            "Talk to us. Care plans are built around your schedule.",
            {
              chip: "[seasonal start/stop policy]",
            },
          ],
        ],
      },
      {
        id: "distance",
        q: "Hilton Head is a long way from Beaufort. Will that affect care?",
        a: [
          [
            "It's the farthest town we serve, about 45–55 minutes away",
            {
              chip: "[drive time]",
            },
            ". That's why we ask you to call first. We'll tell you honestly which hours we can cover and how soon.",
            {
              chip: "[Hilton Head scheduling limits]",
            },
          ],
        ],
      },
    ],
    nearby: ["Bluffton", "Okatie"],
    cta: "Let's talk about care on Hilton Head.",
  },
  {
    slug: "okatie",
    eyebrow: "Okatie · Between Beaufort and Bluffton",
    lead: "From Sun City to the homes along the Okatie Highway, we help residents stay independent at home — with as much or as little help as they need.",
    photo: "town-okatie.jpg",
    alt: "A lagoon and walking path in an Okatie neighborhood.",
    intro: {
      title: "Independence is the point.",
      paras: [
        [
          "Okatie sits between Beaufort and Bluffton and reaches into both Beaufort and Jasper counties. It includes Sun City Hilton Head and neighborhoods like Riverbend and Oldfield.",
        ],
        [
          "A lot of people here are retired and busy — clubs, golf, volunteering, grandkids. Nobody wants to give that up. Often, one spouse quietly starts caring for the other. Our job is to help you both keep your life, and to give the caregiving spouse a real break.",
        ],
      ],
    },
    route: "SC 170 over the Broad River Bridge.",
    who: [
      {
        title: "Spouses caring for spouses",
        text: [
          "If you've become your husband's or wife's caregiver, you need rest too. Respite care gives you time back.",
        ],
      },
      {
        title: "Active adults who need a hand",
        text: ["A little help with housekeeping, meals or a shower can keep the calendar full."],
      },
      {
        title: "Residents of 55+ communities",
        text: [
          "Many communities offer activities, but not hands-on help at home. That's the part we fill.",
        ],
      },
    ],
    care: [
      {
        name: "Personal Care",
        line: ["Discreet help with bathing and dressing."],
      },
      {
        name: "Home Help",
        line: ["Meals, laundry, errands and medication reminders."],
      },
      {
        name: "Companionship",
        line: ["Company for clubs and events, walks around the lagoon, and outings."],
      },
      {
        name: "Respite Care",
        line: ["Hours off for the spouse who does it all."],
      },
      {
        name: "24-Hour & Overnight Care",
        line: ["Overnight care, so both of you can sleep."],
      },
    ],
    faqs: [
      {
        id: "sun-city",
        q: "Do you serve Sun City Hilton Head?",
        a: [
          [
            "Yes. Sun City is part of the Okatie area we serve.",
            {
              chip: "[Sun City in service area]",
            },
            " Call us with your address and the help you need.",
          ],
        ],
      },
      {
        id: "jasper-county",
        q: "Okatie is partly in Jasper County. Does that matter?",
        a: [["No. What matters is your address and the hours you need. Call us and we'll check."]],
      },
      {
        id: "caregiving-spouse",
        q: "I'm caring for my husband. Can you help both of us?",
        a: [
          [
            "Yes. We can help him with daily routines and give you regular time off. Most families combine two or three services, and we'll build your plan together at the free assessment.",
          ],
        ],
      },
    ],
    nearby: ["Bluffton", "Burton", "Hilton Head Island"],
    cta: "Let's talk about care in Okatie.",
  },
];

export const getTownPage = (slug: string) => townPages.find((t) => t.slug === slug);
