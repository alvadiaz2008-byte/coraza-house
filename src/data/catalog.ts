export const STORE = {
  name: "Coraza House SAC",
  short: "Coraza House",
  ruc: "20608147382",
  tiktok: "https://www.tiktok.com/@coraza.house.sac",
  instagram: "https://www.instagram.com/corazahouse/",
  address: "Galería Apemives, Av. Solidaridad Mz. F Lt. 12",
  stand: "Puerta 0 · Stand 8 y 5",
  district: "Parque Industrial, Villa El Salvador, Lima",
  shipping: "Envíos a Lima y provincias",
} as const;

export const categories = [
  { id: "todos", label: "Todo" },
  { id: "sillas", label: "Sillas" },
  { id: "escritorios", label: "Escritorios" },
  { id: "juegos", label: "Juegos de mesa" },
  { id: "packs", label: "Packs" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

export type Product = {
  slug: string;
  name: string;
  category: Exclude<CategoryId, "todos">;
  price: number | null;
  summary: string;
  points: string[];
  images: { src: string; alt: string }[];
  swatch: string;
  family?: string;
  referential?: boolean;
};

export const products: Product[] = [
  {
    slug: "butaca-sirena-fucsia",
    name: "Butaca Sirena Fucsia",
    category: "sillas",
    price: 350,
    family: "sirena",
    swatch: "#ff2f86",
    summary:
      "Butaca tapizada en forma de concha, con cojín y base giratoria. El fucsia es el color más pedido del mostrador.",
    points: [
      "Respaldo de pétalos tipo concha, en tela aterciopelada",
      "Cojín suelto a juego",
      "Base estrella con ruedas y pistón giratorio",
      "Misma butaca en otros colores, siempre a S/ 350",
    ],
    images: [
      { src: "/products/sirena-rosa-negra.jpg", alt: "Butaca Sirena fucsia junto a la negra" },
      { src: "/products/sirena-fucsia.jpg", alt: "Detalle de la butaca Sirena fucsia" },
      { src: "/products/sirena-showroom.jpg", alt: "Mostrador con butacas Sirena beige, fucsia y negra" },
    ],
  },
  {
    slug: "butaca-sirena-negra",
    name: "Butaca Sirena Negra",
    category: "sillas",
    price: 350,
    family: "sirena",
    swatch: "#1a1a1a",
    summary:
      "La misma butaca concha, en negro. Sirve para tocador, escritorio o un rincón de maquillaje.",
    points: [
      "Tapiz negro con cojín incluido",
      "Gira y se regula con la base de ruedas",
      "Se ve en tienda junto al escritorio vintage",
      "Precio de oferta: S/ 350",
    ],
    images: [
      { src: "/products/sirena-negra.jpg", alt: "Butaca Sirena negra con cojín" },
      { src: "/products/sirena-rosa-negra.jpg", alt: "Butacas Sirena fucsia y negra juntas" },
      { src: "/products/sirena-showroom.jpg", alt: "Butaca negra al fondo del mostrador" },
    ],
  },
  {
    slug: "butaca-sirena-beige",
    name: "Butaca Sirena Beige",
    category: "sillas",
    price: 350,
    family: "sirena",
    swatch: "#c6ae86",
    summary:
      "Versión arena de la butaca concha. El tono cálido combina con madera clara y melamina blanca.",
    points: [
      "Tela beige, respaldo de pétalos",
      "Cojín del mismo tono",
      "Base cromada con ruedas, según stock",
      "Oferta de productos seleccionados: S/ 350",
    ],
    images: [
      { src: "/products/sirena-beige.jpg", alt: "Butaca Sirena beige junto a la fucsia" },
      { src: "/products/sirena-showroom.jpg", alt: "Tres butacas Sirena en el local" },
    ],
  },
  {
    slug: "butaca-sirena-crema",
    name: "Butaca Sirena Crema",
    category: "sillas",
    price: 350,
    family: "sirena",
    swatch: "#efe6d6",
    summary:
      "Butaca concha en crema, la más clara de la línea. El cojín va anudado al centro del asiento.",
    points: [
      "Tapiz crema, casi marfil",
      "Cojín tipo lazo incluido",
      "Base estrella giratoria con ruedas",
      "S/ 350, igual que el resto de la línea Sirena",
    ],
    images: [
      { src: "/products/sirena-crema.jpg", alt: "Butaca Sirena crema con cojín anudado" },
      { src: "/products/sirena-showroom.jpg", alt: "Butacas de la línea Sirena en tienda" },
    ],
  },
  {
    slug: "butaca-sirena-rosa",
    name: "Butaca Sirena Rosa",
    category: "sillas",
    price: 350,
    family: "sirena",
    swatch: "#f3b6c4",
    summary:
      "Rosa pálido, con columna dorada. En tienda suele estar protegida con plástico hasta la entrega.",
    points: [
      "Tapiz rosa claro",
      "Columna y base con acabado dorado",
      "Ruedas negras y giro de 360°",
      "Oferta: S/ 350",
    ],
    images: [
      { src: "/products/sirena-rosa-envuelta.jpg", alt: "Butaca Sirena rosa con base dorada" },
      { src: "/products/sirena-showroom.jpg", alt: "Línea de butacas Sirena en el local" },
    ],
  },
  {
    slug: "escritorio-vintage",
    name: "Escritorio Vintage con espejo",
    category: "escritorios",
    price: 650,
    family: "vintage",
    swatch: "#f4f1ea",
    summary:
      "Tocador blanco con espejo, repisas y cajonera. El precio de S/ 650 es el escritorio solo, sin silla.",
    points: [
      "Cubierta con cajón y bandeja de compartimentos",
      "Espejo abatible a la derecha",
      "Torre de repisas y cajonera de tres cajones",
      "Patas de madera",
      "Si lo quieres con silla, mira el pack a S/ 730",
    ],
    images: [
      { src: "/products/escritorio-solo.jpg", alt: "Escritorio vintage blanco con espejo, sin silla" },
      { src: "/products/escritorio-pack.jpg", alt: "El mismo escritorio acompañado de la silla del pack" },
    ],
  },
  {
    slug: "pack-escritorio-silla",
    name: "Pack escritorio y silla",
    category: "packs",
    price: 730,
    family: "vintage",
    swatch: "#d7c4a8",
    summary:
      "El escritorio vintage con espejo más la silla tapizada de patas de madera. Salen juntos a S/ 730.",
    points: [
      "Incluye el escritorio vintage completo",
      "Silla clara con patas de madera",
      "Ahorras frente a comprarlos por separado en otro lado",
      "Precio de la oferta: S/ 730",
    ],
    images: [
      { src: "/products/escritorio-pack.jpg", alt: "Escritorio vintage con la silla del pack" },
      { src: "/products/escritorio-solo.jpg", alt: "Detalle del escritorio sin la silla" },
    ],
  },
  {
    slug: "juego-comedor-4",
    name: "Juego de comedor 4 sillas",
    category: "juegos",
    price: null,
    swatch: "#e7d3b0",
    referential: true,
    summary:
      "Mesa rectangular de madera clara con cuatro sillas tapizadas en crema. El modelo y el precio se confirman en tienda.",
    points: [
      "Mesa para cuatro puestos",
      "Sillas con asiento y respaldo tapizados",
      "Patas de madera",
      "Foto referencial del estilo. Confirma tela y medida antes de separar",
    ],
    images: [
      { src: "/products/comedor-4.jpg", alt: "Juego de comedor de madera clara con cuatro sillas crema" },
    ],
  },
  {
    slug: "juego-comedor-6",
    name: "Juego de comedor 6 sillas",
    category: "juegos",
    price: null,
    swatch: "#2a211c",
    referential: true,
    summary:
      "Comedor de seis puestos: mesa de madera oscura y sillas negras tapizadas. Precio a consultar según stock.",
    points: [
      "Mesa rectangular para seis",
      "Sillas negras con patas de madera",
      "Pensado para comedor familiar",
      "Foto referencial. El acabado se elige en el local",
    ],
    images: [
      { src: "/products/comedor-6.jpg", alt: "Juego de comedor para seis con sillas negras" },
    ],
  },
];

export function categoryLabel(id: Product["category"] | "todos") {
  return categories.find((c) => c.id === id)?.label ?? id;
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function familyOf(product: Product) {
  if (!product.family) return [];
  return products.filter((p) => p.family === product.family && p.slug !== product.slug);
}

export function relatedTo(product: Product) {
  return products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 3);
}

export function formatSoles(value: number) {
  return `S/ ${new Intl.NumberFormat("es-PE").format(value)}`;
}

export function priceLabel(product: Product) {
  return product.price == null ? "A consultar" : formatSoles(product.price);
}
