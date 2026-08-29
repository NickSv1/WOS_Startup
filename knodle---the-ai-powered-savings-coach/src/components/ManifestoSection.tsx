export default function ManifestoSection() {
  return (
    <section className="bg-[#000000] py-24 md:py-36 px-4 sm:px-6 text-center border-y border-neutral-800 relative overflow-hidden">
      {/* Background subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#c1ff72]/10 blur-[120px] pointer-events-none" />

      <div className="max-w-[960px] mx-auto relative z-10">
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-[#ffffff] leading-[1.15] tracking-tight">
          Financial freedom shouldn&apos;t be reserved for people who{' '}
          <span className="relative inline-block mt-1 sm:mt-0">
            <span className="relative z-10 text-white">already have money.</span>
            <span className="absolute bottom-1.5 sm:bottom-2 left-0 w-full h-3.5 sm:h-4 bg-[#c1ff72] -z-0 transform -rotate-1 rounded-xs" />
          </span>
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base mt-6 max-w-xl mx-auto font-medium">
          Most apps profit off your confusion. Knodle gives you the unfair advantage of a 24/7 personal financial coach in your pocket.
        </p>
      </div>
    </section>
  );
}
