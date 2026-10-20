import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartLine = { slug: string; qty: number };

export type Buyer = {
  name: string;
  phone: string;
  district: string;
  note: string;
};

type CartState = {
  lines: CartLine[];
  buyer: Buyer;
  hydrated: boolean;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  setBuyer: (patch: Partial<Buyer>) => void;
  setHydrated: (value: boolean) => void;
};

const emptyBuyer: Buyer = { name: "", phone: "", district: "", note: "" };

const memoryStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      buyer: emptyBuyer,
      hydrated: false,
      add: (slug, qty = 1) =>
        set((state) => {
          const found = state.lines.find((line) => line.slug === slug);
          const lines = found
            ? state.lines.map((line) =>
                line.slug === slug ? { ...line, qty: Math.min(20, line.qty + qty) } : line,
              )
            : [...state.lines, { slug, qty: Math.min(20, Math.max(1, qty)) }];
          return { lines };
        }),
      setQty: (slug, qty) =>
        set((state) => ({
          lines:
            qty <= 0
              ? state.lines.filter((line) => line.slug !== slug)
              : state.lines.map((line) =>
                  line.slug === slug ? { ...line, qty: Math.min(20, qty) } : line,
                ),
        })),
      remove: (slug) => set((state) => ({ lines: state.lines.filter((line) => line.slug !== slug) })),
      clear: () => set({ lines: [] }),
      setBuyer: (patch) => set((state) => ({ buyer: { ...state.buyer, ...patch } })),
      setHydrated: (value) => set({ hydrated: value }),
    }),
    {
      name: "coraza-pedido",
      skipHydration: true,
      storage: createJSONStorage(() => (typeof window === "undefined" ? memoryStorage : localStorage)),
      partialize: (state) => ({ lines: state.lines, buyer: state.buyer }),
    },
  ),
);

export function useCartCount() {
  const hydrated = useCart((s) => s.hydrated);
  const lines = useCart((s) => s.lines);
  if (!hydrated) return 0;
  return lines.reduce((sum, line) => sum + line.qty, 0);
}
