import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  PenTool,
  Flame,
  Brush,
  Wrench,
  Leaf,
  Users,
  Hand,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us — Flint & Beam",
  description:
    "Light, made by hand in Sonoma, California. Every Flint & Beam fixture is crafted to order in our Sonoma workshop by artisans who believe lighting should be as enduring as the landscapes that inspire it.",
  openGraph: {
    title: "About Flint & Beam — Handcrafted Lighting from Sonoma",
    description:
      "Light, made by hand in Sonoma, California. Every fixture is crafted to order using time-honored techniques.",
  },
};

/* ------------------------------------------------------------------ */
/*  Process steps                                                      */
/* ------------------------------------------------------------------ */

const PROCESS_STEPS = [
  {
    icon: PenTool,
    title: "Design",
    description:
      "Every piece begins as a sketch in our Sonoma studio. We draw inspiration from California landscapes — oak groves, coastal bluffs, vineyard rows — translating natural forms into lighting that feels both timeless and rooted in place.",
  },
  {
    icon: Flame,
    title: "Cast",
    description:
      "Using sand casting, lost wax, and hand-forging techniques, we shape raw brass, bronze, iron, and copper into the forms you see. Each metal pour is monitored by eye — no two castings are identical, and that's the point.",
  },
  {
    icon: Brush,
    title: "Finish",
    description:
      "Our finishes are applied by hand: natural patinas, aged bronze, polished brass, matte terracotta. We use traditional chemical and mechanical finishing techniques that bring out the character of each material without hiding its origins.",
  },
  {
    icon: Wrench,
    title: "Assemble",
    description:
      "Every fixture is assembled, wired, and tested in our workshop. Glass shades are hand-blown by our glass partners. Wood components are turned, sanded, and oiled. Each piece is inspected before it leaves Sonoma.",
  },
];

/* ------------------------------------------------------------------ */
/*  Values                                                             */
/* ------------------------------------------------------------------ */

const VALUES = [
  {
    icon: Hand,
    title: "Craftsmanship",
    description:
      "We believe in making things that last. Every fixture is built to order by skilled artisans using techniques passed down through generations. No assembly lines, no shortcuts — just careful, deliberate work.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description:
      "We source materials responsibly, use reclaimed wood where possible, and design fixtures that are serviceable and repairable. A Flint & Beam piece is meant to be passed down, not thrown away.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "We are part of Sonoma's community of makers, farmers, and craftspeople. We hire locally, support local suppliers, and believe that good business means being a good neighbor.",
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: "var(--bg)" }}>
      {/* Hero */}
      <section
        className="py-20 lg:py-28 px-4"
        style={{ backgroundColor: "var(--sand)" }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <p
            className="text-sm uppercase tracking-[0.2em] mb-4 font-medium"
            style={{ color: "var(--accent)" }}
          >
            Our Story
          </p>
          <h1
            className="text-4xl lg:text-5xl xl:text-6xl font-medium leading-tight"
            style={{ color: "var(--heading)" }}
          >
            Light, made by hand in Sonoma.
          </h1>
          <p
            className="mt-6 text-lg max-w-xl mx-auto"
            style={{ color: "var(--body)" }}
          >
            Flint & Beam was founded on a simple belief: the objects we live
            with should be made with care, by people who care.
          </p>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-20 lg:py-28 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image placeholder */}
          <div
            className="aspect-[4/5] rounded-xl overflow-hidden"
            style={{ backgroundColor: "var(--sand)" }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <Image
                src="https://platform-outputs.agnes-ai.space/images/t2i/2aef12e05fbe4997a08ea4e072f62820.png"
                alt="Artisan hand-finishing a brass lighting fixture in Sonoma workshop"
                width={600}
                height={750}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div>
            <p
              className="text-sm uppercase tracking-[0.2em] mb-4 font-medium"
              style={{ color: "var(--accent)" }}
            >
              How It Began
            </p>
            <h2
              className="text-3xl lg:text-4xl font-medium mb-6"
              style={{ color: "var(--heading)" }}
            >
              A workshop, a forge, and a stubborn idea.
            </h2>
            <div className="space-y-4" style={{ color: "var(--body)" }}>
              <p>
                In 2008, Mara and Leo Castellani left their jobs in San
                Francisco — she was an architect, he was a metal fabricator —
                and moved to a small property outside Sonoma with a
                hundred-year-old barn and a dream of making things with their
                hands again.
              </p>
              <p>
                They built a forge in the barn. Mara designed the first fixture
                — a simple brass sconce with a hand-hammered backplate — for
                their own kitchen. Friends asked for one. Then their friends
                asked. By 2010, Flint & Beam was a real business, shipping
                handcrafted lighting to design studios and homeowners across the
                country.
              </p>
              <p>
                Today, we are a team of fourteen artisans, designers, and
                craftspeople working out of a sunlit workshop a mile from the
                Sonoma Plaza. We still do things the slow way: each fixture is
                made to order, finished by hand, and shipped with a note from
                the person who built it.
              </p>
              <p className="font-medium" style={{ color: "var(--heading)" }}>
                We believe lighting should be as enduring as the landscapes that
                inspire it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section
        className="py-20 lg:py-28 px-4"
        style={{ backgroundColor: "var(--sand)" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p
              className="text-sm uppercase tracking-[0.2em] mb-4 font-medium"
              style={{ color: "var(--accent)" }}
            >
              Our Process
            </p>
            <h2
              className="text-3xl lg:text-4xl font-medium"
              style={{ color: "var(--heading)" }}
            >
              How We Make Each Piece
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PROCESS_STEPS.map((step, i) => (
              <div key={i} className="text-center">
                <div
                  className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "var(--bg)" }}
                >
                  <step.icon
                    className="w-6 h-6"
                    style={{ color: "var(--accent)" }}
                  />
                </div>
                <h3
                  className="text-lg font-medium mb-3"
                  style={{ color: "var(--heading)" }}
                >
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--body)" }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workshop */}
      <section className="py-20 lg:py-28 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="lg:order-2">
            {/* Image placeholder */}
            <div
              className="aspect-[4/5] rounded-xl overflow-hidden"
              style={{ backgroundColor: "var(--sand)" }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <Image
                  src="https://platform-outputs.agnes-ai.space/images/t2i/2b232520869d4e2f812230e46026f0e0.png"
                  alt="The Sonoma workshop interior"
                  width={600}
                  height={750}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          <div className="lg:order-1">
            <p
              className="text-sm uppercase tracking-[0.2em] mb-4 font-medium"
              style={{ color: "var(--accent)" }}
            >
              The Space
            </p>
            <h2
              className="text-3xl lg:text-4xl font-medium mb-6"
              style={{ color: "var(--heading)" }}
            >
              The Sonoma Workshop
            </h2>
            <div className="space-y-4" style={{ color: "var(--body)" }}>
              <p>
                Our workshop occupies a converted fruit-packing warehouse a mile
                from the Sonoma Plaza. The space is bathed in natural light from
                clerestory windows, with massive timber trusses overhead and
                concrete floors worn smooth by decades of use.
              </p>
              <p>
                On any given day, you'll find brass being cast at the forge,
                wood being turned on the lathe, shades being blown in the glass
                studio, and finished fixtures being wired and tested at the
                assembly benches. The air smells faintly of beeswax, machine
                oil, and sawdust.
              </p>
              <p>
                We keep the workshop open to visitors by appointment. If you're
                in Sonoma, come see how your light is made. There's always a pot
                of coffee on.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm font-medium hover:underline mt-2"
                style={{ color: "var(--accent)" }}
              >
                Plan a visit
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section
        className="py-20 lg:py-28 px-4"
        style={{ backgroundColor: "var(--sand)" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p
              className="text-sm uppercase tracking-[0.2em] mb-4 font-medium"
              style={{ color: "var(--accent)" }}
            >
              Our Values
            </p>
            <h2
              className="text-3xl lg:text-4xl font-medium"
              style={{ color: "var(--heading)" }}
            >
              What We Believe
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VALUES.map((value, i) => (
              <div key={i} className="text-center">
                <div
                  className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "var(--bg)" }}
                >
                  <value.icon
                    className="w-6 h-6"
                    style={{ color: "var(--accent)" }}
                  />
                </div>
                <h3
                  className="text-lg font-medium mb-3"
                  style={{ color: "var(--heading)" }}
                >
                  {value.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--body)" }}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section
        className="py-20 lg:py-24 px-4"
        style={{ backgroundColor: "var(--dark)" }}
      >
        <div className="max-w-xl mx-auto text-center">
          <h2
            className="text-2xl lg:text-3xl font-medium mb-4 text-white"
          >
            Join the List
          </h2>
          <p className="mb-8" style={{ color: "var(--sand)" }}>
            New designs, workshop stories, and early access to limited releases.
            Sent once a month, never spam.
          </p>
          <form
            className="flex gap-3 max-w-md mx-auto"
            action="/api/newsletter"
            method="POST"
          >
            <input
              type="email"
              name="email"
              placeholder="Your email"
              required
              className="flex-1 px-4 py-3 rounded-md bg-white/10 text-white placeholder-white/50 border border-white/20 text-sm"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-md text-sm font-medium transition-colors hover:opacity-90"
              style={{ backgroundColor: "var(--accent)", color: "white" }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
