export type Lang = "en" | "ht";

export const LANGS: { code: Lang; label: string; native: string }[] = [
  { code: "ht", label: "Kreyòl", native: "Kreyòl" },
  { code: "en", label: "English", native: "English" },
];

export const DEFAULT_LANG: Lang = "ht";

export const messages = {
  en: {
    nav: {
      howItWorks: "How it works",
      tiers: "Tiers",
      pledge: "Pledge",
    },
    hero: {
      eyebrow: "Napo Air · Diaspora initiative",
      line1: "An airline",
      line2: "for the diaspora",
      line3: "by the diaspora.",
      lead:
        "Spirit Airlines is grounded. We're rallying the Haitian diaspora to pledge $25M and acquire a stake — turning fleet, gates, and routes into the foundation of a world-class airline that connects Ayiti to its people.",
      leadEm: "No money moves today. Just your word.",
      live: "Live",
      totalPledged: "Total pledged",
      pledgers: (n: number): string => (n === 1 ? "pledger" : "pledgers"),
      goal: "Goal",
      stats: {
        minimum: "Minimum pledge",
        goal: "Goal",
        tiers: "Tiers",
        region: "Region",
        worldwide: "Worldwide",
      },
      ctaPrimary: "Pledge $50+",
      ctaPrimarySub: "I'm in",
      ctaSecondary: "How it works",
      footnote: "$50 minimum · No charge today · 5 tiers · Pay later",
    },
    form: {
      eyebrow: "Pledge — no payment yet",
      title1: "Make your",
      title2: "commitment",
      titleEnd: ".",
      subtitle:
        "$50 minimum. We hold your word, not your money. When the raise opens, we'll reach out with secure payment instructions.",
      welcomeBack: (firstName: string) => `Welcome back, ${firstName}.`,
      alreadyPledged: (amount: string, count: number) =>
        `You've already pledged ${amount} across ${count} commitment${count === 1 ? "" : "s"}. New amount adds to your total.`,
      labels: {
        name: "Full name",
        email: "Email",
        city: "City",
        country: "Country",
        amount: "Pledge amount (USD)",
      },
      placeholders: {
        name: "Marie Joseph",
        email: "you@example.com",
        city: "Port-au-Prince",
        country: "Haiti",
      },
      minError: "Minimum pledge is $50.",
      moreToReach: (amount: string, tier: string) =>
        `${amount} more to reach ${tier}.`,
      submit: (amount: string) => `Pledge ${amount}`,
      submitSub: "I'm in",
      submitting: "Sending pledge…",
      disclaimer: "No payment now. Your data is held securely; never sold.",
      successNew: "Thank you.",
      successReturning: "Commitment increased.",
      successDescNew: (amount: string, tier: string) =>
        `You pledged ${amount}. You're a ${tier}.`,
      successDescReturning: (amount: string, total: string) =>
        `You added ${amount}. Total commitment now ${total}.`,
      successNext: (amount: string, tier: string) =>
        `${amount} more to ${tier}.`,
      addMore: "Add more",
      done: "Done",
      tiersTitle: "Tiers",
      tiersHead: "Where will your pledge land?",
      tiersSub:
        "Tiers are cumulative. Every additional pledge stacks toward a higher rank.",
    },
    feed: {
      eyebrow: "Live commitments",
      headline1: "The diaspora,",
      headline2: "in real time",
      headlineEnd: ".",
      emptyTitle: "Be the first.",
      emptyBody: "Your name lights up the feed when you pledge.",
      ago: "ago",
    },
    ticker: {
      from: "from",
      committed: "just committed",
    },
    manifesto: {
      eyebrow: "Manifesto",
      headline1: "We don't need permission to",
      headline2: "build our own wings",
      headlineEnd: ".",
      items: [
        {
          head: "By the diaspora",
          body: "Owned, governed, and capitalized by Haitians at home and abroad. Every pledger is a stakeholder in the story.",
        },
        {
          head: "Built on real assets",
          body: "Spirit's grounded fleet, gates, and routes are tangible — not vaporware. We're rallying capital to put them to work for our people.",
        },
        {
          head: "Word first, money later",
          body: "We collect commitments, not payments. When the raise opens, every pledger gets a private invitation with secure instructions.",
        },
      ],
    },
    footer: {
      brand: "Napo Air · An airline for the diaspora, by the diaspora.",
      note: "A pledge is a promise — no charge today.",
    },
    toggle: {
      label: "Language",
    },
    share: {
      cta: "Share my boarding pass",
      ctaShort: "Share",
      title: "Share your ticket",
      description:
        "Post your boarding pass anywhere. Anyone who pledges through your link boards too.",
      copy: "Copy link",
      copied: "Copied",
      native: "Share…",
      twitter: "Post on X",
      whatsapp: "WhatsApp",
      facebook: "Facebook",
      messages: "Messages",
      composedDefault:
        "I'm in. Let's buy Spirit Airlines and build an airline for the diaspora. Pledge $50+ ↓",
      composedTier: (tier: string): string =>
        `I just boarded as a ${tier}. Let's buy Spirit Airlines and build an airline for the diaspora. Pledge $50+ ↓`,
    },
    inviter: {
      eyebrow: "You were invited",
      headline: (name: string, city: string): string =>
        `${name} from ${city} just boarded.`,
      subhead: "Will you?",
      tierLabel: "boarded as a",
      cta: "Board with them",
    },
    trust: {
      eyebrow: "Why this matters",
      headline: "The diaspora has the capital. The fleet exists.",
      sub: "Spirit's gates, planes, and routes are tangible — not vaporware. We're rallying word-of-mouth capital to put them to work for our people.",
      pillars: [
        {
          k: "Real assets",
          v: "Actual aircraft, gates, and slots — already in the world.",
        },
        {
          k: "Word first, money later",
          v: "We collect commitments only. No charge until the raise opens.",
        },
        {
          k: "Owned together",
          v: "Every pledger is a stakeholder in the story being written.",
        },
      ],
      founderLine: (name: string): string =>
        `An idea by ${name} — rallied by the diaspora.`,
    },
    faq: {
      eyebrow: "Common questions",
      headline: "Before you board",
      items: [
        {
          q: "Is this real?",
          a: "Yes. This is a coordinated pledge drive — a public commitment to back a Haitian-led acquisition once the raise opens. No money moves through this site today.",
        },
        {
          q: "When do I actually pay?",
          a: "Only after the raise structure is finalized and you receive a private invitation with secure instructions. You can withdraw your pledge any time before then.",
        },
        {
          q: "What if we don't reach $25M?",
          a: "Pledges are non-binding. If we don't hit the threshold, no one pays anything and the pledge book is archived. The signal of demand still matters.",
        },
        {
          q: "What do I get if it succeeds?",
          a: "A stake proportional to your commitment, recognition by tier (Sipòtè → Fondatè), and a permanent place on the founders' wall.",
        },
        {
          q: "Where is my data stored?",
          a: "On Convex, a database we control directly. Your email is never sold or shared. We'll only contact you with raise-related updates.",
        },
      ],
    },
    tierBlurbs: {
      fondate: "First names engraved on a commemorative plaque on the aircraft.",
      pilye: "Priority access to all official events.",
      patron: "Certified pin + invitations to business updates.",
      bilder: "Access to monthly calls with the founder.",
      sipote: "Your name on the diaspora founders' wall.",
    } as Record<string, string>,
  },
  ht: {
    nav: {
      howItWorks: "Kòman l fonksyone",
      tiers: "Nivo yo",
      pledge: "Pledj",
    },
    hero: {
      eyebrow: "Napo Air · Inisyativ dyaspora a",
      line1: "Yon konpayi avyon",
      line2: "pou dyaspora a",
      line3: "pa dyaspora a.",
      lead:
        "Spirit Airlines a fèmen. N ap rasanble dyaspora ayisyen an pou nou pledje $25M epi pran yon pati nan li — pou nou itilize avyon, baryè, ak wout li yo kòm fondasyon yon konpayi avyon mondyal ki konekte Ayiti ak pèp li.",
      leadEm: "Pa gen lajan k ap deplase jodi a. Sèlman pawòl ou.",
      live: "Dirèk",
      totalPledged: "Total pledj yo",
      pledgers: (n: number): string => (n === 1 ? "pledjè" : "pledjè"),
      goal: "Objektif",
      stats: {
        minimum: "Minimòm pledj la",
        goal: "Objektif",
        tiers: "Nivo",
        region: "Rejyon",
        worldwide: "Tout kote",
      },
      ctaPrimary: "Pledje $50+",
      ctaPrimarySub: "Mwen ladan l",
      ctaSecondary: "Kòman l fonksyone",
      footnote:
        "$50 minimòm · Pa gen chaj jodi a · 5 nivo · Peye pita",
    },
    form: {
      eyebrow: "Pledj — pa gen peman ankò",
      title1: "Fè",
      title2: "komitman ou",
      titleEnd: ".",
      subtitle:
        "$50 minimòm. Nou kenbe pawòl ou, pa lajan ou. Lè kanpay la louvri, n ap kontakte ou ak enstriksyon peman an sekirite.",
      welcomeBack: (firstName: string) => `Byenvini ankò, ${firstName}.`,
      alreadyPledged: (amount: string, count: number) =>
        `Ou deja pledje ${amount} atravè ${count} komitman. Nouvo montan an ajoute sou total ou.`,
      labels: {
        name: "Non konplè",
        email: "Imèl",
        city: "Vil",
        country: "Peyi",
        amount: "Montan pledj la (USD)",
      },
      placeholders: {
        name: "Mari Jozèf",
        email: "ou@egzanp.com",
        city: "Pòtoprens",
        country: "Ayiti",
      },
      minError: "Minimòm pledj la se $50.",
      moreToReach: (amount: string, tier: string) =>
        `${amount} an plis pou rive nan ${tier}.`,
      submit: (amount: string) => `Pledje ${amount}`,
      submitSub: "Mwen ladan l",
      submitting: "N ap voye pledj la…",
      disclaimer:
        "Pa gen peman kounye a. Done w yo an sekirite; nou pa janm vann yo.",
      successNew: "Mèsi anpil.",
      successReturning: "Komitman ogmante.",
      successDescNew: (amount: string, tier: string) =>
        `Ou pledje ${amount}. Ou se yon ${tier}.`,
      successDescReturning: (amount: string, total: string) =>
        `Ou ajoute ${amount}. Total komitman an se ${total} kounye a.`,
      successNext: (amount: string, tier: string) =>
        `${amount} an plis pou ${tier}.`,
      addMore: "Ajoute plis",
      done: "Fini",
      tiersTitle: "Nivo yo",
      tiersHead: "Ki kote pledj ou pral rive?",
      tiersSub:
        "Nivo yo akimile. Chak pledj anplis ogmante ran ou.",
    },
    feed: {
      eyebrow: "Komitman dirèk",
      headline1: "Dyaspora a,",
      headline2: "an tan reyèl",
      headlineEnd: ".",
      emptyTitle: "Premye a.",
      emptyBody: "Non w klere sou lis la lè w pledje.",
      ago: "pase",
    },
    ticker: {
      from: "soti",
      committed: "fenk pledje",
    },
    manifesto: {
      eyebrow: "Manifès",
      headline1: "Nou pa bezwen pèmisyon pou",
      headline2: "konstwi pwòp zèl nou",
      headlineEnd: ".",
      items: [
        {
          head: "Pa dyaspora a",
          body: "Posede, dirije, e finanse pa Ayisyen lakay ak nan dyaspora a. Chak pledjè se yon aksyonè nan istwa a.",
        },
        {
          head: "Sou byen reyèl",
          body: "Avyon, baryè, ak wout Spirit yo egziste — se pa rèv. N ap rasanble kapital pou mete yo travay pou pèp nou.",
        },
        {
          head: "Pawòl anvan, lajan apre",
          body: "Nou ranmase komitman, pa peman. Lè kanpay la louvri, chak pledjè resevwa yon envitasyon prive ak enstriksyon an sekirite.",
        },
      ],
    },
    footer: {
      brand: "Napo Air · Yon konpayi avyon pou dyaspora a, pa dyaspora a.",
      note: "Yon pledj se yon pwomès — pa gen chaj jodi a.",
    },
    toggle: {
      label: "Lang",
    },
    share: {
      cta: "Pataje pas anbakman m",
      ctaShort: "Pataje",
      title: "Pataje tikè w",
      description:
        "Mete pas anbakman w nan rezo sosyal. Tout moun ki pledje atravè lyen w lan ap anbake tou.",
      copy: "Kopye lyen",
      copied: "Kopye",
      native: "Pataje…",
      twitter: "Pibliye sou X",
      whatsapp: "WhatsApp",
      facebook: "Facebook",
      messages: "Mesaj",
      composedDefault:
        "Mwen ladan l. Ann achte Spirit Airlines pou nou bati yon konpayi avyon pou dyaspora a. Pledje $50+ ↓",
      composedTier: (tier: string): string =>
        `Mwen fenk anbake kòm yon ${tier}. Ann achte Spirit Airlines pou nou bati yon konpayi avyon pou dyaspora a. Pledje $50+ ↓`,
    },
    inviter: {
      eyebrow: "Yo envite w",
      headline: (name: string, city: string): string =>
        `${name} soti ${city} fenk anbake.`,
      subhead: "Èske w ap fè menm jan an?",
      tierLabel: "anbake kòm yon",
      cta: "Anbake avèk yo",
    },
    trust: {
      eyebrow: "Poukisa sa enpòtan",
      headline: "Dyaspora a gen lajan an. Avyon yo egziste.",
      sub: "Baryè, avyon, ak wout Spirit yo egziste — se pa yon rèv. N ap rasanble kapital pawòl pou mete yo travay pou pèp nou.",
      pillars: [
        {
          k: "Byen reyèl",
          v: "Avyon, baryè, ak slot ki gentan egziste nan mond lan.",
        },
        {
          k: "Pawòl anvan, lajan apre",
          v: "Nou ranmase komitman sèlman. Pa gen chaj jiskaske kanpay la louvri.",
        },
        {
          k: "Posede ansanm",
          v: "Chak pledjè se yon aksyonè nan istwa a.",
        },
      ],
      founderLine: (name: string): string =>
        `Yon ide ${name} — pote pa dyaspora a.`,
    },
    faq: {
      eyebrow: "Kesyon yo souvan",
      headline: "Anvan w anbake",
      items: [
        {
          q: "Èske se vre?",
          a: "Wi. Se yon kanpay pledj ofisyèl — yon pwomès piblik pou sipòte yon akizisyon Spirit Airlines an Ayisyen lè kanpay la louvri. Pa gen lajan k ap deplase nan sit la jodi a.",
        },
        {
          q: "Kilè m ap peye toutbon?",
          a: "Sèlman apre estrikti kanpay la finalize epi w resevwa yon envitasyon prive ak enstriksyon an sekirite. Ou ka retire pledj ou nenpòt lè anvan sa.",
        },
        {
          q: "E si nou pa rive $25M?",
          a: "Pledj yo pa obligatwa. Si nou pa rive, pèsonn pa peye anyen e liv pledj la fèmen. Sinyal demand lan toujou enpòtan.",
        },
        {
          q: "Kisa m jwenn si reyalize?",
          a: "Yon aksyon ki pwopòsyonèl ak komitman ou, rekonesans pa nivo (Sipòtè → Fondatè), ak yon plas pèmanan sou miray fondatè a.",
        },
        {
          q: "Kote done m yo estoke?",
          a: "Sou Convex, yon baz done nou kontwole dirèkteman. Imèl ou pa janm vann ni pataje. N ap kontakte w sèlman pou nouvèl kanpay la.",
        },
      ],
    },
    tierBlurbs: {
      fondate: "Premye non yo k ap genyen plak komemoratif sou avyon an.",
      pilye: "Aksè priyoritè a tout evènman ofisyèl yo.",
      patron: "Pin sètifye + envitasyon sou pwogrè biznis lan.",
      bilder: "Aksè a apèl mansyèl ak fondatè a.",
      sipote: "Non w sou miray fondatè dyaspora a.",
    } as Record<string, string>,
  },
};

export type Messages = (typeof messages)["en"];
