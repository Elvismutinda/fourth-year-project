import Link from "next/link";
import { CircleAlert, ScrollText, Shield } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">We&apos;re here to help!</h2>
        <div className="space-y-4 md:max-w-lg">
          <Link
            href="mailto:elvismutinda2@gmail.com"
            target="_blank"
            className="block rounded-lg border border-secondary p-4 transition-colors hover:bg-secondary/40"
          >
            <div className="flex items-center gap-4">
              <CircleAlert className="h-5 w-5 text-[#a3004c]" />
              <div>
                <h3 className="font-medium">
                  Having account or billing issues?
                </h3>
                <p className="text-sm text-muted/80">
                  Email us for priority support - elvismutinda2@gmail.com
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg border border-secondary p-4 transition-colors hover:bg-secondary/40"
          >
            <div className="flex items-center gap-4">
              <Shield className="h-5 w-5 text-[#a3004c]" />
              <div>
                <h3 className="font-medium">Privacy Policy</h3>
                <p className="text-sm text-muted/80">
                  Read our privacy policy and data handling practices
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/terms-of-service"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg border border-secondary p-4 transition-colors hover:bg-secondary/40"
          >
            <div className="flex items-center gap-4">
              <ScrollText className="h-5 w-5 text-[#a3004c]" />
              <div>
                <h3 className="font-medium">Terms of Service</h3>
                <p className="text-sm text-muted/80">
                  Review our terms of service and usage guidelines
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
