import { Instagram, MessageCircle, MapPin, Clock, Phone, Send } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground px-4 pb-10 pt-20 text-background md:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <span className="font-display text-3xl font-bold">Ranny&apos;s Vintage Clothing</span>
          <p className="mt-4 max-w-sm text-sm text-background/70">
            Chic, stylishly confident pieces — handpicked New Styles, dropped weekly in Accra.
          </p>
          <div className="mt-6 flex gap-3">
            <SocialLink
              href="https://www.instagram.com/shop_rannys"
              icon={<Instagram className="h-4 w-4" />}
              label="Instagram"
            />
            <SocialLink
              href="https://wa.me/233248333294"
              icon={<MessageCircle className="h-4 w-4" />}
              label="WhatsApp"
            />
            <SocialLink
              href="https://www.tiktok.com/@shop_rannys_new"
              icon={<Send className="h-4 w-4" />}
              label="TikTok"
            />
          </div>
        </div>
        <div>
          <h4 className="font-accent text-xs text-primary-glow uppercase tracking-wider">
            Visit Us
          </h4>
          <ul className="mt-4 space-y-4 text-sm text-background/80">
            <li className="flex items-start gap-3">
              <MapPin className="h-5 w-5 shrink-0 text-primary" />
              <a
                href="https://maps.app.goo.gl/B8xMdbdUQZp5dML68"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                Atomic Down Roundabout, Dome, Accra
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="h-5 w-5 shrink-0 text-primary" />
              <div>
                <p>Mon - Sat: 9am - 8pm</p>
                <p>Sun: 1pm - 7pm</p>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-5 w-5 shrink-0 text-primary" />
              <span>0248333294 / 0204316701</span>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-accent text-xs text-primary-glow">Shop</h4>
          <ul className="mt-4 space-y-3 text-sm text-background/80">
            <li>
              <a href="#" className="hover:text-primary-glow">
                New Arrivals
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary-glow">
                Dresses
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary-glow">
                Shoes
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary-glow">
                Jewelry
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-accent text-xs text-primary-glow">Help</h4>
          <ul className="mt-4 space-y-3 text-sm text-background/80">
            <li>
              <a href="#" className="hover:text-primary-glow">
                Contact
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary-glow">
                Shipping
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary-glow">
                Returns
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary-glow">
                Size Guide
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-16 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-background/10 pt-8 text-xs text-background/60 md:flex-row">
        <p>© 2026 Ranny&apos;s Vintage Clothing. Made with love in Accra.</p>
        <p className="font-accent">Privacy · Terms</p>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-full bg-background/10 transition hover:bg-primary hover:text-white"
    >
      {icon}
    </a>
  );
}
