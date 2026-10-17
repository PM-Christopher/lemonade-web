import type { ComponentType, SVGProps } from "react";
import FacebookIcon from "@/images/icons/facebook-color.svg";
import InstagramIcon from "@/images/icons/instagram-color.svg";
import LinkedInIcon from "@/images/icons/linkedin-color.svg";
import TwitterIcon from "@/images/icons/twitter-color.svg";
import WebIcon from "@/images/icons/webIcon.svg";
import WhatsAppIcon from "@/images/icons/whatsappIcon.svg";

export interface SocialLink {
  name?: string;
  value?: string;
}

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

// Handles are turned into profile URLs; full URLs are used as given.
const NETWORKS: Record<string, { label: string; Icon: Icon; url: (handle: string) => string }> = {
  facebook: { label: "Facebook", Icon: FacebookIcon, url: (h) => `https://facebook.com/${h}` },
  instagram: { label: "Instagram", Icon: InstagramIcon, url: (h) => `https://instagram.com/${h}` },
  linkedin: { label: "LinkedIn", Icon: LinkedInIcon, url: (h) => `https://linkedin.com/in/${h}` },
  twitter: { label: "X", Icon: TwitterIcon, url: (h) => `https://x.com/${h}` },
  website: { label: "Website", Icon: WebIcon, url: (h) => `https://${h}` },
  whatsapp: { label: "WhatsApp", Icon: WhatsAppIcon, url: (h) => `https://wa.me/${h}` },
};

const ALIASES: Record<string, string> = { x: "twitter", web: "website" };

function resolve(link: SocialLink) {
  const key = (link.name ?? "").trim().toLowerCase();
  const network = NETWORKS[ALIASES[key] ?? key];
  const value = (link.value ?? "").trim();
  if (!network || !value) return null;

  if (/^https?:\/\//i.test(value)) return { network, href: value };
  const handle = key === "whatsapp" ? value.replace(/\D/g, "") : value.replace(/^@/, "");
  return { network, href: network.url(handle) };
}

// Icon row for a user's social links; renders nothing when there is none to show.
export function SocialLinks({ socials }: { socials?: SocialLink[] | null }) {
  const links = (socials ?? []).flatMap((link) => resolve(link) ?? []);
  if (links.length === 0) return null;

  return (
    <div className="mt-4">
      <p className="text-body-s text-center font-semibold">Social links</p>
      <div className="mt-3 flex justify-center gap-4">
        {links.map(({ network, href }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={network.label}
            key={network.label + href}
          >
            <network.Icon className="w-6" />
          </a>
        ))}
      </div>
    </div>
  );
}
