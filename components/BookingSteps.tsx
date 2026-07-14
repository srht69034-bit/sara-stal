import AnimatedReveal from "@/components/AnimatedReveal";
import type { ContentMap } from "@/lib/content";

export default function BookingSteps({ content }: { content: ContentMap }) {
  const steps = [
    { title: content.steps_1_title, body: content.steps_1_body },
    { title: content.steps_2_title, body: content.steps_2_body },
    { title: content.steps_3_title, body: content.steps_3_body },
    { title: content.steps_4_title, body: content.steps_4_body },
  ];

  return (
    <section className="mx-auto max-w-editorial px-8 md:px-10 py-24">
      <AnimatedReveal>
        <p className="eyebrow text-center mb-16">{content.steps_title}</p>
      </AnimatedReveal>

      <div className="relative grid sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-14">
        {/* קו מחבר עדין בין השלבים - רק בדסקטופ */}
        <div className="hidden md:block absolute top-5 left-[12.5%] right-[12.5%] h-px bg-mist" />

        {steps.map((s, i) => (
          <AnimatedReveal key={i} delay={i * 0.12} direction={i % 2 === 0 ? "up" : "scale"}>
            <div className="relative flex flex-col items-center text-center">
              <div className="relative z-10 w-10 h-10 rounded-full border border-olive bg-bone flex items-center justify-center font-display text-sm">
                {i + 1}
              </div>
              <h3 className="font-display text-lg mt-5 mb-2">{s.title}</h3>
              <p className="text-sm text-stone leading-relaxed max-w-[220px]">{s.body}</p>
            </div>
          </AnimatedReveal>
        ))}
      </div>
    </section>
  );
}
