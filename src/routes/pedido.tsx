import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { formatSoles, getProduct, priceLabel, STORE } from "@/data/catalog";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/pedido")({
  component: PedidoPage,
});

function orderText() {
  const { lines, buyer } = useCart.getState();
  const rows = lines
    .map((line) => {
      const product = getProduct(line.slug);
      if (!product) return null;
      return `• ${line.qty} × ${product.name} — ${priceLabel(product)}`;
    })
    .filter(Boolean);
  const total = lines.reduce((sum, line) => {
    const product = getProduct(line.slug);
    return sum + (product?.price ?? 0) * line.qty;
  }, 0);
  const consult = lines.some((line) => getProduct(line.slug)?.price == null);
  return [
    `Hola ${STORE.short}, quiero consultar este pedido:`,
    "",
    ...rows,
    "",
    `Total referencial: ${formatSoles(total)}${consult ? " (hay piezas a consultar que no entran al total)" : ""}`,
    buyer.name ? `Nombre: ${buyer.name}` : "",
    buyer.phone ? `Celular: ${buyer.phone}` : "",
    buyer.district ? `Distrito: ${buyer.district}` : "",
    buyer.note ? `Nota: ${buyer.note}` : "",
  ]
    .filter((line) => line !== "")
    .join("\n");
}

function PedidoPage() {
  const lines = useCart((s) => s.lines);
  const buyer = useCart((s) => s.buyer);
  const hydrated = useCart((s) => s.hydrated);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const setBuyer = useCart((s) => s.setBuyer);
  const [copied, setCopied] = useState(false);

  const detailed = lines
    .map((line) => ({ line, product: getProduct(line.slug) }))
    .filter((row) => row.product);
  const total = detailed.reduce((sum, row) => sum + (row.product!.price ?? 0) * row.line.qty, 0);
  const hasConsult = detailed.some((row) => row.product!.price == null);

  async function copyOrder() {
    const text = orderText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
      window.prompt("Copia el pedido:", text);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted">Tu lista</p>
      <h1 className="mt-2 font-display text-4xl tracking-wide sm:text-5xl">PEDIDO</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Arma la lista y cópiala para pegarla en Instagram o TikTok. No hay cobro en la web: el local
        confirma stock y entrega.
      </p>

      {!hydrated ? (
        <p className="mt-10 text-sm text-muted">Cargando tu pedido…</p>
      ) : detailed.length === 0 ? (
        <div className="mt-10 rounded-card border border-dashed border-frame bg-paper px-6 py-14 text-center">
          <p className="font-display text-2xl">TODAVÍA VACÍO</p>
          <p className="mt-2 text-sm text-muted">Empieza por una butaca o por el escritorio vintage.</p>
          <Link
            to="/"
            search={{ cat: undefined, q: undefined }}
            className="mt-5 inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-sm font-semibold text-cream"
          >
            Ver catálogo
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          <ul className="divide-y divide-line border-y border-line">
            {detailed.map(({ line, product }) => (
              <li key={line.slug} className="flex gap-4 py-4">
                <img
                  src={product!.images[0].src}
                  alt=""
                  className="size-20 rounded-xl border border-frame object-cover sm:size-24"
                />
                <div className="min-w-0 flex-1">
                  <Link
                    to="/producto/$slug"
                    params={{ slug: product!.slug }}
                    className="font-display text-lg leading-tight tracking-wide"
                  >
                    {product!.name}
                  </Link>
                  <p className="mt-1 text-sm tabular-nums text-muted">{priceLabel(product!)}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      className="min-h-11 min-w-11 rounded-full border border-frame bg-paper text-lg"
                      onClick={() => setQty(line.slug, line.qty - 1)}
                      aria-label={`Quitar una ${product!.name}`}
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-semibold tabular-nums">{line.qty}</span>
                    <button
                      type="button"
                      className="min-h-11 min-w-11 rounded-full border border-frame bg-paper text-lg"
                      onClick={() => setQty(line.slug, line.qty + 1)}
                      aria-label={`Sumar una ${product!.name}`}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="ml-auto text-sm font-semibold text-muted underline"
                      onClick={() => remove(line.slug)}
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">Total referencial</p>
              <p className="font-display text-4xl tracking-wide tabular-nums">{formatSoles(total)}</p>
              {hasConsult ? (
                <p className="mt-1 text-xs text-muted">Las piezas a consultar no suman hasta confirmar precio.</p>
              ) : null}
            </div>
            <button type="button" className="text-sm font-semibold underline" onClick={clear}>
              Vaciar
            </button>
          </div>

          <form
            className="grid gap-3 sm:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              void copyOrder();
            }}
          >
            <Field label="Nombre" value={buyer.name} onChange={(name) => setBuyer({ name })} />
            <Field label="Celular" value={buyer.phone} onChange={(phone) => setBuyer({ phone })} />
            <Field
              label="Distrito de entrega"
              value={buyer.district}
              onChange={(district) => setBuyer({ district })}
              className="sm:col-span-2"
            />
            <label className="sm:col-span-2 block text-sm font-semibold">
              Nota
              <textarea
                value={buyer.note}
                onChange={(event) => setBuyer({ note: event.target.value.slice(0, 280) })}
                rows={3}
                className="mt-1 w-full rounded-2xl border border-frame bg-paper px-4 py-3 text-base font-normal"
                placeholder="Color, piso, horario…"
              />
            </label>
            <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
              <button
                type="submit"
                className="min-h-12 flex-1 rounded-full bg-gold px-5 text-sm font-semibold text-ink"
              >
                {copied ? "Pedido copiado" : "Copiar pedido"}
              </button>
              <a
                href={STORE.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-cream"
              >
                Abrir Instagram
              </a>
              <a
                href={STORE.tiktok}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full border border-ink px-5 text-sm font-semibold"
              >
                Abrir TikTok
              </a>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <label className={`block text-sm font-semibold ${className}`}>
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value.slice(0, 80))}
        className="mt-1 min-h-12 w-full rounded-full border border-frame bg-paper px-4 text-base font-normal"
      />
    </label>
  );
}
