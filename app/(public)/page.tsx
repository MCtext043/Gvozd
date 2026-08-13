import type { Metadata } from "next";
import { BannerCarousel } from "@/components/banners/banner-carousel";
import {
  HomeCompanies,
  HomeDirections,
  HomeLeadCta,
  HomeNews,
  HomePlanSection,
  HomePromotions,
  HomeSearchSection,
  QuickCategories,
  WhyGvozd,
} from "@/components/home/sections";
import {
  getBanners,
  getCategories,
  getCompanies,
  getNews,
  getPromotions,
} from "@/services/api";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE.fullName} — ${SITE.tagline}`,
  description: `${SITE.slogan} ${SITE.address.full}. Телефон: ${SITE.phone}.`,
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE.fullName,
    description: SITE.tagline,
    url: "/",
  },
};

export default async function HomePage() {
  const [banners, categories, promotions, companies, news] = await Promise.all([
    getBanners(),
    getCategories(),
    getPromotions(),
    getCompanies({ page: 1 }),
    getNews(),
  ]);

  return (
    <>
      <BannerCarousel banners={banners} />
      <HomeSearchSection />
      <QuickCategories categories={categories} />
      <HomePromotions items={promotions} />
      <HomeCompanies items={companies} />
      <HomePlanSection />
      <WhyGvozd />
      <HomeNews items={news} />
      <HomeDirections />
      <HomeLeadCta />
    </>
  );
}
