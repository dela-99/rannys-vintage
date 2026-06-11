import { motion } from "framer-motion";
import { Phone, MessageCircle, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">Get in Touch</h1>
          <p className="text-foreground/60">We&apos;re here to help you stay stylishly confident.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <ContactMethod 
              icon={<Phone className="text-primary" />}
              title="Call Us"
              content="0248333294 / 0204316701"
              link="tel:0248333294"
            />
            <ContactMethod 
              icon={<MessageCircle className="text-success" />}
              title="WhatsApp"
              content="Chat with our stylists"
              link="https://wa.me/233248333294"
            />
            <ContactMethod 
              icon={<MapPin className="text-primary" />}
              title="Visit Our Boutique"
              content="Atomic Down Roundabout, Dome"
              link="https://maps.app.goo.gl/B8xMdbdUQZp5dML68"
            />
            
            <div className="h-64 rounded-2xl overflow-hidden border border-primary/20 grayscale hover:grayscale-0 transition-all duration-500">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.435728461879!2d-0.2333!3d5.65!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMzknMDAuMCJOIDDCsDE0JzAwLjAiVw!5e0!3m2!1sen!2sgh!4v1700000000000" 
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
              ></iframe>
            </div>
          </div>

          <form className="bg-foreground/5 p-8 rounded-3xl border border-primary/10 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Name" type="text" placeholder="Your name" />
              <Input label="Phone" type="text" placeholder="Your phone" />
            </div>
            <Input label="Email" type="email" placeholder="Email address" />
            <div className="space-y-2">
              <label className="text-xs font-accent uppercase tracking-widest text-primary">Message</label>
              <textarea className="w-full bg-background border border-primary/10 rounded-xl p-4 min-h-[150px] focus:border-primary outline-none transition-colors" placeholder="How can we help?"></textarea>
            </div>
            <button className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
              <Send size={18} /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ContactMethod({ icon, title, content, link }: any) {
  return (
    <a href={link} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-primary/5 transition-colors group">
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">{icon}</div>
      <div>
        <h3 className="font-bold text-foreground">{title}</h3>
        <p className="text-sm text-foreground/60">{content}</p>
      </div>
    </a>
  );
}

function Input({ label, ...props }: any) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-accent uppercase tracking-widest text-primary">{label}</label>
      <input className="w-full bg-background border border-primary/10 rounded-xl p-4 focus:border-primary outline-none transition-colors" {...props} />
    </div>
  );
}