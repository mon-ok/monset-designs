import { CONTACT } from "../content.js";
import { MonsetMark, Wordmark } from "./Logo.jsx";
import { wrap } from "./marks.jsx";

const LINKS = [
  ["#fixes", "What we fix"],
  ["#method", "How we work"],
  ["#work", "Our work"],
  ["#questions", "Questions"],
  ["#assessment", "Book a free assessment"],
];

export default function Footer() {
  return (
    <footer className="border-t border-film/10 bg-night py-14 text-film">
      <div className={`${wrap} grid gap-10 md:grid-cols-12`}>
        <div className="md:col-span-5">
          <a href="#top" className="inline-flex items-center gap-2.5" aria-label="Monset.co, back to top">
            <MonsetMark className="h-8 w-8" />
            <Wordmark className="text-xl" />
          </a>
          <p className="mt-3 text-mist">Your digital contractor.</p>
          <p className="mt-1 text-sm text-mist">Built in Cebu, Philippines. Calls happen online, wherever you are.</p>
        </div>
        <nav className="flex flex-col gap-2.5 md:col-span-3" aria-label="Footer">
          {LINKS.map(([href, label]) => (
            <a key={href} href={href} className="text-mist hover:text-film">{label}</a>
          ))}
        </nav>
        <div className="md:col-span-4">
          <a href={`mailto:${CONTACT.email}`} className="block font-semibold hover:text-contour">{CONTACT.email}</a>
          <a href={CONTACT.phoneHref} className="figures mt-1 block font-semibold hover:text-contour">{CONTACT.phone}</a>
          <p className="mt-4 text-sm text-mist">&copy; {new Date().getFullYear()} Monset.co</p>
        </div>
      </div>
      <p className={`${wrap} mt-10 text-[0.8125rem] leading-relaxed text-film/55`}>
        We respect your privacy. Any details you send us are used only to respond to your enquiry
        and are never sold or shared with third parties. This site sets no tracking cookies of its
        own; the booking calendar is provided by Calendly, which sets its own cookies under{" "}
        <a href="https://calendly.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">its privacy policy</a>.
        By contacting us you consent to us storing your message for the purpose of replying to it;
        ask us any time to delete it at{" "}
        <a href={`mailto:${CONTACT.email}`} className="underline">{CONTACT.email}</a>.
      </p>
    </footer>
  );
}
