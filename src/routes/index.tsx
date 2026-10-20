import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { categories, categoryLabel, priceLabel, products, STORE, type CategoryId } from "@/data/catalog";
import { ProductPhoto } from "@/components/site-chrome";

const CATS = categories.map((item) => item.id);

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => {
    const raw = search.cat;
    const cat =
      raw !== "todos" && CATS.includes(raw as CategoryId) ? (raw as Exclude<CategoryId, "todos">) : undefined;
    const q = typeof search.q === "string" && search.q.length > 0 ? search.q.slice(0, 60) : undefined;
    return { cat, q };
  },
  component: Home,
});

function Home() {
  const search = Route.useSearch();
  const cat: CategoryId = search.cat ?? "todos";
  const q = search.q ?? "";
  const navigate = Route.useNavigate();
  const [draft, setDraft] = useState(q);
  useEffect(() => {
    setDraft(q);
  }, [q]);
  const query = q.trim().toLowerCase();
  const visible = products.filter((product) => {
    const inCat = cat === "todos" || product.category === cat;
    const inQuery =
      query.length === 0 ||
      product.name.toLowerCase().includes(query) ||
      categoryLabel(product.category).toLowerCase().includes(query);
    return inCat && inQuery;
  });

  return (
    <main>
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            Ofertas en productos seleccionados
          </p>
          <h1 className="mt-3 font-display text-4xl leading-none tracking-wide text-ink sm:text-6xl">
            BUTACAS, ESCRITORIOS Y COMEDORES
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
            Coraza House arma el catálogo con lo que está en el local de Villa El Salvador: sillas
            tipo concha, el tocador vintage y juegos de mesa con sillas. Los precios del volante
            están tal cual.
          </p>
          <dl className="mt-6 grid grid-cols-3 gap-2 sm:max-w-lg">
            <Offer label="Butaca" value="S/ 350" />
            <Offer label="Escritorio" value="S/ 650" />
            <Offer label="Con silla" value="S/ 730" />
          </dl>
        </div>
        <ProductPhoto
          src="/products/sirena-showroom.jpg"
          alt="Butacas Sirena beige, fucsia y negra en la tienda"
          className="shadow-lift"
        />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-4 sm:px-6" aria-label="Buscar muebles">
        <form
          className="flex flex-col gap-3 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            void navigate({ search: { cat: cat === "todos" ? undefined : cat, q: draft.trim() || undefined } });
          }}
        >
          <label className="sr-only" htmlFor="q">
            Buscar en el catálogo
          </label>
          <input
            id="q"
            value={draft}
            onChange={(event) => {
              const next = event.target.value;
              setDraft(next);
              void navigate({ search: { cat: cat === "todos" ? undefined : cat, q: next.trim() ? next : undefined } });
            }}
            placeholder="Busca butaca, escritorio, comedor…"
            suppressHydrationWarning
            className="min-h-12 w-full rounded-full border border-frame bg-paper px-5 text-base text-ink placeholder:text-muted"
          />
          <p className="self-center text-sm text-muted tabular-nums sm:shrink-0">
            {visible.length} {visible.length === 1 ? "mueble" : "muebles"}
          </p>
        </form>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {visible.length === 0 ? (
          <div className="rounded-card border border-dashed border-frame bg-paper px-6 py-16 text-center">
            <p className="font-display text-2xl text-ink">Nada con ese nombre</p>
            <p className="mt-2 text-sm text-muted">Prueba otra palabra o mira todo el catálogo.</p>
            <button
              type="button"
              className="mt-5 min-h-11 rounded-full bg-ink px-5 text-sm font-semibold text-cream"
              onClick={() => {
                setDraft("");
                void navigate({ search: { cat: undefined, q: undefined } });
              }}
            >
              Ver todo
            </button>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((product) => (
              <li key={product.slug}>
                <Link
                  to="/producto/$slug"
                  params={{ slug: product.slug }}
                  className="group block"
                >
                  <ProductPhoto src={product.images[0].src} alt={product.images[0].alt} className="transition duration-200 group-hover:shadow-lift" />
                  <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-muted">
                    {categoryLabel(product.category)}
                    {product.referential ? " · foto referencial" : ""}
                  </p>
                  <h2 className="mt-1 font-display text-2xl leading-none tracking-wide text-ink">
                    {product.name}
                  </h2>
                  <p className="mt-2 font-display text-xl tracking-wide text-ink tabular-nums">
                    {priceLabel(product)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-4 rounded-card bg-ink px-6 py-8 text-cream md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold">Dónde estamos</p>
            <h2 className="mt-2 font-display text-3xl tracking-wide sm:text-4xl">
              PARQUE INDUSTRIAL, VILLA EL SALVADOR
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-cream/80">
              {STORE.address}. {STORE.stand}. {STORE.district}. {STORE.shipping}.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <img
              src="/products/flyer-sirena.jpg"
              alt="Volante de la Butaca Sirena a 350 soles"
              className="aspect-portrait w-full rounded-2xl object-cover object-top"
            />
            <img
              src="/products/flyer-escritorio.jpg"
              alt="Volante del escritorio vintage, 650 soles solo y 730 con silla"
              className="aspect-portrait w-full rounded-2xl object-cover object-top"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function Offer({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-gold px-3 py-3">
      <dt className="text-xs font-semibold uppercase tracking-widest text-ink/70">{label}</dt>
      <dd className="font-display text-xl tracking-wide text-ink tabular-nums sm:text-2xl">{value}</dd>
    </div>
  );
}
