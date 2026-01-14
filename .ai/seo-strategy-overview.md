# Diagnoza problemu i omówienie strategii na 2026

Typ: Dodatkowe
Kiedy: 12/01/2026

<aside>

**Cel:** w 2026 wrócić do wzrostu ruchu organicznego i dowozić **leady.**

**Język:** 100% priorytet na **PL** przez cały 2026 (EN nie jest targetem).

**3 filary projektu:**

1. **Techniczne SEO** (architektura, indeksacja, canonicale, schema, linkowanie wewnętrzne, crawl)
2. **Backlinki** (pozyskanie i kontrola jakości + dystrybucja na właściwe URL-e)
3. **Content SEO** (struktura pillar/cluster + lokalne landing pages + blog, ale tylko lead-gen)
</aside>

## Diagnoza strony, co nie działa?

- Nasz DR to ~49, ale nie mamy silnych UR dla podstron konwertujących
  - W zasadzie nie mamy podstron kowertujących
- Mamy dużo impressions, ale bardzo mało clicków, nasz CTR leży.
  - Ostatnie 3 miesiące: 77.4k impressions → 282 clicks = 0.3%, bez frazy `kryptonum`, schodzimy do 0.2%
  - Dla porównania
    1. Fabryka Atrakcji: 3.06k Clicks, 284k impressions = ~1% CTR
    2. Audiofast: 2.09k Clicks, 39.9k impression = ~5% CTR

<aside>

Mamy **mocną domenę**, ale nie mamy `żadnych` mocnych stron.

</aside>

- Dużo część podstron nie trafia do indeksu **`Crawled – currently not indexed: 65**`
  - Paginacja
  - Strony EN
  - Bardzo podobne strony usługowe PL (szczególnie lokalne)
- Sitewide stopka, linkowanie do wszystkich usług + wszystkich stron lokalnych = rozmycie, wszystko dla Google jest tak samo ważne.
- Backlinki
  - Kierujemy tylko na stronę główną, nie mamy stron czysto konwertujących, które zasilamy
  - Jakość (?)

<aside>

### Główny wniosek

Mamy bardzo dużo stron, które są bardzo podobne, ale nie mamy focusu na żadnej z nich, przez co:

- Nie mamy jasnych zwycięzców (Pillar Pages), stron, które odpowiadają za konwersję i leady
- Mamy bardzo słabą unikalność na stronach lokalnych/usługowcyh, wszystko jest rozmytę + sitewide nawigacja
- Backlinki lecą głównie w homepage, nie w pillar/winner pages
- Google nawet nie indeksuje niektórych stron

> Mamy dużo impressions, bo **dużo** naszych stron pojawia się w SERP, ale mamy mało kliknięć, bo nasze strony pojawiają się z reguły na 2/3 stronie SERP, właśnie przez rozmycie kontentu.

</aside>

---

## Jak powinniśmy podejść do SEO w 2026?

- Ustalamy maksymalnie kilka głównych URL (short/mid tail keywords), które mają zdobywać leady, np. “aplikacje internetowe”
- Budujemy z nich Pillar Pages, dodajemy lokalne strony, np. “aplikacje internetowe warszawa”, dodajemy linkujące posty blogowe, np. “proces budowania aplikacji internetowej 2026”
- Walimy backlinki w Pillar Page, tworzymy z tego pajęczynę powiązać, przez co wzmacniamy “aplikacje internetowe”, pozycjonujemy je coraz wyżej, leady wchodzą jak masło
- - Case-studies (lokalne) jako dodatek.

---

## Filar 1: Techniczne SEO

### Quicks Wins

- Wyczyszczenie Sitemapy
  - EN → noindex
  - Paginacja → noindex dofollow
- Wycięcie miast sitewide ze stopki
- Ogarnięcie canonicals
- Zadania od Marcina
  - SEO above the fold (?)
  - Przejrzenie altów
  - Ogarnąć structured data
    - Organization
    - Localbusiness
      - Same as: <script type="application/ld+json"> { "@context" : ["http://schema.org"](http://schema.org/), "@type" : "LocalBusiness", "name" : "MGroup - strony i sklepy internetowe, pozycjonowanie Łódź", "url": ["https://www.mgroup.pl"](https://www.mgroup.pl/), "@id": ["https://www.mgroup.pl"](https://www.mgroup.pl/), **"sameAs" : [ ["https://g.page/mgrouppl"](https://g.page/mgrouppl), ["https://www.facebook.com/MGroupPL"](https://www.facebook.com/MGroupPL) ]**
    - Faq
    - Article
    - Reviews (opinie)
  - Naprawa zerwanego linku
    - **<link rel="alternate" hreflang="en" href="https://kryptonum.eunull">**
  - Ogarnięcie nagłówków na stronach, nagłówki tematyczne

### Long Term

- Ustalenie indeksowania obecnych stron
- Ogarnięcie internal linking → pillar pages strategy
- Check oczyszczonej sitemapy
  - Pillar pages
  - Local / blog /case studies
  - Brak:
    - EN
    - Paginacja
    - Filtry
    - Śmieciowe strony
- Monitoring indeksowania w GSC

---

## Filar 2: Backlinki

### Quicks Wins

- Ustalenie wspólnego spreadsheet backlinków
  - data pozyskania
  - domena + URL źródłowy
  - typ linku (artykuł / katalog / forum / partner / sponsor)
  - follow/nofollow/sponsored/ugc
  - anchor
  - target URL (dokładny)
  - koszt
  - uwagi (np. “sitewide”, “w treści”, “footer”)
- Zmiana dystrybucji
  - minimum 60–70% linków idzie w **pillar pages** (usługi bez miasta)
  - 20–30% w TOP local (Warszawa/Łódź)
  - reszta: linkable assets (mocne artykuły “koszt / proces / porównanie”)
- Zmiana anchorów
  Zasada:
  - większość anchorów: brand / URL / naturalne (“sprawdź”, “Kryptonum”, “kryptonum.eu”)
  - exact-match usługowe: używać oszczędnie, miksować (“tworzenie sklepów”, “software house”, “aplikacje webowe”)
    Efekt:
  - bardziej naturalny profil,
  - większa szansa, że linki “niosą” zamiast być ignorowane.

### Long Term

- Ucinanie śmieciowych źródeł (?)
- Podbijanie budżetu (?)

---

## Filar 3: Kontent

### Quicks Wins

- Wybranie 4/5 stron na pillar pages, które będą generować leady, np. “aplikacje internetowe”
- Wybranie pod te strony najważniejszych miast
  - Tylko takich, gdzie faktycznie jesteśmy unikalni

<aside>
💡

Wybór **Buyer Person**

</aside>

### Strategy plan

- Budowanie:
  - Pillar Pages, duże centrum pajęczyny (Najpełniejsza, FAQ, CTA, konkrety, case studies)
  - Local pages (unikalnie informacje dla local, lokalne referencje, case’u, opinie, FAQ - lokalne)
  - Blog posts (X postów pod konkretny Pillar Page)
  - Case’y pod konkretny pillar page
  - Wszystko podlinkowane wewnętrznie
    - Linkowanie to 90% między stronami z pajęczyny, i tylko ~10% cross-linking.
  - Dodatkowo kmina Performance, Social, Video → jak może pomóc.

<aside>
💡

Update kontentu na stronie:

- Aktualizacja członków (Damiana nie ma już od roku 😜)
- Dodanie Case Studies: Audiofast + KZK (2 z 3) największych projektów u nas. Chwalmy się nimi jak najszybciej.
- Redirect [kryptonum.eu](http://kryptonum.eu) → kryptonum.eu/pl
</aside>

---

{
"urls": [
"https://kryptonum.eu/pl/programowanie/aplikacje-internetowe-poznan",
"https://kryptonum.eu/en/portfolio",
"https://kryptonum.eu/pl/programowanie/dedykowane-strony-www",
"https://kryptonum.eu/pl/zespol/oliwier",
"https://kryptonum.eu/pl/blog/jak-napisac-dobry-brief",
"https://kryptonum.eu/en/blog/what-to-keep-in-mind-when-creating-websites-web-design-essentials",
"https://kryptonum.eu/pl/blog/jak-wybrac-agencje",
"https://kryptonum.eu/pl/programowanie/dedykowane-strony-www/strony-internetowe-gdansk",
"https://kryptonum.eu/pl/portfolio/around-the-coffee",
"https://kryptonum.eu/en/team/bartek",
"https://kryptonum.eu/pl/programowanie/dedykowane-strony-www/rzeszow",
"https://kryptonum.eu/pl/portfolio/kierunek-dzierganie",
"https://kryptonum.eu/en/contact",
"https://kryptonum.eu/pl/programowanie/dedykowane-strony-www/bydgoszcz",
"https://kryptonum.eu/en/portfolio/psychodietmed",
"https://kryptonum.eu/pl/biznes-strategia/warsztaty-strategiczne",
"https://kryptonum.eu/en/marketing-seo/performance-marketing",
"https://kryptonum.eu/pl/blog/zrobic-samemu-czy-zlecic-agencji",
"https://kryptonum.eu/en/design-branding/visual-identity-and-logo",
"https://kryptonum.eu/en/portfolio/nowakowski-dominika-sujka-kujawiak-law-firm",
"https://kryptonum.eu/pl/blog/skad-brac-pomysly-na-tresci-w-social-mediach-i-na-strone-pomysly-na-content-marketingowy",
"https://kryptonum.eu/pl/zespol/bogumil",
"https://kryptonum.eu/pl/programowanie/dedykowane-sklepy-internetowe/krakow",
"https://kryptonum.eu/pl/portfolio/psychodietmed",
"https://kryptonum.eu/pl/portfolio/fabryka-atrakcji",
"https://kryptonum.eu/pl/programowanie/software-house-krakow",
"https://kryptonum.eu/en/web-development",
"https://kryptonum.eu/en/marketing-seo",
"https://kryptonum.eu/pl/programowanie/dedykowane-strony-www/strony-internetowe-katowice",
"https://kryptonum.eu/pl/portfolio/sits-nowoczesna-strona-internetowa-branza-meblarska",
"https://kryptonum.eu/pl/portfolio/brands-online",
"https://kryptonum.eu/en/portfolio/brands-online",
"https://kryptonum.eu/pl/blog/kategoria/technologia",
"https://kryptonum.eu/pl/programowanie/aplikacje-internetowe-czestochowa",
"https://kryptonum.eu/en/team/patrycja",
"https://kryptonum.eu/en/blog/best-ai-coding-tools",
"https://kryptonum.eu/pl/programowanie/aplikacje-internetowe-lublin",
"https://kryptonum.eu/en/blog/what-are-the-main-types-of-cyberattacks-the-most-common-hacking-methods-cybersecurity",
"https://kryptonum.eu/pl/programowanie/aplikacje-internetowe-kielce",
"https://kryptonum.eu/pl/programowanie/software-house-warszawa",
"https://kryptonum.eu/pl/blog/czym-jest-domena-internetowa-ile-kosztuje-i-z-czego-sie-sklada",
"https://kryptonum.eu/pl/programowanie/dedykowane-strony-www/lublin",
"https://kryptonum.eu/en/business-strategy/market-analysis–interviews",
"https://kryptonum.eu/pl/programowanie/dedykowane-strony-www/zielona-gora",
"https://kryptonum.eu/pl/marketing-seo/performance-marketing",
"https://kryptonum.eu/pl/zespol/marcin",
"https://kryptonum.eu/en/marketing-seo/marketing-strategy",
"https://kryptonum.eu/en/design-branding/ui-ux-audit",
"https://kryptonum.eu/pl/programowanie/aplikacje-internetowe-rzeszow",
"https://kryptonum.eu/en/blog/what-is-remarketing-and-how-does-a-remarketing-campaign-work-definition-and-business-benefits",
"https://kryptonum.eu/pl/blog/jak-zwiekszyc-wspolczynnik-konwersji-w-sklepie-internetowym-i-na-stronie-optymalizacja-konwersji",
"https://kryptonum.eu/en/blog/a-website-built-on-a-template-or-a-custom-design-the-downsides-of-using-templates",
"https://kryptonum.eu/en/blog/where-to-find-content-ideas-for-social-media-and-your-website",
"https://kryptonum.eu/pl/programowanie/software-house-kielce",
"https://kryptonum.eu/pl/blog/o-czym-pamietac-podczas-implementacji-strony-www",
"https://kryptonum.eu/en/blog/category/technology",
"https://kryptonum.eu/en/blog/what-is-mvp-minimum-viable-product",
"https://kryptonum.eu/pl/blog/o-czym-warto-pamietac-przed-uruchomieniem-strony-www",
"https://kryptonum.eu/pl/biznes-strategia",
"https://kryptonum.eu/pl/portfolio/krk-partners",
"https://kryptonum.eu/en/privacy-policy",
"https://kryptonum.eu/pl/portfolio/stark-house",
"https://kryptonum.eu/en/portfolio/kierunek-dzierganie",
"https://kryptonum.eu/en/portfolio/iza-trzeciak",
"https://kryptonum.eu/pl/blog/jakie-sa-typy-i-rodzaje-agencji-reklamowych-i-innych",
"https://kryptonum.eu/pl/biznes-strategia/wywiady-poglebione-analiza-rynku",
"https://kryptonum.eu/pl/portfolio/mind-and-soul-healer",
"https://kryptonum.eu/pl/zespol/kuba",
"https://kryptonum.eu/pl/portfolio/woodme",
"https://kryptonum.eu/pl/blog/wspolpraca-z-agencja-interaktywna",
"https://kryptonum.eu/pl/programowanie/dedykowane-strony-www/wroclaw",
"https://kryptonum.eu/pl/portfolio/foto-studio",
"https://kryptonum.eu/en/blog/what-to-keep-in-mind-when-implementing-a-website",
"https://kryptonum.eu/en/portfolio/category/copywriting",
"https://kryptonum.eu/pl/blog/kategoria/kultura",
"https://kryptonum.eu/en/blog/balancing-stability-and-innovation",
"https://kryptonum.eu/pl/programowanie/aplikacje-internetowe-lodz",
"https://kryptonum.eu/en/blog/what-is-a-marketing-funnel",
"https://kryptonum.eu/en/portfolio/laik-knows",
"https://kryptonum.eu/pl/programowanie/dedykowane-strony-www/strony-internetowe-czestochowa",
"https://kryptonum.eu/pl/programowanie/aplikacje-internetowe-bialystok",
"https://kryptonum.eu/en/blog/how-to-boost-your-websites-conversion-rate",
"https://kryptonum.eu/pl/portfolio/kategoria/copywriting",
"https://kryptonum.eu/pl/programowanie/aplikacje-internetowe-krakow",
"https://kryptonum.eu/pl/programowanie/aplikacje-internetowe-bydgoszcz",
"https://kryptonum.eu/pl/portfolio/slime-box",
"https://kryptonum.eu/en/blog/category/culture",
"https://kryptonum.eu/en/blog/product-design-workshop-what-exactly-are-product-workshops",
"https://kryptonum.eu/pl/blog/najwazniejsze-trendy-technologiczne",
"https://kryptonum.eu/pl/programowanie/software-house-czestochowa",
"https://kryptonum.eu/pl/portfolio/bloodwise",
"https://kryptonum.eu/pl/programowanie/software-house-radom",
"https://kryptonum.eu/pl/blog/czym-jest-system-zarzadzania-trescia-strony-www",
"https://kryptonum.eu/pl/blog/wymiary-zdjec-i-grafik-na-social-media-w-2023-roku",
"https://kryptonum.eu/pl/programowanie/aplikacje-internetowe-sosnowiec",
"https://kryptonum.eu/pl/programowanie/software-house-olsztyn",
"https://kryptonum.eu/en/team/wiktoria",
"https://kryptonum.eu/en/portfolio/category/e-commerce",
"https://kryptonum.eu/pl/programowanie/dedykowane-strony-www/krakow",
"https://kryptonum.eu/en/portfolio/sits",
"https://kryptonum.eu/en/blog/what-is-user-flow-design-user-journey-design-ux-design",
"https://kryptonum.eu/pl/programowanie/aplikacje-internetowe-katowice",
"https://kryptonum.eu/pl/blog/mvp-maximum-i-minimum-viable-product-and-mmf",
"https://kryptonum.eu/en/team/michal",
"https://kryptonum.eu/en/design-branding/visual-workshops",
"https://kryptonum.eu/pl/portfolio/bezpieczna-rodzina",
"https://kryptonum.eu/pl/design-branding/identyfikacja-wizualna-logo/warszawa",
"https://kryptonum.eu/en/blog/how-to-build-a-business-10-practical-tips-to-help-you-grow",
"https://kryptonum.eu/pl/portfolio/kategoria/identyfikacja-wizualna",
"https://kryptonum.eu/pl/zespol/wiktoria",
"https://kryptonum.eu/pl/blog/kategoria/biznes",
"https://kryptonum.eu/pl/programowanie/software-house-bialystok",
"https://kryptonum.eu/en/portfolio/fabryka-atrakcji",
"https://kryptonum.eu/en/portfolio/foodpatka",
"https://kryptonum.eu/en/blog/how-to-build-a-marketing-department-in-a-saas-company",
"https://kryptonum.eu/en/blog/category/business",
"https://kryptonum.eu/pl/programowanie/dedykowane-strony-www/torun",
"https://kryptonum.eu/pl/portfolio/kategoria/sklep-internetowy",
"https://kryptonum.eu/pl/blog/czym-jest-lejek-marketingowy",
"https://kryptonum.eu/pl/programowanie/software-house-gorzow-wielkopolski",
"https://kryptonum.eu/pl/portfolio/homessimo",
"https://kryptonum.eu/pl/programowanie/software-house-poznan",
"https://kryptonum.eu/pl/programowanie/dedykowane-strony-www/warszawa",
"https://kryptonum.eu/en/team/kuba",
"https://kryptonum.eu/en/blog/what-is-a-domain-name-cost-components-how-it-works",
"https://kryptonum.eu/en/team/maciek",
"https://kryptonum.eu/en/portfolio/masaz-po-domowemu",
"https://kryptonum.eu/en/blog/why-is-process-so-important-in-project-management",
"https://kryptonum.eu/en/portfolio/stark-house",
"https://kryptonum.eu/pl/blog/co-to-jest-seo-i-optymalizacja-stron",
"https://kryptonum.eu/en/portfolio/category/marketing",
"https://kryptonum.eu/pl/portfolio/kategoria/strategia-marki",
"https://kryptonum.eu/pl/blog/user-flow-design",
"https://kryptonum.eu/en/blog/what-is-a-website-content-management-system-cms",
"https://kryptonum.eu/pl/zespol/michal",
"https://kryptonum.eu/en/blog/how-to-build-strong-customer-relationships-through-automation",
"https://kryptonum.eu/pl/portfolio/kategoria/strona-internetowa",
"https://kryptonum.eu/pl/design-branding/audyt-ui-ux",
"https://kryptonum.eu/pl/programowanie/software-house-lublin",
"https://kryptonum.eu/pl/programowanie/dedykowane-strony-www/radom",
"https://kryptonum.eu/pl/portfolio/laik-knows",
"https://kryptonum.eu/en/marketing-seo/seo",
"https://kryptonum.eu/pl/blog/strona-www-na-gotowym-szablonie-czy-indywidualny-projekt-strony-internetowej",
"https://kryptonum.eu/pl/programowanie",
"https://kryptonum.eu/pl/zespol/patrycja",
"https://kryptonum.eu/pl/portfolio/limalogic",
"https://kryptonum.eu/en/blog/types-of-business-models-in-e-commerce",
"https://kryptonum.eu/pl/programowanie/dedykowane-strony-www/opole",
"https://kryptonum.eu/en/marketing-seo/social-media-management",
"https://kryptonum.eu/pl/blog/szybkosc-ladowania-strony-internetowej-czym-jest-i-co-na-nia-wplywa",
"https://kryptonum.eu/en/blog/why-hiring-a-project-manager-is-important-project-management-scope-control",
"https://kryptonum.eu/en/team/damian",
"https://kryptonum.eu/pl/zespol/damian",
"https://kryptonum.eu/pl/programowanie/software-house-wroclaw",
"https://kryptonum.eu/pl/blog/rozwoj-technologii-blockchain-nft-i-kryptowalut",
"https://kryptonum.eu/en/blog",
"https://kryptonum.eu/en/portfolio/category/website",
"https://kryptonum.eu/en/web-development/wordpress-websites-development",
"https://kryptonum.eu/pl/portfolio/foodpatka",
"https://kryptonum.eu/en/blog/why-deadlines-save-projects-how-to-stop-wasting-time",
"https://kryptonum.eu/pl/programowanie/dedykowane-strony-www/kielce",
"https://kryptonum.eu/en/portfolio/category/brand-strategy",
"https://kryptonum.eu/pl/portfolio/masaz-po-domowemu",
"https://kryptonum.eu/en/blog/who-is-a-web-developer-what-do-they-do",
"https://kryptonum.eu/pl/blog/czym-jest-branding-i-marketing-oraz-czym-sie-roznia",
"https://kryptonum.eu/pl/blog/przygotowanie-zdjec-na-strone-internetowa",
"https://kryptonum.eu/pl/blog",
"https://kryptonum.eu/pl/kontakt",
"https://kryptonum.eu/pl",
"https://kryptonum.eu/pl/portfolio",
"https://kryptonum.eu/pl/polityka-prywatnosci",
"https://kryptonum.eu/pl/zespol",
"https://kryptonum.eu/pl/regulamin",
"https://kryptonum.eu/pl/blog/co-sklada-sie-na-wizerunek-marki-w-sieci",
"https://kryptonum.eu/pl/marketing-seo",
"https://kryptonum.eu/pl/programowanie/dedykowane-strony-www/gorzow-wielkopolski",
"https://kryptonum.eu/en/blog/category/news",
"https://kryptonum.eu/pl/programowanie/strony-www-wordpress",
"https://kryptonum.eu/en/blog/10-project-management-mistakes-that-sabotage-your-deadlines-how-to-avoid-them",
"https://kryptonum.eu/en/web-development/bespoke-e-commerce-development",
"https://kryptonum.eu/en/team/bogumil",
"https://kryptonum.eu/pl/portfolio/esent",
"https://kryptonum.eu/en/blog/what-to-remember-before-launching-a-website",
"https://kryptonum.eu/en/blog/interactive-agency-what-it-does-and-who-should-hire-one",
"https://kryptonum.eu/pl/portfolio/iza-trzeciak",
"https://kryptonum.eu/pl/blog/czym-jest-q-commerce-m-commerce-re-commerce-rodzaje-e-commerce",
"https://kryptonum.eu/en/portfolio/limalogic",
"https://kryptonum.eu/pl/programowanie/software-house-sosnowiec",
"https://kryptonum.eu/pl/portfolio/bio-stopa",
"https://kryptonum.eu/pl/programowanie/aplikacje-internetowe-radom",
"https://kryptonum.eu/pl/blog/ile-kosztuje-identyfikacja-wizualna-firmy",
"https://kryptonum.eu/pl/programowanie/software-house-zielona-gora",
"https://kryptonum.eu/en/portfolio/auto-manufaktura",
"https://kryptonum.eu/en/team/oliwier",
"https://kryptonum.eu/en/team/marcin",
"https://kryptonum.eu/en/portfolio/category/visual-identity",
"https://kryptonum.eu/en/blog/modern-technologies-for-e-commerce-the-best-innovations-for-online-platforms",
"https://kryptonum.eu/pl/blog/nowoczesne-technologie-dla-rynku-e-commerce",
"https://kryptonum.eu/pl/blog/o-czym-pamietac-podczas-tworzenia-stron-internetowych",
"https://kryptonum.eu/en/blog/affiliate-marketing-what-is-it-how-to-make-money-with-affiliate-marketing",
"https://kryptonum.eu/pl/design-branding/projektowanie-stron-internetowych",
"https://kryptonum.eu/en",
"https://kryptonum.eu/pl/design-branding/warsztaty-wizualne",
"https://kryptonum.eu/en/terms",
"https://kryptonum.eu/pl/blog/jak-zadbac-o-wizerunek-firmy-w-internecie",
"https://kryptonum.eu/pl/zespol/aneta",
"https://kryptonum.eu/pl/blog/tworzenie-aplikacji-low-code-i-no-code",
"https://kryptonum.eu/en/portfolio/woodme",
"https://kryptonum.eu/en/blog/preparing-images-for-your-website-formats-sizes-and-optimization",
"https://kryptonum.eu/pl/programowanie/software-house-bydgoszcz",
"https://kryptonum.eu/pl/portfolio/marek-mateusz",
"https://kryptonum.eu/pl/programowanie/dedykowane-sklepy-internetowe/warszawa",
"https://kryptonum.eu/pl/portfolio/kategoria/marketing",
"https://kryptonum.eu/en/web-development/bespoke-websites-development",
"https://kryptonum.eu/en/portfolio/bloodwise",
"https://kryptonum.eu/en/team",
"https://kryptonum.eu/pl/programowanie/dedykowane-strony-www/strony-internetowe-lodz",
"https://kryptonum.eu/pl/programowanie/dedykowane-strony-www/bialystok",
"https://kryptonum.eu/pl/blog/cyberataki-przyklady-i-rodzaje-atakow-hakerskich-cyberbezpieczenstwo",
"https://kryptonum.eu/en/portfolio/marek-mateusz",
"https://kryptonum.eu/pl/programowanie/dedykowane-strony-www/szczecin",
"https://kryptonum.eu/pl/programowanie/software-house-szczecin",
"https://kryptonum.eu/en/design-branding/web-design",
"https://kryptonum.eu/pl/blog/tworzenie-dzialu-marketingu-w-firmie-jak-zatrudnic-specjaliste-od-marketingu-w-firmie-saas",
"https://kryptonum.eu/en/blog/what-is-low-code-and-no-code-automating-the-process-of-building-software-and-apps",
"https://kryptonum.eu/pl/marketing-seo/strategia-marketingowa",
"https://kryptonum.eu/en/blog/what-is-a-creative-brief-and-how-to-write-one-the-definition-of-a-marketing-brief",
"https://kryptonum.eu/en/business-strategy/strategic-workshops",
"https://kryptonum.eu/pl/blog/kim-jest-web-developer-czym-sie-zajmuje",
"https://kryptonum.eu/en/blog/what-is-seo-search-engine-optimization",
"https://kryptonum.eu/pl/portfolio/kancelaria-nowakowski",
"https://kryptonum.eu/pl/programowanie/aplikacje-internetowe-szczecin",
"https://kryptonum.eu/pl/blog/automatyzacja-procesu-komunikacji-z-klientami",
"https://kryptonum.eu/en/blog/website-loading-speed-what-it-is-how-to-improve-it",
"https://kryptonum.eu/pl/programowanie/aplikacje-internetowe-wroclaw",
"https://kryptonum.eu/pl/blog/jak-zbudowac-biznes-10-praktycznych-wskazowek",
"https://kryptonum.eu/pl/blog/co-to-jest-remarketing",
"https://kryptonum.eu/en/design-branding",
"https://kryptonum.eu/pl/programowanie/aplikacje-internetowe-gdansk",
"https://kryptonum.eu/pl/programowanie/dedykowane-strony-www/strony-internetowe-poznan",
"https://kryptonum.eu/pl/programowanie/software-house-opole",
"https://kryptonum.eu/pl/marketing-seo/prowadzenie-social-media",
"https://kryptonum.eu/pl/portfolio/baza-vintage",
"https://kryptonum.eu/pl/design-branding",
"https://kryptonum.eu/en/blog/what-are-the-stages-of-website-development-a-behind-the-scenes-look-at-building-a-website",
"https://kryptonum.eu/pl/programowanie/software-house-katowice",
"https://kryptonum.eu/en/business-strategy",
"https://kryptonum.eu/pl/blog/jak-wyglada-wspolpraca-z-agencja-interaktywna",
"https://kryptonum.eu/pl/blog/czym-jest-afiliacja-i-czy-warto-w-nia-zainwestowac-marketing-afiliacyjny",
"https://kryptonum.eu/pl/blog/jakie-sa-etapy-tworzenia-strony-internetowej",
"https://kryptonum.eu/pl/programowanie/dedykowane-strony-www/olsztyn",
"https://kryptonum.eu/pl/blog/co-to-jest-rebranding",
"https://kryptonum.eu/en/blog/what-is-rebranding-and-when-does-your-business-need-it",
"https://kryptonum.eu/pl/zespol/bartek",
"https://kryptonum.eu/pl/blog/czym-sa-warsztaty-produktowe-product-design-workshop",
"https://kryptonum.eu/pl/programowanie/software-house-rzeszow",
"https://kryptonum.eu/en/team/oleksandr",
"https://kryptonum.eu/pl/marketing-seo/seo-pozycjonowanie-stron-internetowych",
"https://kryptonum.eu/pl/zespol/maciek",
"https://kryptonum.eu/pl/programowanie/software-house-torun",
"https://kryptonum.eu/pl/programowanie/aplikacje-internetowe-warszawa",
"https://kryptonum.eu/en/blog/when-to-say-noprotecting-your-web-projects-without-losing-clients",
"https://kryptonum.eu/pl/programowanie/software-house-gdansk",
"https://kryptonum.eu/en/team/aneta",
"https://kryptonum.eu/pl/blog/kategoria/news",
"https://kryptonum.eu/pl/portfolio/vitamingo",
"https://kryptonum.eu/en/portfolio/around-the-coffee",
"https://kryptonum.eu/pl/zespol/oleksandr",
"https://kryptonum.eu/pl/blog/czym-jest-identyfikacja-wizualna-firmy",
"https://kryptonum.eu/en/blog/what-is-a-brand-s-visual-identity",
"https://kryptonum.eu/pl/programowanie/dedykowane-sklepy-internetowe",
"https://kryptonum.eu/en/blog/what-are-branding-and-marketing-how-do-they-differ",
"https://kryptonum.eu/pl/portfolio/automanufaktura",
"https://kryptonum.eu/pl/design-branding/identyfikacja-wizualna-logo",
"https://kryptonum.eu/pl/blog/strona/2",
"https://kryptonum.eu/pl/blog/strona/3",
"https://kryptonum.eu/pl/blog/strona/4",
"https://kryptonum.eu/en/blog/page/2",
"https://kryptonum.eu/en/blog/page/3",
"https://kryptonum.eu/en/blog/page/4",
"https://kryptonum.eu/pl/blog/kategoria/technologia/strona/2",
"https://kryptonum.eu/pl/blog/kategoria/biznes/strona/2",
"https://kryptonum.eu/en/blog/category/technology/page/2",
"https://kryptonum.eu/en/blog/category/business/page/2",
"https://kryptonum.eu/pl/portfolio/strona/2",
"https://kryptonum.eu/pl/portfolio/strona/3",
"https://kryptonum.eu/pl/portfolio/strona/4",
"https://kryptonum.eu/en/portfolio/page/2",
"https://kryptonum.eu/en/portfolio/page/3",
"https://kryptonum.eu/pl/portfolio/kategoria/identyfikacja-wizualna/strona/2",
"https://kryptonum.eu/pl/portfolio/kategoria/strategia-marki/strona/2",
"https://kryptonum.eu/pl/portfolio/kategoria/strategia-marki/strona/3",
"https://kryptonum.eu/pl/portfolio/kategoria/strona-internetowa/strona/2",
"https://kryptonum.eu/pl/portfolio/kategoria/strona-internetowa/strona/3",
"https://kryptonum.eu/pl/portfolio/kategoria/marketing/strona/2",
"https://kryptonum.eu/en/portfolio/category/website/page/2",
"https://kryptonum.eu/en/portfolio/category/website/page/3",
"https://kryptonum.eu/en/portfolio/category/brand-strategy/page/2",
"https://kryptonum.eu/en/portfolio/category/brand-strategy/page/3",
"https://kryptonum.eu/en/portfolio/category/visual-identity/page/2"
],
"totalUrls": 300
}
