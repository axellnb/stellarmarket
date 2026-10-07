export default function AvailDot({ on }: { on: boolean }) {
  return (
    <span className="relative inline-flex h-2.5 w-2.5">
      {on && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8CC63E] opacity-75" />}
      <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${on ? 'bg-[#8CC63E]' : 'bg-[#6F3432]'}`} />
    </span>
  );
}
