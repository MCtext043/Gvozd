/** Реальные факты СЦ «Гвоздь» — без выдуманных данных */

export const SITE = {
  name: "Гвоздь",
  fullName: "Строительный центр «Гвоздь»",
  slogan: "Искал везде — нашел в Гвозде!",
  tagline: "Всё для ремонта и дома — в одном месте",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://izhgvozd.ru",
  address: {
    postal: "426034",
    region: "Удмуртская Республика",
    city: "Ижевск",
    street: "ул. Удмуртская, 304",
    full: "426034, Удмуртская Республика, Ижевск, ул. Удмуртская, 304",
  },
  phone: "+7 (3412) 908-546",
  phoneHref: "tel:+73412908546",
  email: "gvozdizhevsk@mail.ru",
  hours: {
    weekdays: "пн–сб 09:00–20:00",
    sunday: "вс 09:00–19:00",
    short: "пн–сб 09:00–20:00, вс 09:00–19:00",
  },
  areaSqM: 18500,
  dailyVisitors: 6000,
  siteVisitsPerMonth: 2000,
  stops: [
    "трамвай «Подшипниковый завод»",
    "автобус/троллейбус «Завод Редуктор»",
  ],
  /** Координаты для Яндекс.Карт (долгота, широта) — Удмуртская, 304 */
  map: {
    lon: 53.2223,
    lat: 56.8587,
    zoom: 16,
    orgUrl:
      "https://yandex.ru/maps/org/spetsializirovanny_torgovy_tsentr_gvozd/1205976838/",
    directionsUrl:
      "https://yandex.ru/maps/?rtext=~56.8587,53.2223&rtt=auto",
  },
  admin: {
    name: "Каркина Альбина Робертовна",
    phone: "8-912-859-35-25",
  },
  manager: {
    name: "Семакина Ирина Владимировна",
    phone: "8-912-447-25-49",
  },
  marketing: {
    company: "Агентство бизнес решений «Центр»",
    name: "Самойлова Софья Сергеевна",
    phone: "+7 (3412) 945-024",
    email: "s.samoylova@cdm.team",
  },
} as const;

/** 13 корневых категорий каталога */
export const ROOT_CATEGORIES = [
  { slug: "dekor", name: "Декор" },
  { slug: "dom-i-sad", name: "Дом и сад" },
  { slug: "instrument-i-specodezhda", name: "Инструмент и спецодежда" },
  { slug: "lakokrasochnye-materialy", name: "Лакокрасочные материалы" },
  { slug: "mebel", name: "Мебель" },
  { slug: "napolnye-pokrytiya", name: "Напольные покрытия" },
  { slug: "oboi", name: "Обои" },
  { slug: "okna-i-dveri", name: "Окна и двери" },
  { slug: "otoplenie-i-klimat", name: "Отопление и климат" },
  { slug: "plitka", name: "Плитка" },
  { slug: "santehnika", name: "Сантехника" },
  { slug: "stroymaterialy", name: "Стройматериалы" },
  { slug: "elektrotovary", name: "Электротовары" },
] as const;

export const NAV_LINKS = [
  { href: "/catalog", label: "Каталог" },
  { href: "/companies", label: "Отделы" },
  { href: "/promotions", label: "Акции" },
  { href: "/news", label: "Новости" },
  { href: "/about", label: "О центре" },
  { href: "/plan", label: "План центра" },
  { href: "/contacts", label: "Контакты" },
] as const;

export type NavVisibility = {
  promotions?: boolean;
  news?: boolean;
};

/** Пункты меню с учётом пустых разделов акций/новостей */
export function getVisibleNavLinks(visibility: NavVisibility = {}) {
  const { promotions = true, news = true } = visibility;
  return NAV_LINKS.filter((link) => {
    if (link.href === "/promotions") return promotions;
    if (link.href === "/news") return news;
    return true;
  });
}

export const ADMIN_NAV = [
  { href: "/admin", label: "Обзор", icon: "LayoutDashboard" },
  { href: "/admin/banners", label: "Баннеры", icon: "Image" },
  { href: "/admin/popup", label: "Всплывающие окна", icon: "MessageSquare" },
  { href: "/admin/promotions", label: "Акции", icon: "Tag" },
  { href: "/admin/news", label: "Новости", icon: "Newspaper" },
  { href: "/admin/categories", label: "Категории", icon: "Folders" },
  { href: "/admin/companies", label: "Компании", icon: "Building2" },
  { href: "/admin/content", label: "Контент", icon: "FileText" },
  { href: "/admin/leads", label: "Заявки", icon: "Inbox" },
  { href: "/admin/settings", label: "Настройки", icon: "Settings" },
  { href: "/admin/users", label: "Пользователи", icon: "Users" },
] as const;
