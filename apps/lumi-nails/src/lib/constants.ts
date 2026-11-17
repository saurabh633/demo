export const STUDIO = {
  name: "Lumi Nails",
  tagline: "Nail extension & art studio",
  phone: "+1 (212) 555-0148",
  whatsapp: "12125550148",
  email: "hello@luminails.studio",
  address: "128 Soft Petal Lane, SoHo, New York, NY 10012",
  hours: [
    { day: "Monday – Friday", time: "10:00 AM – 7:00 PM" },
    { day: "Saturday", time: "10:00 AM – 6:00 PM" },
    { day: "Sunday", time: "11:00 AM – 5:00 PM" },
  ],
  instagram: "@luminails.studio",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/services", label: "Services" },
  { href: "/booking", label: "Booking" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
] as const;

export const SHAPES = ["almond", "square", "coffin", "stiletto"] as const;

export const WHATSAPP_URL = `https://wa.me/${STUDIO.whatsapp}?text=${encodeURIComponent("Hi Lumi Nails! I'd like to book an appointment.")}`;
