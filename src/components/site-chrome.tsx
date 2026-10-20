import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { STORE, categories, type CategoryId } from "@/data/catalog";
import { useCart, useCartCount } from "@/lib/cart";

function useActiveCategory(): CategoryId | "pedido" | null {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const search = useRouterState({ select: (s) => s.location.search as { cat?: string } });
  if (pathname.startsWith("/pedido")) return "pedido";
  if (pathname !== "/") return null;
  const cat = search?.cat;
  if (cat && categories.some((item) => item.id === cat)) return cat as CategoryId;
  return "todos";
}

export function CartHydrator() {
  const setHydrated = useCart((s) => s.setHydrated);
  useEffect(() => {
    void Promise.resolve(useCart.persist.rehydrate()).finally(() => setHydrated(true));
  }, [setHydrated]);
  return null;
}

export function SiteHeader() {
  const count = useCartCount();
  const active = useActiveCategory();

  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-gold">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/" search={{ cat: undefined, q: undefined }} className="min-w-0 shrink">
          <span className="block font-display text-lg leading-none tracking-wide text-ink sm:text-xl">
            CORAZA HOUSE
          </span>
          <span className="mt-1 block text-xs font-medium uppercase tracking-widest text-ink/70">
            Muebles · Villa El Salvador
          </span>
        </Link>
        <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Categorías">
          {categories.map((item) => {
            const on = active === item.id;
            return (
              <Link
                key={item.id}
                to="/"
                search={{ cat: item.id === "todos" ? undefined : item.id, q: undefined }}
                className={
                  "rounded-full px-3 py-2 text-sm font-semibold text-ink " +
                  (on ? "bg-ink text-cream" : "hover:bg-ink/10")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Link
          to="/pedido"
          className="ml-auto inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-cream md:ml-2"
        >
          Pedido
          <span className="inline-flex min-w-6 justify-center rounded-full bg-gold px-1.5 text-xs font-bold text-ink tabular-nums">
            {count}
          </span>
        </Link>
      </div>
      <nav className="flex gap-2 overflow-x-auto px-4 pb-3 md:hidden" aria-label="Categorías">
        {categories.map((item) => {
          const on = active === item.id;
          return (
            <Link
              key={item.id}
              to="/"
              search={{ cat: item.id === "todos" ? undefined : item.id, q: undefined }}
              className={
                "shrink-0 rounded-full px-3 py-2 text-sm font-semibold text-ink " +
                (on ? "bg-ink text-cream" : "bg-paper/70")
              }
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-paper">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl tracking-wide text-ink">CORAZA HOUSE SAC</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
            Fabricación y venta de muebles. RUC {STORE.ruc}. {STORE.shipping}.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">Tienda</p>
          <p className="mt-2 text-sm leading-relaxed text-ink">
            {STORE.address}
            <br />
            {STORE.stand}
            <br />
            {STORE.district}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">Redes</p>
          <div className="mt-3 flex items-center gap-3">
            <Social href={STORE.tiktok} label="TikTok">
              <TikTokIcon />
            </Social>
            <Social href={STORE.instagram} label="Instagram">
              <InstagramIcon />
            </Social>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Social({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="inline-flex size-11 items-center justify-center rounded-full bg-ink text-cream"
    >
      {children}
    </a>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true" fill="currentColor">
      <path d="M14.5 3c.4 2.4 1.8 4.1 4.2 4.4v2.5c-1.4 0-2.7-.4-3.9-1.2v6.6c0 3.4-2.6 6.2-6.2 6.2S2.4 18.7 2.4 15.3c0-3.3 2.5-6 5.8-6.2v2.6c-1.6.2-2.8 1.6-2.8 3.3 0 1.8 1.5 3.3 3.3 3.3s3.2-1.4 3.2-3.2V3h2.6Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ProductPhoto({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={`aspect-portrait w-full rounded-card border border-frame bg-paper object-cover ${className}`}
    />
  );
}
