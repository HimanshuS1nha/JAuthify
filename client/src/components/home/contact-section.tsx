import { IoIosMailOpen, IoIosTime } from "react-icons/io";
import { FiSend } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CONTACT_INFO = [
  {
    icon: IoIosMailOpen,
    label: "Email us",
    value: "support@jauthify.com",
  },
  {
    icon: IoIosTime,
    label: "Response time",
    value: "Within 24 hours",
  },
];

const ContactSection = () => {
  return (
    <section className="relative mx-auto max-w-4xl mt-10" id="contact">
      <div className="mb-8 text-center">
        <h2 className="mb-3 text-3xl font-bold tracking-tight text-secondary md:text-4xl">
          Get in touch
        </h2>
        <p className="text-muted-foreground">
          Have questions? We&apos;d love to hear from you. Send us a message and
          we&apos;ll respond as soon as possible.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold text-foreground">
              Contact information
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Reach out through any of the channels below or fill out the form
              and our team will get back to you shortly.
            </p>
            <div className="mt-2 flex flex-col gap-3">
              {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background p-4"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="text-primary" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium text-foreground">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-medium">First name</Label>
                <Input placeholder="John" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-medium">Last name</Label>
                <Input placeholder="Doe" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Email</Label>
              <Input type="email" placeholder="john@example.com" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Message</Label>
              <Textarea rows={4} placeholder="Tell us how we can help..." />
            </div>
            <Button className="mt-1 gap-2 self-end">
              Send message
              <FiSend size={15} />
            </Button>
          </form>
        </div>
      </div>

      <div className="flex justify-center mt-6 text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} JAuthify. All rights reserved
      </div>
    </section>
  );
};

export default ContactSection;
