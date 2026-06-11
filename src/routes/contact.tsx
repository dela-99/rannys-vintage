import { Phone, MessageCircle, Instagram, Send, MapPin, Clock } from "lucide-react";

export function ContactPage() {
  return (
    <div className="pt-28 pb-20 px-4 md:px-8 bg-primary-soft min-h-screen">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <p className="font-accent text-xs text-primary uppercase tracking-widest">Get In Touch</p>
          <h1 className="font-display text-5xl md:text-7xl mt-4">
            Ranny's <em className="text-gradient not-italic">Vintage</em>
          </h1>
          <p className="mt-4 text-muted-foreground italic">Chic & Stylishly Confident</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div className="glass p-8 rounded-3xl border border-white/20">
              <h2 className="font-display text-2xl mb-6">Connect Directly</h2>
              <div className="grid gap-4">
                <ContactButton
                  icon={Phone}
                  label="Call 0248333294"
                  href="tel:0248333294"
                  className="bg-foreground text-background"
                />
                <ContactButton
                  icon={MessageCircle}
                  label="WhatsApp Us"
                  href="https://wa.me/233248333294"
                  className="bg-success text-white"
                />
                <ContactButton
                  icon={Instagram}
                  label="DM on Instagram"
                  href="https://www.instagram.com/shop_rannys"
                  className="bg-[#E4405F] text-white"
                />
                <ContactButton
                  icon={Send}
                  label="Follow TikTok"
                  href="https://www.tiktok.com/@shop_rannys_new"
                  className="bg-black text-white"
                />
              </div>
            </div>

            <div className="glass p-8 rounded-3xl border border-white/20">
              <h2 className="font-display text-2xl mb-4">Visit Our Studio</h2>
              <div className="space-y-4 text-sm">
                <div className="flex gap-4">
                  <MapPin className="h-5 w-5 text-primary shrink-0" />
                  <p>Atomic Down Roundabout, Dome, Accra</p>
                </div>
                <div className="flex gap-4">
                  <Clock className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p>Mon - Sat: 9am - 8pm</p>
                    <p>Sun: 1pm - 7pm</p>
                  </div>
                </div>
                <ContactButton
                  icon={MapPin}
                  label="Open in Google Maps"
                  href="https://maps.app.goo.gl/B8xMdbdUQZp5dML68"
                  className="bg-primary text-white mt-4"
                />
              </div>
            </div>
          </div>

          <div className="h-100 md:h-full min-h-125 rounded-3xl overflow-hidden shadow-hover border-4 border-white">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.435728527453!2d-0.2289!3d5.6567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMzknMjQuMSJOIDDCsDEzJzQ0LjAiVw!5e0!3m2!1sen!2sgh!4v1715000000000!5m2!1sen!2sgh"
              className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
              style={{ border: 0 }}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactButton({
  icon: Icon,
  label,
  href,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  className: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`flex items-center justify-center gap-3 px-6 py-4 rounded-full font-accent text-xs font-bold transition-transform active:scale-95 shadow-card ${className}`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </a>
  );
}
