export default function AvailDot({ on }: { on: boolean }) {
  return (
    <span className="relative inline-flex h-2.5 w-2.5">
      {on && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />}
      <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${on ? 'animate-pulse bg-brand' : 'bg-muted'}`} />
    </span>
  );
}
