// ── CATEGORÍAS ────────────────────────────────────────────────────────────
export const CATS = [
  { id:'academico',   icon:'📚', name:'Académico',           range:[10000,50000],  color:'#007AFF', bg:'rgba(0,122,255,0.10)',    ap:true  },
  { id:'diseno',      icon:'🎨', name:'Diseño',               range:[15000,80000],  color:'#BF5AF2', bg:'rgba(191,90,242,0.10)',   ap:true  },
  { id:'tech',        icon:'💻', name:'Tech',                 range:[15000,100000], color:'#34C759', bg:'rgba(52,199,89,0.10)',    ap:false },
  { id:'mandados',    icon:'🏃', name:'Mandados y Trámites',  range:[3000,25000],   color:'#FF9F0A', bg:'rgba(255,159,10,0.10)',   ap:false },
  { id:'habilidades', icon:'🏋️', name:'Habilidades',          range:[10000,50000],  color:'#FF375F', bg:'rgba(255,55,95,0.10)',    ap:false },
  { id:'prestamo',    icon:'📦', name:'Préstamo de objetos',  range:[5000,40000],   color:'#32ADE6', bg:'rgba(50,173,230,0.10)',   ap:false },
];

// ── CATEGORÍAS DE HABILIDADES ─────────────────────────────────────────────
export const SKILL_CATS = [
  { id:'idiomas',   icon:'🌍', name:'Idiomas',     ex:['Inglés','Francés','Mandarín'] },
  { id:'musica',    icon:'🎵', name:'Música',      ex:['Guitarra','Piano','Canto']    },
  { id:'deporte',   icon:'⚽', name:'Deporte',     ex:['Fútbol','Yoga','CrossFit']    },
  { id:'arte',      icon:'🎨', name:'Arte y Foto', ex:['Ilustración','Fotografía']    },
  { id:'cocina',    icon:'🍳', name:'Cocina',      ex:['Repostería','Sushi']          },
  { id:'bienestar', icon:'🧘', name:'Bienestar',   ex:['Meditación','Coaching']       },
];

// ── CARRERAS (todos los pregrados Uniandes + opción posgrado) ─────────────
export const CARRERAS = [
  'Administración de Empresas',
  'Antropología',
  'Arquitectura',
  'Arte',
  'Biología',
  'Ciencia Política',
  'Comunicación Social',
  'Contaduría Pública',
  'Derecho',
  'Diseño Gráfico',
  'Diseño Industrial',
  'Economía',
  'Educación',
  'Filosofía',
  'Física',
  'Geociencias',
  'Historia',
  'Ingeniería Ambiental',
  'Ingeniería Biomédica',
  'Ingeniería Civil',
  'Ingeniería de Sistemas y Computación',
  'Ingeniería Eléctrica y Electrónica',
  'Ingeniería Industrial',
  'Ingeniería Mecánica',
  'Ingeniería Química',
  'Lenguas y Cultura',
  'Literatura',
  'Matemáticas',
  'Medicina',
  'Microbiología',
  'Música',
  'Psicología',
  'Química',
  'Sociología',
  'Posgrado',
];

export const SEMESTRES = ['1°','2°','3°','4°','5°','6°','7°','8°','9°','10°'];

// ── HELPERS ───────────────────────────────────────────────────────────────
export const fmt = n => `$${Number(n).toLocaleString('es-CO')}`;

export const COMISION = 0.10;
