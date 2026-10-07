export default function Stars({ value, size = 'w-4 h-4' }: { value: number; size?: string }) {
  const rounded = Math.round(value || 0);
  return (
    <div className="inline-flex items-center gap-0.5" aria-label={`${value} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={`${size} ${i <= rounded ? 'text-[#FFD16B] fill-current' : 'text-white/20 fill-current'}`} viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}
