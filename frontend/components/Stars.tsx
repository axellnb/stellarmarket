export default function Stars({ value, size = 'text-base' }: { value: number; size?: string }) {
  return (
    <span className={`${size} tracking-tight`} aria-label={`${value} de 5`}>
      {[1, 2, 3, 4, 5].map(i => <span key={i} className={i <= Math.round(value) ? 'text-amber-400' : 'text-line'}>★</span>)}
    </span>
  );
}
