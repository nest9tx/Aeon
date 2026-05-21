/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STRIPE_CHECKOUT_333?: string;
  readonly VITE_STRIPE_CHECKOUT_777?: string;
  readonly VITE_STRIPE_CHECKOUT_888?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
