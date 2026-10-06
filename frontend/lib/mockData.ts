import { Freelancer } from './types';

export interface ClientProject {
  id: string;
  clientName: string;
  clientAvatar: string;
  companyOrRole: string;
  title: string;
  category: string;
  description: string;
  budgetXLM: number;
  budgetType: 'fixed' | 'hour';
  tags: string[];
  createdAt: string;
  proposalsCount: number;
  status: 'open' | 'in_progress' | 'closed';
}

export const MOCK_FREELANCERS: Freelancer[] = [
  {
    id: 'f1',
    name: 'Ana Belén Cruz',
    profession: 'Redactora SEO & Copywriter',
    category: 'Escritura',
    description: 'Escribo artículos, e-books y landing pages de alto impacto optimizados para conversión y SEO. Bilingüe (Español / Inglés).',
    tags: ['SEO', 'Copywriting'],
    priceXLM: 35,
    priceType: 'fixed',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    available: true,
    portfolioUrl: 'https://www.behance.net/search/projects?search=copywriting',
    stellarWallet: 'GBCHYJIRS56RK22OJ73KGRRSMULJGC7O6GNIZZIJ2MB2PXR4F3ZQ3FQM',
    rating: 5.0,
    reviewCount: 14,
    reviews: [
      { id: 'r1', client: 'Carlos M.', rating: 5, comment: 'Excelente trabajo redactando nuestra landing. Entregó antes del tiempo esperado.', date: '2026-09-28' },
      { id: 'r2', client: 'Sofía R.', rating: 5, comment: 'Impecable nivel de ortografía y tono de marca exacto.', date: '2026-09-15' }
    ]
  },
  {
    id: 'f2',
    name: 'Lucía Ferrán',
    profession: 'Diseñadora de Marca & UI/UX',
    category: 'Diseño',
    description: 'Especialista en identidades visuales para startups de Web3 y tecnología. Creación de logos, sistemas de diseño y prototipos en Figma.',
    tags: ['Logos', 'Branding', 'UI/UX'],
    priceXLM: 50,
    priceType: 'fixed',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    available: true,
    portfolioUrl: 'https://www.behance.net/search/projects?search=branding',
    stellarWallet: 'GAN6NSNMDK2IUZJK7IRVRYPLRVFOMNZN5UZREZA53NOLHTOXX73C3G4L',
    rating: 4.9,
    reviewCount: 22,
    reviews: [
      { id: 'r3', client: 'Daniel P.', rating: 5, comment: 'Su diseño superó con creces lo que teníamos en mente. Muy creativa.', date: '2026-10-01' }
    ]
  },
  {
    id: 'f3',
    name: 'Diego Montoya',
    profession: 'Editor de Video & Motion Designer',
    category: 'Video',
    description: 'Edición profesional de videos para YouTube, TikTok, Reels y spots publicitarios. Corrección de color y animación 2D en After Effects.',
    tags: ['Edición de video', 'Motion graphics'],
    priceXLM: 85,
    priceType: 'fixed',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    available: true,
    portfolioUrl: 'https://www.behance.net/search/projects?search=motion%20graphics',
    stellarWallet: 'GADVHXBDM3G2ELMUPGX5UNFDYX6AQVMCFDL3E3KYIDUZUIWFCZIZUFA3',
    rating: 4.8,
    reviewCount: 19,
    reviews: [
      { id: 'r4', client: 'María J.', rating: 5, comment: 'Ritmo y efectos increíbles en nuestros anuncios en video.', date: '2026-09-20' }
    ]
  },
  {
    id: 'f4',
    name: 'Valeria Soto',
    profession: 'Desarrolladora Full Stack Next.js',
    category: 'Desarrollo',
    description: 'Construyo aplicaciones web modernas con React, Next.js 14, Node.js y TailwindCSS. Rápida, eficiente y con código limpio.',
    tags: ['Web', 'Apps'],
    priceXLM: 15,
    priceType: 'hour',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    available: true,
    portfolioUrl: 'https://github.com/stellar',
    stellarWallet: 'GCPBLDV33QKWI52COZ4CQHEJ4QFHALDON7QB65KSXQLBMVURCS2QZ6RB',
    rating: 5.0,
    reviewCount: 31,
    reviews: [
      { id: 'r5', client: 'Andrés T.', rating: 5, comment: 'Solucionó en horas un bug crítico de nuestro frontend.', date: '2026-10-02' }
    ]
  },
  {
    id: 'f5',
    name: 'Mateo Rivas',
    profession: 'Especialista en Meta & Google Ads',
    category: 'Marketing',
    description: 'Estratega de adquisición de clientes con anuncios pagados en Meta, Google y TikTok. Optimización diaria con retorno ROAS garantizado.',
    tags: ['Publicidad', 'Redes sociales', 'SEO'],
    priceXLM: 65,
    priceType: 'fixed',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    available: true,
    portfolioUrl: 'https://www.behance.net/search/projects?search=digital%20marketing',
    stellarWallet: 'GDR2MWZGWGV6E6CVV6ZJ3YLNDF4FTL6SXIHBBEWU2R6NBHE7DTVA26FY',
    rating: 4.7,
    reviewCount: 16,
    reviews: [
      { id: 'r6', client: 'Laura V.', rating: 5, comment: 'Nuestras ventas subieron un 40% durante la primera campaña.', date: '2026-09-11' }
    ]
  },
  {
    id: 'f6',
    name: 'Julián Pardo',
    profession: 'Desarrollador Blockchain & Soroban',
    category: 'Desarrollo',
    description: 'Arquitecto de smart contracts Soroban en Rust e integraciones con wallets Stellar (Freighter, Albedo, WalletConnect).',
    tags: ['Blockchain', 'Apps', 'Web'],
    priceXLM: 25,
    priceType: 'hour',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    available: true,
    portfolioUrl: 'https://github.com/stellar',
    stellarWallet: 'GCW2VVZQKHYOWU7JGOW53AIRNRRZAEIHH54RBUY7NPKIFLD2IR5QLEAI',
    rating: 5.0,
    reviewCount: 27,
    reviews: [
      { id: 'r7', client: 'Fintech Sol', rating: 5, comment: 'Dominio absoluto de la red Stellar y Soroban. Un verdadero senior.', date: '2026-09-30' }
    ]
  },
  {
    id: 'f7',
    name: 'Sebastián Mora',
    profession: 'Ilustrador Digital & Diseñador 3D',
    category: 'Diseño',
    description: 'Ilustración editorial, diseño de personajes 2D/3D y assets gráficos vectoriales para productos digitales y marcas.',
    tags: ['Ilustración', 'Logos'],
    priceXLM: 40,
    priceType: 'fixed',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
    available: true,
    portfolioUrl: 'https://www.behance.net/search/projects?search=illustration',
    stellarWallet: 'GCAQZVO7O3HER5TG7HDK7CSCNT5IITQYYFQHPKP63PIMHUHECCCUJ5OH',
    rating: 4.9,
    reviewCount: 15,
    reviews: [
      { id: 'r8', client: 'Valentina C.', rating: 5, comment: 'Ilustraciones únicas y con un estilo muy fresco.', date: '2026-09-25' }
    ]
  },
  {
    id: 'f8',
    name: 'Camila Herrera',
    profession: 'Diseñadora UI/UX & Prototipado',
    category: 'Diseño',
    description: 'Investigación de usuarios, wireframing y diseño de interfaces móviles/desktop accesibles en Figma listas para código.',
    tags: ['UI/UX', 'Web'],
    priceXLM: 18,
    priceType: 'hour',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    available: true,
    portfolioUrl: 'https://www.behance.net/search/projects?search=ui%20ux',
    stellarWallet: 'GDNCFD36AUL5QNQAIE3MRVHTBXM3QHRNX4DYKH3AWK67OPXIA2HN2NGD',
    rating: 4.8,
    reviewCount: 18,
    reviews: []
  }
];

export const MOCK_PROJECTS: ClientProject[] = [
  {
    id: 'p1',
    clientName: 'Roberto Gómez',
    clientAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    companyOrRole: 'Fundador de Cafés del Sol',
    title: 'Busco rediseño completo de marca e identidad de empaques',
    category: 'Diseño',
    description: 'Necesitamos renovar la imagen de nuestra marca de café artesanal. Buscamos un diseñador con experiencia en empaques, paleta de colores y logo vectorial listo para impresión.',
    budgetXLM: 120,
    budgetType: 'fixed',
    tags: ['Branding', 'Logos'],
    createdAt: 'Hace 2 horas',
    proposalsCount: 5,
    status: 'open'
  },
  {
    id: 'p2',
    clientName: 'Elena Rostova',
    clientAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    companyOrRole: 'Product Manager en PayStellar',
    title: 'Desarrollador Next.js para integrar widget de pago Freighter',
    category: 'Desarrollo',
    description: 'Buscamos un dev frontend para integrar la librería @stellar/freighter-api en una aplicación Next.js App Router ya existente.',
    budgetXLM: 25,
    budgetType: 'hour',
    tags: ['Web', 'Blockchain'],
    createdAt: 'Hace 5 horas',
    proposalsCount: 8,
    status: 'open'
  },
  {
    id: 'p3',
    clientName: 'Carlos Mendizábal',
    clientAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
    companyOrRole: 'Director de Marketing en Nubix Agency',
    title: 'Editor de video para 10 Reels de Instagram y TikTok',
    category: 'Video',
    description: 'Buscamos editor creativo para transformar grabaciones en crudo de 1 a 2 minutos en 10 Reels dinámicos con subtítulos animados y transiciones rápidas.',
    budgetXLM: 150,
    budgetType: 'fixed',
    tags: ['Edición de video', 'Redes sociales'],
    createdAt: 'Hace 1 día',
    proposalsCount: 12,
    status: 'open'
  },
  {
    id: 'p4',
    clientName: 'Mariana Silva',
    clientAvatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=80',
    companyOrRole: 'E-commerce Specialist',
    title: 'Redactor SEO para 8 artículos de blog sobre finanzas personales',
    category: 'Escritura',
    description: 'Requerimos un copywriter enfocado en artículos de 1200 palabras bien investigados sobre educación financiera y criptoactivos en español neutro.',
    budgetXLM: 80,
    budgetType: 'fixed',
    tags: ['SEO', 'Copywriting'],
    createdAt: 'Hace 2 días',
    proposalsCount: 4,
    status: 'open'
  },
  {
    id: 'p5',
    clientName: 'Gabriel Fernández',
    clientAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    companyOrRole: 'CMO en AppLink LATAM',
    title: 'Trafficker Digital para campaña de lanzamiento en Google & Meta Ads',
    category: 'Marketing',
    description: 'Buscamos profesional en compra de medios para lanzar y optimizar campañas de prueba A/B dirigidas a México, Colombia y Argentina durante 3 semanas.',
    budgetXLM: 20,
    budgetType: 'hour',
    tags: ['Publicidad', 'Redes sociales'],
    createdAt: 'Hace 3 días',
    proposalsCount: 7,
    status: 'open'
  }
];
