import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SitePopup } from "@/components/popup/site-popup";
import { getActivePopup, getCategories } from "@/services/api";
import { SITE } from "@/lib/site";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, popup] = await Promise.all([
    getCategories(),
    getActivePopup(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeGoodsStore",
    name: SITE.fullName,
    description: SITE.tagline,
    url: SITE.url,
    telephone: SITE.phone,
    email: SITE.email,
    slogan: SITE.slogan,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postal,
      addressCountry: "RU",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "09:00",
        closes: "19:00",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer />
      <SitePopup popup={popup} />
    </>
  );
}
