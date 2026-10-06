export interface Review { id: string; client: string; rating: number; comment: string; date: string }
export interface Freelancer {
  id: string; name: string; profession: string; category: string; description: string; tags: string[];
  priceXLM: number; priceType: 'fixed' | 'hour'; avatar: string; available: boolean;
  portfolioUrl: string; stellarWallet: string; reviews: Review[]; ownerEmail?: string;
}
// Direcciones públicas Stellar válidas (checksum correcto) para los perfiles de ejemplo.

const pool: [string, number, string][] = [
  ['Carlos M.', 5, 'Entregó antes de tiempo y superó lo que esperaba. Totalmente recomendado.'],
  ['Sofía R.', 5, 'Comunicación clara en todo momento y un resultado impecable.'],
  ['Daniel P.', 4, 'Muy buen trabajo, solo pedí un par de ajustes menores.'],
  ['María J.', 5, 'Profesional, creativa y muy atenta a los detalles.'],
  ['Andrés T.', 3, 'Buen resultado final, aunque la primera entrega tardó más de lo acordado.'],
  ['Laura V.', 4, 'Cumplió con lo pedido y el pago en XLM fue rapidísimo.'],
  ['Pablo G.', 5, 'Volvería a contratar sin dudarlo. Excelente calidad.'],
  ['Tienda Luna', 2, 'El resultado no era lo que buscábamos, aunque respondió con amabilidad.'],
  ['Café Ámbar', 5, 'Entendió nuestra marca desde el primer borrador.'],
  ['Equipo Nubix', 4, 'Buen nivel técnico y ordenado en la entrega.'],
  ['Valentina C.', 5, 'Increíble experiencia, superó mis expectativas.'],
  ['Fintech Sol', 4, 'Sólido y confiable. Lo recomiendo para proyectos pequeños y medianos.']
];
const mk = (n: number) => Array.from({ length: 5 }, (_, i) => {
  const [client, rating, comment] = pool[(n * 3 + i * 2) % pool.length];
  return { id: `r${n}-${i}`, client, rating, comment, date: `2026-0${9 - (i % 3)}-${10 + i}` };
});
const f = (id: string, name: string, profession: string, category: string, description: string, tags: string[], priceXLM: number, priceType: 'fixed' | 'hour', img: number | string, available: boolean, portfolioUrl: string, wallet: string): Freelancer =>
  ({ id, name, profession, category, description, tags, priceXLM, priceType, avatar: typeof img === 'string' ? img : `https://i.pravatar.cc/200?img=${img}`, available, portfolioUrl, stellarWallet: wallet, reviews: mk(Number(id)) });

export const freelancers: Freelancer[] = [
  f('1', 'Ana Belén Cruz', 'Redactora SEO', 'Escritura', 'Escribo artículos y landing pages que rankean y convierten. Español e inglés.', ['SEO', 'Copywriting'], 30, 'fixed', '/avatars/ana.jpg', false, 'https://www.behance.net', 'GBCHYJIRS56RK22OJ73KGRRSMULJGC7O6GNIZZIJ2MB2PXR4F3ZQ3FQM'),
  f('2', 'Lucía Ferrán', 'Diseñadora de marca', 'Diseño', 'Creo identidades visuales completas: logo, paleta y manual de uso. 7 años trabajando con startups de LATAM.', ['Logos', 'Branding'], 45, 'fixed', '/avatars/lucia.jpg', true, 'https://www.behance.net', 'GAN6NSNMDK2IUZJK7IRVRYPLRVFOMNZN5UZREZA53NOLHTOXX73C3G4L'),
  f('3', 'Diego Montoya', 'Editor de video', 'Video', 'Edición para YouTube, reels y anuncios. Color, motion graphics y sonido.', ['Edición de video', 'Motion graphics'], 80, 'fixed', '/avatars/diego.jpg', true, 'https://drive.google.com', 'GADVHXBDM3G2ELMUPGX5UNFDYX6AQVMCFDL3E3KYIDUZUIWFCZIZUFA3'),
  f('4', 'Valeria Soto', 'Desarrolladora Full Stack', 'Desarrollo', 'Next.js, Node y TypeScript. Construyo MVPs rápidos, limpios y escalables.', ['Web', 'Apps'], 12, 'hour', 44, true, 'https://github.com', 'GCPBLDV33QKWI52COZ4CQHEJ4QFHALDON7QB65KSXQLBMVURCS2QZ6RB'),
  f('5', 'Mateo Rivas', 'Especialista en Marketing', 'Marketing', 'Campañas en Meta y Google Ads con foco en retorno. Reportes claros cada semana.', ['Publicidad', 'Redes sociales', 'SEO'], 60, 'fixed', 15, true, 'https://www.behance.net', 'GDR2MWZGWGV6E6CVV6ZJ3YLNDF4FTL6SXIHBBEWU2R6NBHE7DTVA26FY'),
  f('6', 'Camila Herrera', 'Diseñadora UI/UX', 'Diseño', 'Interfaces web y móviles en Figma, listas para desarrollo. Investigación y prototipos.', ['UI/UX', 'Web'], 15, 'hour', 49, true, 'https://www.behance.net', 'GDNCFD36AUL5QNQAIE3MRVHTBXM3QHRNX4DYKH3AWK67OPXIA2HN2NGD'),
  f('7', 'Julián Pardo', 'Desarrollador Blockchain', 'Desarrollo', 'Integraciones con Stellar, wallets y contratos Soroban para tu producto.', ['Blockchain', 'Apps'], 20, 'hour', '/avatars/julian.jpg', false, 'https://github.com', 'GCW2VVZQKHYOWU7JGOW53AIRNRRZAEIHH54RBUY7NPKIFLD2IR5QLEAI'),
  f('8', 'Renata Quiroz', 'Redactora Creativa', 'Escritura', 'Copy para redes, guiones y newsletters con la voz de tu marca.', ['Copywriting', 'Redes sociales'], 25, 'fixed', 32, true, 'https://drive.google.com', 'GAG42NM3AOGG3CDOTVMGI4SYDLWXS6KAYPLZMB7PTNMQMKTLRJGWXJVI'),
  f('9', 'Sebastián Mora', 'Ilustrador digital', 'Diseño', 'Ilustraciones, personajes y mascotas para marcas con personalidad.', ['Ilustración', 'Logos'], 35, 'fixed', 52, true, 'https://www.behance.net', 'GCAQZVO7O3HER5TG7HDK7CSCNT5IITQYYFQHPKP63PIMHUHECCCUJ5OH'),
  f('10', 'Isabela Núñez', 'Community Manager', 'Marketing', 'Calendario de contenido, gestión de comunidades y reportes mensuales.', ['Redes sociales', 'Publicidad'], 40, 'fixed', 25, true, 'https://drive.google.com', 'GCHGTU5MEGFT4JLCJXHKCTAGHQ7ILT42ATIQ6FQQOSFQOBURX2AKUEYJ')
];
