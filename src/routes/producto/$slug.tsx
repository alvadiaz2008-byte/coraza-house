import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { categoryLabel, familyOf, getProduct, priceLabel, relatedTo } from "@/data/catalog";
import { useCart } from "@/lib/cart";
import { ProductPhoto } from "@/components/site-chrome";

export const Route = createFileRoute("/producto/$slug")({
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const product = getProduct(slug);
  if (!product) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-4xl tracking-wide">ESE MUEBLE NO ESTÁ</h1>
        <p className="mt-3 text-muted">Puede que el enlace esté viejo. El catálogo sí está al día.</p>
        <Link
          to="/"
          search={{ cat: undefined, q: undefined }}
          className="mt-6 inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-sm font-semibold text-cream"
        >
          Volver al catálogo
        </Link>
      </main>
    );
  }

  return <ProductDetail key={product.slug} slug={product.slug} />;
}

function ProductDetail({ slug }: { slug: string }) {
  const product = getProduct(slug)!;
  const [photo, setPhoto] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const add = useCart((s) => s.add);
  const siblings = familyOf(product);
  const related = relatedTo(product);
  const shot = product.images[photo] ?? product.images[0];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Link
        to="/"
        search={{ cat: product.category, q: undefined }}
        className="text-sm font-semibold text-muted hover:text-ink"
      >
        ← {categoryLabel(product.category)}
      </Link>
      <div className="mt-4 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div>
          <ProductPhoto src={shot.src} alt={shot.alt} />
          {product.images.length > 1 ? (
            <ul className="mt-3 flex gap-2">
              {product.images.map((image, index) => (
                <li key={image.src}>
                  <button
                    type="button"
                    onClick={() => setPhoto(index)}
                    className={
                      "size-16 overflow-hidden rounded-xl border-2 " +
                      (index === photo ? "border-ink" : "border-transparent")
                    }
                    aria-label={`Ver foto ${index + 1}`}
                  >
                    <img src={image.src} alt="" className="size-full object-cover" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            {categoryLabel(product.category)}
          </p>
          <h1 className="mt-2 font-display text-4xl leading-none tracking-wide sm:text-5xl">{product.name}</h1>
          <p className="mt-4 font-display text-3xl tracking-wide tabular-nums">{priceLabel(product)}</p>
          <p className="mt-4 text-base leading-relaxed text-muted">{product.summary}</p>
          {product.referential ? (
            <p className="mt-3 rounded-2xl bg-gold px-4 py-3 text-sm font-medium text-ink">
              Foto referencial del estilo. Confirma modelo, tela y precio en la tienda antes de separar.
            </p>
          ) : null}
          <ul className="mt-5 space-y-2 text-sm leading-relaxed">
            {product.points.map((point) => (
              <li key={point} className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-ink" aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          {siblings.length > 0 ? (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">También en</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                <li>
                  <span className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ink bg-ink px-3 text-sm font-semibold text-cream">
                    <Swatch color={product.swatch} />
                    Esta
                  </span>
                </li>
                {siblings.map((item) => (
                  <li key={item.slug}>
                    <Link
                      to="/producto/$slug"
                      params={{ slug: item.slug }}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-frame bg-paper px-3 text-sm font-semibold"
                    >
                      <Swatch color={item.swatch} />
                      {item.name.replace("Butaca Sirena ", "").replace("Escritorio Vintage con espejo", "Solo").replace("Pack escritorio y silla", "Con silla")}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-frame bg-paper">
              <button
                type="button"
                className="min-h-12 min-w-12 text-lg font-semibold"
                onClick={() => setQty((n) => Math.max(1, n - 1))}
                aria-label="Menos"
              >
                −
              </button>
              <span className="min-w-8 text-center font-semibold tabular-nums">{qty}</span>
              <button
                type="button"
                className="min-h-12 min-w-12 text-lg font-semibold"
                onClick={() => setQty((n) => Math.min(20, n + 1))}
                aria-label="Más"
              >
                +
              </button>
            </div>
            <button
              type="button"
              className="min-h-12 flex-1 rounded-full bg-ink px-6 text-sm font-semibold text-cream sm:flex-none"
              onClick={() => {
                add(product.slug, qty);
                setAdded(true);
              }}
            >
              {added ? "Sumado al pedido" : "Agregar al pedido"}
            </button>
            <Link to="/pedido" className="min-h-12 inline-flex items-center text-sm font-semibold underline">
              Ver pedido
            </Link>
          </div>
        </div>
      </div>
      {related.length > 0 ? (
        <section className="mt-14">
          <h2 className="font-display text-2xl tracking-wide">EN LA MISMA LÍNEA</h2>
          <ul className="mt-5 grid gap-6 sm:grid-cols-3">
            {related.map((item) => (
              <li key={item.slug}>
                <Link to="/producto/$slug" params={{ slug: item.slug }} className="group block">
                  <ProductPhoto src={item.images[0].src} alt={item.images[0].alt} />
                  <h3 className="mt-3 font-display text-xl leading-none tracking-wide">{item.name}</h3>
                  <p className="mt-1 text-sm tabular-nums">{priceLabel(item)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}

function Swatch({ color }: { color: string }) {
  return <span className="size-3 rounded-full border border-ink/20" style={{ background: color }} aria-hidden="true" />;
}
