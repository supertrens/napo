"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, Share2, X } from "lucide-react";
import { useT } from "./language-provider";

type Props = {
  shareUrl: string;
  composedText: string;
  onClose?: () => void;
  className?: string;
  variant?: "buttons" | "popover";
};

export function ShareSheet({ shareUrl, composedText, className }: Props) {
  const t = useT();
  const [copied, setCopied] = useState(false);
  const [hasNative, setHasNative] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setHasNative(
      typeof navigator !== "undefined" &&
        typeof navigator.share === "function",
    );
  }, []);

  const fullText = `${composedText}\n${shareUrl}`;

  const links = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(composedText)}&url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(fullText)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
  };

  async function copy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  }

  async function nativeShare() {
    if (!hasNative) return;
    try {
      await navigator.share({
        title: "Napo Air",
        text: composedText,
        url: shareUrl,
      });
    } catch {
      // user cancelled
    }
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => (hasNative ? nativeShare() : setOpen((v) => !v))}
        className="btn-gold inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
      >
        <Share2 className="h-4 w-4" />
        {t.share.cta}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              key="backdrop"
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm"
            />
            <motion.div
              key="sheet"
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
              role="dialog"
              aria-modal="true"
              className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,460px)] -translate-x-1/2 -translate-y-1/2 rounded-3xl"
            >
              <div className="surface-elev relative overflow-hidden rounded-3xl p-7">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-foreground-muted transition-colors hover:bg-white/5 hover:text-foreground-soft"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="text-[11px] uppercase tracking-[0.32em] text-foreground-dim">
                  ✦ {t.share.title}
                </div>
                <div className="mt-2 font-display text-2xl tracking-[-0.02em]">
                  {t.share.title}
                </div>
                <p className="mt-2 text-sm text-foreground-muted">
                  {t.share.description}
                </p>

                <div className="mt-5 flex items-stretch overflow-hidden rounded-xl border border-border-strong bg-background-elev/40">
                  <div className="flex-1 truncate px-3 py-2.5 text-xs text-foreground-muted">
                    {shareUrl}
                  </div>
                  <button
                    type="button"
                    onClick={copy}
                    className="flex items-center gap-1.5 border-l border-border-strong px-4 text-xs font-medium text-haiti-gold transition-colors hover:bg-haiti-gold/10"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        {t.share.copied}
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        {t.share.copy}
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2.5">
                  <SocialButton
                    href={links.twitter}
                    label={t.share.twitter}
                    icon={<XIcon />}
                  />
                  <SocialButton
                    href={links.whatsapp}
                    label={t.share.whatsapp}
                    icon={<WhatsAppIcon />}
                  />
                  <SocialButton
                    href={links.facebook}
                    label={t.share.facebook}
                    icon={<FacebookIcon />}
                  />
                </div>

                {hasNative && (
                  <button
                    type="button"
                    onClick={nativeShare}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-border-strong bg-background-elev/40 py-2.5 text-sm text-foreground-soft transition-colors hover:border-border-bright"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    {t.share.native}
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function SocialButton({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center gap-2 rounded-2xl border border-border-strong bg-background-elev/40 px-3 py-4 text-xs text-foreground-muted transition-all hover:-translate-y-0.5 hover:border-border-bright hover:text-foreground-soft"
    >
      <span className="flex h-8 w-8 items-center justify-center text-foreground-soft">
        {icon}
      </span>
      <span className="text-center text-[11px] uppercase tracking-[0.16em]">
        {label}
      </span>
    </a>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.81 11.81 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.595 5.435l-.999 3.648 3.893-1.022zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.149-.174.198-.298.298-.496.099-.198.05-.372-.025-.521-.074-.149-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.298-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413z" />
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 011.141.195v3.325a8.623 8.623 0 00-.653-.036 26.805 26.805 0 00-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 00-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647z" />
    </svg>
  );
}
