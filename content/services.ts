/**
 * Service pages — docs/COPY_SERVICES.md, verbatim. One object per page; the template in
 * components/services/ renders them (design 03-personal-care-desktop.html).
 *
 * Placeholders: a `Tbc` is an unconfirmed sentence. It renders (with the .tbc chip) only when
 * NEXT_PUBLIC_SHOW_PLACEHOLDERS=true, and the text around it always reads correctly without it.
 */
import type { ServiceSlug } from "./navigation";

export type Tbc = { lead?: string; chip: string; after?: string };
/** A paragraph: plain text, optionally followed by one unconfirmed sentence. */
export type Para = { text: string; tbc?: Tbc };

export type ServiceIcon =
  | "towel"
  | "comb"
  | "cardigan"
  | "door"
  | "plate"
  | "walker"
  | "pot"
  | "laundry"
  | "broom"
  | "grocery"
  | "pills"
  | "calendar"
  | "cups"
  | "cards"
  | "path"
  | "bench"
  | "record"
  | "rocker"
  | "clock"
  | "weekend"
  | "repeat"
  | "planner"
  | "shoulder"
  | "moon"
  | "nightlight"
  | "pajamas"
  | "househeart"
  | "shifts"
  | "house";

export type DayStep = {
  time: string;
  /** 24-hour clock for <time datetime>. */
  dt: string;
  /** Position on the sky arc, 0 (left horizon) → 1 (right horizon). */
  arc: number;
  night?: boolean;
  title: string;
  /** One line — or two labelled lines on Respite ("Dad:" / "You:"). */
  lines: { label?: string; text: string }[];
};

export type ServiceFaq = {
  id: string;
  q: string;
  a: Para;
  /** Whole question hidden until confirmed (only shows with placeholders on). */
  hidden?: boolean;
};

export type ServicePage = {
  slug: ServiceSlug;
  name: string;
  meta: { title: string; description: string };
  hero: {
    smallLabel: string;
    /** H1 split around the colored accent word. */
    title: [string, string, string];
    lead: string;
    /** Hidden caption for the decorative video collage (what the placeholder clips show). */
    collageCaption: string;
    /** 24-Hour only: care vs office hours, directly under the microcopy. */
    hoursClarifier?: boolean;
  };
  fit: {
    checks: { id: string; label: string }[];
    /** Name used in "{Service} sounds like a good fit." */
    resultName: string;
  };
  included: {
    title: string;
    intro?: string;
    options?: { title: string; text: string }[];
    items: { icon: ServiceIcon; title: string; text: string; tbc?: Tbc }[];
    notIncluded: { title: string; text: string; tbc?: Tbc };
    hospice?: { text: string; chip: string };
  };
  day: {
    eyebrow: string;
    title: string;
    subline: string;
    steps: DayStep[];
    tbc?: Tbc;
  };
  safe: { title: string; points: { title: string; text: string }[]; tbc?: Tbc };
  pairs: { slug: ServiceSlug; name: string; line: string }[];
  cost: {
    title: string;
    body: string;
    estimator: { hours: number; days: number; overnight: 0 | 1 };
    minimumHoursLine: boolean;
  };
  faq: { title: string; items: ServiceFaq[] };
  cta: { title: [string, string, string] };
};

const minHours: Tbc = { lead: "Visits start at", chip: "[Minimum hours]", after: " hours." };

export const servicePages: ServicePage[] = [
  {
    slug: "personal-care",
    name: "Personal Care",
    meta: {
      title: "Personal Care at Home in Beaufort, SC | Dawson & Dawson",
      description:
        "Gentle, non-medical help with bathing, dressing, toileting and moving safely at home. Owner-run in Beaufort, SC since 2002. Free home visit.",
    },
    hero: {
      smallLabel: "Also called: help with daily living (ADLs)",
      title: ["Personal care, done with", "dignity", "."],
      lead: "Gentle help with bathing, dressing, the bathroom and moving around the house — so your loved one can stay home and stay themselves.",
      collageCaption:
        "Short animated clips of a Dawson caregiver walking beside an older woman with a walker, helping her with a cardigan, and helping her in a wheelchair.",
    },
    fit: {
      resultName: "Personal Care",
      checks: [
        { id: "pc-bathing", label: "Showering or bathing has started to feel risky." },
        {
          id: "pc-dressing",
          label: "Getting dressed takes ages, or buttons and zippers are hard.",
        },
        { id: "pc-transfers", label: "Getting out of bed or up from a chair is a struggle." },
        { id: "pc-toileting", label: "A little help in the bathroom would make life easier." },
        {
          id: "pc-hospital",
          label: "They're coming home from the hospital and need a hand for a while.",
        },
      ],
    },
    included: {
      title: "What we help with.",
      items: [
        {
          icon: "towel",
          title: "Bathing & showering",
          text: "Washing, drying and getting in and out of the tub or shower safely.",
        },
        {
          icon: "comb",
          title: "Grooming",
          text: "Shaving, brushing teeth, hair care — ready for the day.",
        },
        {
          icon: "cardigan",
          title: "Dressing",
          text: "Buttons, zippers, shoes and socks. They choose the outfit.",
        },
        {
          icon: "door",
          title: "Using the bathroom",
          text: "Toileting and continence care, handled calmly and privately.",
        },
        {
          icon: "plate",
          title: "Mealtimes",
          text: "Help eating, from the first bite to the last, at their own pace.",
        },
        {
          icon: "walker",
          title: "Moving safely",
          text: "Bed to chair, chair to wheelchair, room to room — a steady hand every step.",
        },
      ],
      notIncluded: {
        title: "What Personal Care doesn't include",
        text: "All our care is non-medical. We don't give injections, change wound dressings or provide nursing. If your loved one needs that, we're happy to work alongside your home health or hospice team.",
      },
    },
    day: {
      eyebrow: "03 — A day with Dawson",
      title: "What a day of personal care can look like.",
      subline:
        "An example with a morning and an evening visit. Every plan is built around your loved one.",
      steps: [
        {
          time: "8:00 AM",
          dt: "08:00",
          arc: 1 / 13,
          title: "Good morning",
          lines: [
            { text: "The caregiver arrives, puts the coffee on and asks Mom how she slept." },
          ],
        },
        {
          time: "8:30 AM",
          dt: "08:30",
          arc: 1.5 / 13,
          title: "A warm shower",
          lines: [
            {
              text: "Towels ready, water just right. She does what she can. We help with the rest.",
            },
          ],
        },
        {
          time: "9:15 AM",
          dt: "09:15",
          arc: 2.25 / 13,
          title: "Dressed for the day",
          lines: [{ text: "She picks the outfit. We help with buttons, shoes and hair." }],
        },
        {
          time: "9:45 AM",
          dt: "09:45",
          arc: 2.75 / 13,
          title: "Breakfast together",
          lines: [{ text: "A good breakfast, eaten at her pace, with someone to talk to." }],
        },
        {
          time: "10:30 AM",
          dt: "10:30",
          arc: 3.5 / 13,
          title: "Settled in",
          lines: [
            { text: "A steady arm to her favorite chair, everything she needs within reach." },
          ],
        },
        {
          time: "7:00 PM",
          dt: "19:00",
          arc: 12 / 13,
          night: true,
          title: "Evening visit",
          lines: [
            { text: "Washing up, into pajamas and safely into bed. Lights low, phone by the bed." },
          ],
        },
      ],
    },
    safe: {
      title: "Help that never feels like a takeover.",
      points: [
        {
          title: "Their way, at their pace",
          text: "We ask before we help, and let your loved one do what they can. Doors closed, towels ready, privacy first.",
        },
        {
          title: "Planned at home, by the owner",
          text: "Our owner visits first, sees how the home is set up and builds the plan with you — down to how they like their mornings.",
        },
        {
          title: "Experienced hands, always checked on",
          text: "Our caregivers are experienced, and our team includes Certified Nursing Assistants. We follow up regularly and adjust the plan as needs change.",
        },
      ],
    },
    pairs: [
      {
        slug: "home-help",
        name: "Home Help",
        line: "Meals, laundry and medication reminders on the same visit.",
      },
      {
        slug: "24-hour-care",
        name: "24-Hour & Overnight Care",
        line: "When help is needed at night too.",
      },
    ],
    cost: {
      title: "What does personal care cost?",
      body: "It depends on how many hours of help you need. Try our estimator — we've started it at an example schedule of 3 hours a day, 5 days a week. Change it to match yours.",
      estimator: { hours: 3, days: 5, overnight: 0 },
      minimumHoursLine: true,
    },
    faq: {
      title: "Questions about personal care.",
      items: [
        {
          id: "pc-privacy",
          q: "Mom is very private. Will this embarrass her?",
          a: {
            text: "We understand — it's the most common worry we hear. Your caregiver asks before helping, keeps her covered and lets her do whatever she can on her own. Many clients find it easier to accept help from a kind professional than from their own children.",
          },
        },
        {
          id: "pc-mobility",
          q: "Can you help if Dad uses a walker or wheelchair?",
          a: {
            text: "Yes. We help with moving from bed to chair, chair to wheelchair and room to room. At the free visit, our owner looks at how the home is set up so we can plan safe moves.",
            tbc: {
              chip: "[Experience with mechanical lifts (e.g. Hoyer) — add one sentence if yes]",
            },
          },
        },
        {
          id: "pc-not-nursing",
          q: "Is personal care the same as nursing?",
          a: {
            text: "No. Personal care is non-medical help with everyday things like bathing, dressing and using the bathroom. We don't give injections, change wound dressings or provide nursing. If your loved one needs medical care, we work alongside your home health team.",
          },
        },
        {
          id: "pc-hospital",
          q: "Can you start when Mom comes home from the hospital?",
          a: {
            text: "Yes — the first days home are when many families call us. If you can, call before discharge so we can plan the visit.",
            tbc: { lead: "How soon care can start:", chip: "[Typical start time]", after: "." },
          },
        },
        {
          id: "pc-visit-length",
          q: "How long is a personal care visit?",
          a: {
            text: "As long as you need. Some families want a morning visit for bathing and dressing. Others add an evening visit or longer days.",
            tbc: minHours,
          },
        },
      ],
    },
    cta: { title: ["Let's make mornings", "easier", "."] },
  },

  {
    slug: "home-help",
    name: "Home Help",
    meta: {
      title: "Home Help & Homemaker Care in Beaufort, SC | Dawson & Dawson",
      description:
        "Meals, laundry, light housekeeping, errands and medication reminders at home in Beaufort, SC. Owner-run since 2002. Book a free home visit.",
    },
    hero: {
      smallLabel: "Also called: homemaker care",
      title: ["Home help that keeps the house", "running", "."],
      lead: "Meals, laundry, errands and medication reminders — the everyday things that keep a home safe, comfortable and theirs.",
      collageCaption:
        "Short animated clips of a Dawson caregiver shopping for groceries with an older woman, carrying the bags home with her, and serving lunch to an older man at his kitchen table.",
    },
    fit: {
      resultName: "Home Help",
      checks: [
        { id: "hh-meals", label: "The fridge is nearly empty, or meals are mostly snacks." },
        { id: "hh-house", label: "Laundry and dishes are piling up." },
        { id: "hh-meds", label: "Pills get missed or taken twice." },
        { id: "hh-errands", label: "Grocery runs and errands have become hard." },
        { id: "hh-appointments", label: "Getting to appointments is a worry." },
      ],
    },
    included: {
      title: "What we help with.",
      items: [
        {
          icon: "pot",
          title: "Meals",
          text: "Planning, cooking and cleaning up — food they actually enjoy.",
        },
        {
          icon: "laundry",
          title: "Laundry & linens",
          text: "Washing, folding, putting away and fresh sheets on the bed.",
        },
        {
          icon: "broom",
          title: "Light housekeeping",
          text: "Dishes, tidying, wiping down — a safe, clutter-free home.",
        },
        {
          icon: "grocery",
          title: "Groceries & errands",
          text: "Shopping, prescriptions to pick up and the little jobs in town.",
        },
        {
          icon: "pills",
          title: "Medication reminders",
          text: "A friendly reminder at the right time. They take their own medicine.",
        },
        {
          icon: "calendar",
          title: "Appointments",
          text: "Going along to appointments so they're not on their own.",
          tbc: { chip: '[Do caregivers drive clients? If yes: "Rides to appointments and back."]' },
        },
      ],
      notIncluded: {
        title: "What Home Help doesn't include",
        text: "We remind — we don't give medication, fill pill organizers or manage prescriptions. Our housekeeping is light, everyday help, not deep cleaning or heavy jobs. All our care is non-medical.",
        tbc: {
          chip: '[Can caregivers fill weekly pill organizers? If yes, remove "fill pill organizers" from this note.]',
        },
      },
    },
    day: {
      eyebrow: "03 — A day with Dawson",
      title: "What a home help visit can look like.",
      subline: "An example of a four-hour midday visit. Every plan is built around your loved one.",
      steps: [
        {
          time: "10:00 AM",
          dt: "10:00",
          arc: 3 / 13,
          title: "Catching up",
          lines: [{ text: "The caregiver checks in with Dad and looks at what the week needs." }],
        },
        {
          time: "10:15 AM",
          dt: "10:15",
          arc: 3.25 / 13,
          title: "Laundry on",
          lines: [
            { text: "Sheets in the wash. A grocery list made together at the kitchen table." },
          ],
        },
        {
          time: "11:00 AM",
          dt: "11:00",
          arc: 4 / 13,
          title: "Out for groceries",
          lines: [{ text: "The things on his list — plus the pecans he forgot to write down." }],
        },
        {
          time: "12:00 PM",
          dt: "12:00",
          arc: 5 / 13,
          title: "Lunch and a reminder",
          lines: [{ text: "A hot lunch. A reminder for his noon pills, which he takes himself." }],
        },
        {
          time: "1:00 PM",
          dt: "13:00",
          arc: 6 / 13,
          title: "The house, sorted",
          lines: [{ text: "Dishes done, sheets folded, fresh bed made, floors clear." }],
        },
        {
          time: "1:45 PM",
          dt: "13:45",
          arc: 6.75 / 13,
          title: "Dinner ready to go",
          lines: [{ text: "A plate in the fridge, labeled, so supper is easy tonight." }],
        },
      ],
    },
    safe: {
      title: "Their home, their way.",
      points: [
        {
          title: "We follow their routines",
          text: 'Where the mugs go, how they like their eggs, which towels are "for guests." We learn it and keep it that way.',
        },
        {
          title: "A safer home, quietly",
          text: "A clear floor, a stocked fridge and pills taken on time make a real difference. We keep an eye out and let you know if something changes.",
        },
        {
          title: "The owner stays involved",
          text: "Our owner builds the plan at your free visit and keeps checking in. If needs change, the plan changes too.",
        },
      ],
    },
    pairs: [
      {
        slug: "companionship",
        name: "Companionship",
        line: "Someone to talk to while the chores get done.",
      },
      {
        slug: "personal-care",
        name: "Personal Care",
        line: "Help with bathing and dressing on the same visit.",
      },
    ],
    cost: {
      title: "What does home help cost?",
      body: "It depends on how many hours of help you need. Try our estimator — we've started it at an example schedule of 4 hours a day, 3 days a week. Change it to match yours.",
      estimator: { hours: 4, days: 3, overnight: 0 },
      minimumHoursLine: true,
    },
    faq: {
      title: "Questions about home help.",
      items: [
        {
          id: "hh-medication",
          q: "Can your caregiver give Dad his medication?",
          a: {
            text: "We give medication reminders — a friendly nudge at the right time so he takes his own medicine. We don't give medication or manage prescriptions. If he needs someone to give medicine, ask his doctor or home health team, and we'll happily work alongside them.",
          },
        },
        {
          id: "hh-cleaning",
          q: "Do you do deep cleaning?",
          a: {
            text: "Our housekeeping is light, everyday help: dishes, laundry, tidying and keeping floors clear. For deep cleaning or big jobs, a cleaning service is a better fit.",
          },
        },
        {
          id: "hh-appointments",
          q: "Can you take Mom to her doctor's appointments?",
          a: {
            text: "Yes, a caregiver can go with her so she isn't on her own.",
            tbc: {
              chip: "[Do caregivers drive clients in their own car or the client's car? Replace this sentence with the confirmed answer.]",
            },
          },
        },
        {
          id: "hh-meals",
          q: "Can you cook for her diet?",
          a: {
            text: "Yes. We cook what she likes and follow any eating guidance from her doctor or family. Tell us at the free visit and we'll build it into the plan.",
          },
        },
        {
          id: "hh-family-away",
          q: "Do I need to be there during visits?",
          a: {
            text: "No. Many families we help don't live nearby. At the free visit, we'll agree how the caregiver gets in and how we keep you updated.",
          },
        },
      ],
    },
    cta: { title: ["Let's take a few things off", "your", "list."] },
  },

  {
    slug: "companionship",
    name: "Companionship",
    meta: {
      title: "Companion Care for Seniors in Beaufort, SC | Dawson & Dawson",
      description:
        "Friendly company, conversation, walks, games and outings for older adults at home in Beaufort, SC. Owner-run since 2002. Free home visit.",
    },
    hero: {
      smallLabel: "Also called: companion care",
      title: ["Companionship that brightens the", "week", "."],
      lead: "Good conversation, a game of cards, a walk outside. Company that gives your loved one something to look forward to.",
      collageCaption:
        "Short animated clips of a Dawson caregiver on a walk in the park with an older woman, looking through a photo album with her, and playing checkers with an older man.",
    },
    fit: {
      resultName: "Companionship",
      checks: [
        { id: "co-lonely", label: "They spend most days alone." },
        { id: "co-quiet", label: "They've stopped going out or seeing friends." },
        { id: "co-calls", label: "Your phone calls are the main conversation of their day." },
        { id: "co-hobbies", label: "They've let go of hobbies they used to love." },
        { id: "co-worry", label: "You'd feel better knowing someone stops by." },
      ],
    },
    included: {
      title: "What we do together.",
      items: [
        {
          icon: "cups",
          title: "Conversation",
          text: "Real talk, good listening and stories worth hearing twice.",
        },
        {
          icon: "cards",
          title: "Games & puzzles",
          text: "Cards, board games, crosswords — a little friendly competition.",
        },
        {
          icon: "path",
          title: "Walks",
          text: "A daily walk around the neighborhood or out to the porch.",
        },
        {
          icon: "bench",
          title: "Time outdoors",
          text: "Fresh air, trips to the park and a change of scenery.",
          tbc: { chip: "[Transport — do caregivers drive clients?]" },
        },
        {
          icon: "record",
          title: "Hobbies & music",
          text: "Gardening, baking, old records, photo albums — whatever they love.",
        },
        {
          icon: "rocker",
          title: "Simply being there",
          text: "Sometimes the best help is a friendly face in the next chair.",
        },
      ],
      notIncluded: {
        title: "What Companionship doesn't include",
        text: "Companionship doesn't include hands-on help like bathing or dressing — that's Personal Care, and it's easy to add. All our care is non-medical.",
      },
    },
    day: {
      eyebrow: "03 — A day with Dawson",
      title: "What a companionship visit can look like.",
      subline: "An example of an afternoon visit. Every plan is built around your loved one.",
      steps: [
        {
          time: "1:00 PM",
          dt: "13:00",
          arc: 6 / 13,
          title: "Lunch for two",
          lines: [{ text: "Sandwiches on the porch and the latest news from the family." }],
        },
        {
          time: "1:45 PM",
          dt: "13:45",
          arc: 6.75 / 13,
          title: "A walk around the block",
          lines: [{ text: "Slow and steady, stopping to say hello to the neighbors." }],
        },
        {
          time: "2:30 PM",
          dt: "14:30",
          arc: 7.5 / 13,
          title: "The card table",
          lines: [{ text: "Rummy, best of three. She's winning, as usual." }],
        },
        {
          time: "3:30 PM",
          dt: "15:30",
          arc: 8.5 / 13,
          title: "The photo albums",
          lines: [{ text: "Stories about the old house, the wedding, the grandkids." }],
        },
        {
          time: "4:15 PM",
          dt: "16:15",
          arc: 9.25 / 13,
          title: "A call to the family",
          lines: [{ text: "A video call with the grandkids, set up and ready to go." }],
        },
        {
          time: "4:45 PM",
          dt: "16:45",
          arc: 9.75 / 13,
          title: "See you Thursday",
          lines: [{ text: "Tea made, TV on, and something to look forward to." }],
        },
      ],
    },
    safe: {
      title: "A friend, not a babysitter.",
      points: [
        {
          title: "Built around who they are",
          text: "At the free visit, our owner gets to know your loved one — their stories, interests and favorite things — so visits feel natural from day one.",
        },
        {
          title: "The right match",
          text: "We choose a caregiver who fits your loved one's personality and schedule. If it's not the right fit, tell us and we'll make it right.",
        },
        {
          title: "An extra set of eyes",
          text: "Regular visits mean someone notices if something changes. We follow up with you and adjust the plan when needs grow.",
        },
      ],
      tbc: {
        chip: "[Confirm the agency will re-match caregivers on request (\"If it's not the right fit, tell us and we'll make it right\")]",
      },
    },
    pairs: [
      {
        slug: "home-help",
        name: "Home Help",
        line: "Lunch cooked, laundry done and a good chat, all in one visit.",
      },
      {
        slug: "respite-care",
        name: "Respite Care",
        line: "Company for Mom while you take a well-earned break.",
      },
    ],
    cost: {
      title: "What does companionship cost?",
      body: "It depends on how many hours you'd like. Try our estimator — we've started it at an example schedule of 3 hours a day, 2 days a week. Change it to match yours.",
      estimator: { hours: 3, days: 2, overnight: 0 },
      minimumHoursLine: true,
    },
    faq: {
      title: "Questions about companionship.",
      items: [
        {
          id: "co-real-care",
          q: 'Is companionship "real" care?',
          a: {
            text: "Yes. Loneliness is hard on anyone, and a regular friendly visit can lift a whole week. Companionship also means someone is checking in — and noticing if something changes.",
          },
        },
        {
          id: "co-few-hours",
          q: "Can we start with just a few hours a week?",
          a: {
            text: "Yes. Many families start small, with a visit or two a week, and add more later if needed.",
            tbc: minHours,
          },
        },
        {
          id: "co-outings",
          q: "Can you take Mom out — to the park, church or lunch?",
          a: {
            text: "Yes, getting out is a big part of companionship.",
            tbc: {
              chip: "[Do caregivers drive clients? Replace this sentence with how outings and transport work.]",
            },
          },
        },
        {
          id: "co-reluctant",
          q: 'What if Dad doesn\'t want "help"?',
          a: {
            text: "That's very common. Companionship is often the easiest way to start, because it doesn't feel like help — it feels like a new friend. Our owner can suggest gentle ways to introduce the idea at the free visit.",
          },
        },
        {
          id: "co-memory",
          q: "Do you help people with memory loss?",
          hidden: true,
          a: {
            text: "",
            tbc: {
              chip: "[Dementia/Alzheimer's support — do not publish this question until confirmed. Do not add as a service.]",
            },
          },
        },
      ],
    },
    cta: { title: ["Let's bring some", "company", "back into the week."] },
  },

  {
    slug: "respite-care",
    name: "Respite Care",
    meta: {
      title: "Respite Care in Beaufort, SC | Dawson & Dawson",
      description:
        "Take a break from caregiving. Dawson steps in for a few hours, a weekend or longer while your loved one keeps their routine. Beaufort, SC since 2002.",
    },
    hero: {
      smallLabel: "Also called: respite",
      title: ["Respite care that gives you a real", "break", "."],
      lead: "Caring for someone you love is hard work. We step in for a few hours, a weekend or longer — so you can rest, and your loved one keeps their routine.",
      collageCaption:
        "Short animated clips of a daughter heading out as a Dawson caregiver arrives to stay with her father, and the caregiver relaxing with him on the sofa.",
    },
    fit: {
      resultName: "Respite Care",
      checks: [
        { id: "re-tired", label: "You're the main caregiver and you're running on empty." },
        { id: "re-dayoff", label: "You can't remember your last full day off." },
        { id: "re-work", label: "Work, kids or your own health need more of you." },
        { id: "re-travel", label: "There's a trip, wedding or event you don't want to miss." },
        {
          id: "re-backup",
          label: "You need someone you trust on call for the days you can't be there.",
        },
      ],
    },
    included: {
      title: "What respite care covers.",
      intro: "While you're away, we do what you'd do. That can include any of our care.",
      items: [
        {
          icon: "clock",
          title: "A few hours",
          text: "Time for an appointment, a nap or coffee with a friend.",
        },
        {
          icon: "weekend",
          title: "A weekend or longer",
          text: "Care around the clock while you travel or recharge.",
        },
        {
          icon: "repeat",
          title: "Regular breaks",
          text: "A standing afternoon off every week — something to count on.",
        },
        {
          icon: "planner",
          title: "Their routine, kept",
          text: "Meals, pills on time, their shows, their bedtime — just how you do it.",
        },
        {
          icon: "shoulder",
          title: "Personal care",
          text: "Bathing, dressing and the bathroom, if they need it.",
        },
        {
          icon: "cups",
          title: "Company",
          text: "Conversation, games and walks, so the time flies for them too.",
        },
      ],
      notIncluded: {
        title: "What Respite Care doesn't include",
        text: "All our care is non-medical. We don't give injections, change wound dressings or provide nursing. If your loved one has a home health or hospice team, we work alongside them.",
      },
    },
    day: {
      eyebrow: "03 — A day with Dawson",
      title: "A Saturday off — for both of you.",
      subline: "An example of a full-day respite visit. Every plan is built around your family.",
      steps: [
        {
          time: "9:00 AM",
          dt: "09:00",
          arc: 2 / 13,
          title: "The handoff",
          lines: [
            { label: "Dad:", text: "Coffee with a caregiver he already met at the free visit." },
            {
              label: "You:",
              text: "Out the door, with nothing to remember. It's all in the plan.",
            },
          ],
        },
        {
          time: "10:30 AM",
          dt: "10:30",
          arc: 3.5 / 13,
          title: "Morning",
          lines: [
            { label: "Dad:", text: "A walk around the block and his crossword." },
            { label: "You:", text: "A long, slow breakfast somewhere you haven't been in years." },
          ],
        },
        {
          time: "12:30 PM",
          dt: "12:30",
          arc: 5.5 / 13,
          title: "Lunch",
          lines: [
            { label: "Dad:", text: "His usual — and a reminder for his midday pills." },
            { label: "You:", text: "Lunch with an old friend. Phone face down on the table." },
          ],
        },
        {
          time: "2:00 PM",
          dt: "14:00",
          arc: 7 / 13,
          title: "Afternoon",
          lines: [
            { label: "Dad:", text: "A nap, then the ballgame on TV." },
            { label: "You:", text: "Whatever you want. That's the point." },
          ],
        },
        {
          time: "5:00 PM",
          dt: "17:00",
          arc: 10 / 13,
          title: "Welcome home",
          lines: [
            { label: "Dad:", text: "Settled, fed and in a good mood." },
            {
              label: "You:",
              text: "A quick update on his day, and a little more of yourself back.",
            },
          ],
        },
      ],
      tbc: {
        chip: '[Can the caregiver attend the assessment or a meet-and-greet? If not: "Coffee with his caregiver, who already knows his routine from the plan."]',
      },
    },
    safe: {
      title: "Leave with peace of mind.",
      points: [
        {
          title: "Nothing changes for them",
          text: "We follow the routine you've built — meals, medication reminders, bedtime, the little things that keep them calm.",
        },
        {
          title: "Planned before you go",
          text: "Our owner visits first and writes down what matters: how they like their coffee, what helps on a hard day, who to call.",
        },
        {
          title: "You're never out of reach",
          text: "We keep you updated in the way you prefer, and we'll call you right away if anything comes up.",
        },
      ],
    },
    pairs: [
      {
        slug: "personal-care",
        name: "Personal Care",
        line: "Hands-on help with bathing and dressing while you're away.",
      },
      {
        slug: "24-hour-care",
        name: "24-Hour & Overnight Care",
        line: "For trips and weekends when someone needs to be there at night.",
      },
    ],
    cost: {
      title: "What does respite care cost?",
      body: "It depends on how long your break is. Try our estimator — we've started it at an example of one 8-hour day a week. Change it to match yours, or turn on overnight care for a weekend away.",
      estimator: { hours: 8, days: 1, overnight: 0 },
      minimumHoursLine: true,
    },
    faq: {
      title: "Questions about respite care.",
      items: [
        {
          id: "re-length",
          q: "How long can respite care last?",
          a: {
            text: "As long as you need — a few hours, a full day, a weekend or longer. Care is available 24 hours a day, 7 days a week, so we can cover nights too.",
          },
        },
        {
          id: "re-regular",
          q: "Can I book a regular break, not just emergencies?",
          a: {
            text: "Yes. Many caregivers set up a standing afternoon or day off each week. It's easier to keep going when you know a break is coming.",
          },
        },
        {
          id: "re-new-person",
          q: "Will Dad be OK with someone new?",
          a: {
            text: "It's normal to worry. Our owner meets him first at the free visit, and we choose a caregiver who fits his personality and routine. You're welcome to stay for the first visit until everyone's comfortable.",
          },
        },
        {
          id: "re-booking",
          q: "How far ahead should I book?",
          a: {
            text: "As early as you can, especially for holidays and trips. Call (843) 379-3321 and we'll do our best to help — even at short notice.",
            tbc: { chip: "[Typical notice needed]" },
          },
        },
        {
          id: "re-guilt",
          q: "I feel guilty taking a break. Is that normal?",
          a: {
            text: "Very. But rest isn't selfish — it's how you keep caring for the people you love. A rested caregiver is a better caregiver.",
          },
        },
      ],
    },
    cta: { title: ["You've earned a", "break", "."] },
  },

  {
    slug: "24-hour-care",
    name: "24-Hour & Overnight Care",
    meta: {
      title: "24-Hour & Overnight Care in Beaufort, SC | Dawson & Dawson",
      description:
        "Non-medical care day and night at home in Beaufort, SC. Overnight help, safe bathroom trips and support after a hospital stay. Owner-run since 2002.",
    },
    hero: {
      smallLabel: "Also called: round-the-clock care",
      title: ["24-hour care, so someone's always", "there", "."],
      lead: "Overnight help or care around the clock, 7 days a week. Your loved one stays safe at home — and you can finally sleep.",
      collageCaption:
        "Short animated clips of a Dawson caregiver walking an older woman down a night-lit hallway, and checking on her at her bedside.",
      hoursClarifier: true,
    },
    fit: {
      resultName: "24-Hour & Overnight Care",
      checks: [
        { id: "tf-night", label: "They get up at night and you worry about a fall." },
        { id: "tf-fall", label: "They've had a fall, or a close call, recently." },
        { id: "tf-hospital", label: "They're coming home from the hospital or rehab." },
        { id: "tf-alone", label: "They can't safely be alone for long." },
        { id: "tf-sleep", label: "You haven't slept through the night in weeks." },
      ],
    },
    included: {
      title: "What we help with.",
      options: [
        {
          title: "Overnight care",
          text: "A caregiver through the night — help to bed, help to the bathroom and someone there until morning.",
        },
        {
          title: "24-hour care",
          text: "Care around the clock, in shifts, so a rested caregiver is always there, day and night.",
        },
      ],
      items: [
        {
          icon: "moon",
          title: "Overnight support",
          text: "Someone in the home through the night, every night you need.",
        },
        {
          icon: "nightlight",
          title: "Safe bathroom trips",
          text: "A steady arm in the dark, then back to bed.",
        },
        {
          icon: "pajamas",
          title: "Bedtime & mornings",
          text: "Help getting ready for bed and getting up the next day.",
        },
        {
          icon: "househeart",
          title: "After a fall or hospital stay",
          text: "Extra support for the first days and weeks home.",
        },
        {
          icon: "shifts",
          title: "Shifts covered",
          text: "Day and night shifts, 7 days a week, weekends and holidays.",
        },
        {
          icon: "house",
          title: "All our care",
          text: "Personal care, home help and company, any hour.",
        },
      ],
      notIncluded: {
        title: "What 24-Hour Care doesn't include",
        text: "Our caregivers aren't nurses, and all our care is non-medical. We don't give injections, change wound dressings or provide nursing — day or night. If your loved one has a home health or hospice team, we work alongside them.",
      },
      hospice: {
        text: "Already working with a hospice or palliative team? We can provide non-medical comfort and companionship alongside them, day or night.",
        chip: "[Hospice/palliative support — to confirm]",
      },
    },
    day: {
      eyebrow: "03 — A night with Dawson",
      title: "What a night of care can look like.",
      subline:
        "An example of a night shift in 24-hour care. Every plan is built around your loved one.",
      steps: [
        {
          time: "7:00 PM",
          dt: "19:00",
          arc: 0.08,
          night: true,
          title: "Shift change",
          lines: [{ text: "The day caregiver tells the night caregiver how Mom's day went." }],
        },
        {
          time: "8:30 PM",
          dt: "20:30",
          arc: 0.2,
          night: true,
          title: "Getting ready for bed",
          lines: [
            { text: "Washing up, into her nightgown, a cup of decaf and her favorite show." },
          ],
        },
        {
          time: "10:00 PM",
          dt: "22:00",
          arc: 0.32,
          night: true,
          title: "Lights low",
          lines: [
            { text: "Tucked in, night light on, the walker right where she reaches for it." },
          ],
        },
        {
          time: "2:15 AM",
          dt: "02:15",
          arc: 0.6,
          night: true,
          title: "A bathroom trip",
          lines: [
            { text: "She's up. A steady arm there and back, and she's asleep again in minutes." },
          ],
        },
        {
          time: "6:30 AM",
          dt: "06:30",
          arc: 0.06,
          title: "Good morning",
          lines: [{ text: "Up and dressed, coffee on, a slow start to the day." }],
        },
        {
          time: "7:00 AM",
          dt: "07:00",
          arc: 0.1,
          title: "Shift change",
          lines: [{ text: "The night caregiver passes on how she slept. The day begins." }],
        },
      ],
      tbc: {
        chip: '[Are overnight caregivers awake all night? This timeline assumes awake shifts. If sleep-over overnight care is also offered, add: "With overnight care, your caregiver rests nearby and helps whenever needed."]',
      },
    },
    safe: {
      title: "Calm nights, safer mornings.",
      points: [
        {
          title: "A plan for the night",
          text: "Our owner visits first and looks at the bedroom, the path to the bathroom and the night routine — then builds the plan around it.",
        },
        {
          title: "Rested caregivers, clear handoffs",
          text: "24-hour care is covered in shifts, so the person caring for your loved one is alert. Each caregiver passes on what the next one needs to know.",
        },
        {
          title: "You're kept in the loop",
          text: "We follow up with you regularly and adjust the plan as needs change. If anything comes up overnight, we'll reach you the way you've asked us to.",
        },
      ],
      tbc: {
        lead: "Existing clients can reach us after hours at",
        chip: "[After-hours line for existing clients]",
        after: ".",
      },
    },
    pairs: [
      {
        slug: "personal-care",
        name: "Personal Care",
        line: "Help with bathing and dressing, morning and night.",
      },
      {
        slug: "respite-care",
        name: "Respite Care",
        line: "Overnight cover so the family caregiver can sleep or travel.",
      },
    ],
    cost: {
      title: "What does 24-hour care cost?",
      body: "It depends on how many hours and nights you need. Try our estimator — we've started it at 24 hours a day, 7 days a week. Change it to match yours, like nights only.",
      estimator: { hours: 24, days: 7, overnight: 1 },
      minimumHoursLine: false,
    },
    faq: {
      title: "Questions about 24-hour and overnight care.",
      items: [
        {
          id: "tf-difference",
          q: "What's the difference between overnight care and 24-hour care?",
          a: {
            text: "Overnight care covers the night — from bedtime to morning. 24-hour care covers the whole day and night, in shifts, so someone is always there. Many families start with nights and add days later.",
          },
        },
        {
          id: "tf-awake",
          q: "Does the caregiver stay awake all night?",
          hidden: true,
          a: {
            text: "",
            tbc: {
              chip: '[Awake vs sleep-over overnight shifts. Draft if awake: "Yes. Our overnight caregivers stay awake and alert, so help is there the moment it\'s needed."]',
            },
          },
        },
        {
          id: "tf-nurse",
          q: "Is a nurse there at night?",
          a: {
            text: "No. Our care is non-medical, day and night. Our team includes Certified Nursing Assistants, but we don't provide nursing, injections or wound care. If your loved one needs medical care at home, we work alongside their home health team.",
          },
        },
        {
          id: "tf-hospital",
          q: "Can you start right after a hospital stay?",
          a: {
            text: "Yes. Coming home is when round-the-clock help matters most. If you can, call us before discharge so we can plan the first nights.",
            tbc: { lead: "How soon care can start:", chip: "[Typical start time]", after: "." },
          },
        },
        {
          id: "tf-weekends",
          q: "Can care cover weekends and holidays?",
          a: {
            text: "Yes. Care is available 24 hours a day, 7 days a week, including weekends and holidays. Our office is open Monday to Friday, 8 AM to 5 PM.",
          },
        },
      ],
    },
    cta: { title: ["Let's make nights feel", "calm", "again."] },
  },
];

export const getServicePage = (slug: string) => servicePages.find((s) => s.slug === slug);

export const assessmentHref = (slug?: string, needs: string[] = []) => {
  const p = new URLSearchParams();
  if (slug) p.set("service", slug);
  if (needs.length) p.set("needs", needs.join(","));
  const q = p.toString();
  return `/free-assessment${q ? `?${q}` : ""}`;
};

export const estimatorHref = (slug: string, e: { hours: number; days: number; overnight: 0 | 1 }) =>
  `/paying-for-care?service=${slug}&hours=${e.hours}&days=${e.days}&overnight=${e.overnight}#estimator`;
