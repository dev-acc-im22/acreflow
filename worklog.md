---
Task ID: 1
Agent: Main Architect
Task: AcreFlow Real Estate Platform - Complete Build

Work Log:
- Designed and implemented Blue Monochrome design system with Navy (#0A192F), Royal Blue (#1E40AF), Sky Blue (#DBEAFE), Slate (#64748B)
- Configured Montserrat typography (weights 300-800)
- Created CSS custom properties for light/dark themes
- Built 16 React components for the full platform
- Created Zustand store for SPA navigation and state management
- Created comprehensive TypeScript type definitions
- Generated mock data with 18 property listings across all categories
- Built API route with filtering, sorting, and pagination
- Generated brand logo and property images using AI

Stage Summary:
- Complete AcreFlow real estate marketplace with 60 features
- Files created: 16 component files, types, store, mock-data, API route, updated layout/globals/page
- All lint checks pass, dev server compiles successfully
- Platform sections: Hero Search, Services, Featured Properties, Why AcreFlow, Market Intel, App CTA, Search Results, Property Detail, EMI Calculator, Post Property, Lead Center, Comparison Tray

---
## Task ID: W1-A - SearchResults Enhancement Agent
### Work Task
Upgrade SearchResults.tsx with 7 features: Compare checkbox (T1), Share clipboard (T6), Wishlist heart (T5), Map view toggle (T17), Load More pagination (T18), Breadcrumb navigation (T25), Recently Viewed tracking (T29).

### Work Summary
All 7 features implemented in `src/components/acreflow/SearchResults.tsx`:

**T1 - Add to Compare:** Added `GitCompareArrows` icon button on each property card's image area (bottom-right). When `isInComparison(id)` is true, shows filled `bg-royal text-white` active style. Calls `toggleComparison(listing)` with `e.stopPropagation()`. A comparison badge count appears in the top bar when `comparisonList` has items.

**T6 - Share Functionality:** Replaced dead share button with real clipboard copy. On click, builds URL via `window.location.origin + '?property=' + listing.id`, calls `navigator.clipboard.writeText()`, then shows sonner toast "Link copied to clipboard!".

**T5 - Wishlist Heart:** Replaced dead heart icon with working toggle. When `isInWishlist(id)` → Heart filled red (`fill-red-500 text-red-500`), otherwise outline. Calls `toggleWishlist(id)` with `e.stopPropagation()`. Shows toast "Saved to Shortlist!" or "Removed from Shortlist".

**T17 - Map View Toggle:** Added `viewMode` local state (`'list' | 'map'`). Grid3X3 and Map buttons now toggle between views. When 'map', shows a `MapPlaceholderView` component with: cream background, SVG grid pattern, simulated road lines, property markers positioned in a CSS pattern (12 positions), each marker showing price tag on hover.

**T18 - Load More Pagination:** Shows only 6 properties initially (`visibleCount` state). "Load More Properties" button at bottom when `filteredListings.length > visibleCount`. Button styled with `w-full py-3 rounded-xl border-2 border-dashed border-royal/30 text-royal font-semibold hover:bg-royal/5`. On click increments by 6.

**T25 - Breadcrumb Navigation:** Added breadcrumb bar before category tabs: "Home > Buy / Rent / Commercial > Chennai > {query or 'All Properties'}". Each segment clickable: Home → `setView('home')`, category links → `setFilters({category})`. Active category highlighted with `text-navy font-medium`. Separated with `ChevronRight` icons.

**T29 - Recently Viewed Tracking:** When property card is clicked (in `handleCardClick`), calls `addToRecentlyViewed(property)` before navigating to detail view.

**Lint:** All checks pass. Dev server compiles successfully with 0 errors.

---
## Task ID: W1-B - PropertyDetail Enhancement Agent
### Work Task
Upgrade PropertyDetail.tsx with 12 features: Fix mobile overlap (T3), Wire Contact/WhatsApp (T4), Share clipboard (T6), Wishlist heart (T5), Compare button (T1), Schedule Visit dialog (T12), Lead Capture modal (T13), Price Trend chart (T14), Owner Details card (T15), Image Thumbnail Strip (T16), Carousel arrows mobile (T23), Quick Enquiry form (T28).

### Work Summary
All 12 features implemented in `src/components/acreflow/PropertyDetail.tsx`:

**T3 - Fix Mobile Bottom Overlap:** Changed sticky action bar from `fixed bottom-0` to `fixed bottom-16 md:bottom-4` so it sits above MobileNav on mobile. Increased main content padding from `pb-24` to `pb-36 md:pb-24`.

**T4 - Wire Contact/WhatsApp:** Contact Seller button now opens a lead capture dialog (see T13). WhatsApp button opens `https://wa.me/{cleanPhone}?text=...` using `window.open()` with a pre-filled message including property title and locality. Uses `property.ownerPhone.replace(/\D/g, '')` to clean phone number.

**T6 - Actual Share:** Share button calls `navigator.clipboard.writeText(window.location.href)` then shows `toast.success('Link copied!')`. Includes error fallback with `toast.error('Failed to copy link')`.

**T5 - Working Wishlist Heart:** Uses `isInWishlist(property.id)` from store for initial state (derived, no local state needed). On click calls `toggleWishlist(property.id)`. Heart shows `fill-red-500 text-red-500` when saved, outline `text-slate-accent` when not. Toast shows "Saved to Shortlist!" or "Removed from Shortlist".

**T1 - Add to Compare:** Added `GitCompareArrows` icon button in top-right actions bar. Uses `isInComparison(property.id)` for active state. Calls `toggleComparison(property)` on click. Also added a "Compare" button in the sticky action bar (visible on sm+ screens). Active state: `bg-royal text-white`. Toast confirms action.

**T12 - Schedule Visit Dialog:** Inline `Dialog` component with: date picker (`<input type="date">` with min set to today), time slot selection (Morning 9-12, Afternoon 2-5, Evening 5-7) as tappable cards, Name and Phone inputs. "Confirm Visit" button validates all fields and shows `toast.success('Visit scheduled!')`. Form resets after submit.

**T13 - Lead Capture / Contact Modal:** Contact Seller button opens a Dialog with: "Get Owner Details" heading, Name input, Phone input, "I'm interested in" textarea (pre-filled with property title/locality), "Get Contact Details" submit button. On submit: validates fields, shows toast "Owner contact details sent to your phone!", then opens `tel:{property.ownerPhone}` via `window.open()`. Includes a "Schedule Visit" button inside that opens the schedule visit dialog, pre-filling name/phone from the contact form.

**T14 - Price Trend Mini Chart:** Added `PriceTrendChart` sub-component after amenities section. Imports `mockPriceTrends` from `@/lib/mock-data`. Uses `property.locality` to find matching data (falls back to Anna Nagar). SVG line chart shows last 6 months with gradient fill, data point circles, month labels, and first/last price annotations. Stats panel shows "Avg Price: ₹X/sqft" and "↑ X% YoY" with green/red coloring.

**T15 - Owner Details Card:** "About the Owner/Agent" card after price trend. Shows: first-letter avatar circle (bg-royal/10), ownerName, "Property Owner" or "Agent" label (based on `directFromOwner`), verified badge with `BadgeCheck` icon if `property.verified`, response time "Usually responds within 1 hour", "View All Listings" button.

**T16 - Image Thumbnail Strip:** Horizontal row of 16×16 rounded thumbnails below main image carousel. Uses `property.images` if multiple exist; otherwise generates 5 placeholder thumbnails with Camera icon on `bg-muted`. Active thumbnail: `border-2 border-royal ring-2 ring-royal/20`, inactive: `border border-border`. Clicking sets `currentImageIndex`.

**T23 - Carousel Arrows Mobile Visibility:** Changed arrow buttons from `opacity-0 group-hover:opacity-100` to `opacity-100 md:opacity-0 md:group-hover:opacity-100`. Arrows are always visible on mobile (no hover state on touch), but retain hover-to-show behavior on desktop.

**T28 - Quick Enquiry Inline Form:** Desktop-only (`hidden lg:block`) enquiry form card before similar properties section. Card with cream background, "Quick Enquiry" heading, pre-filled interest message, Name + Phone inputs in a row, "Enquire Now" button. On submit: validates fields and shows `toast.success('Enquiry sent successfully!')`. Uses `bg-cream rounded-xl p-4 border` styling.

**New imports added:** `GitCompareArrows`, `BadgeCheck`, `Send` from lucide-react; `Input`, `Label`, `Textarea`, `Dialog*` from shadcn/ui; `mockPriceTrends` from mock-data; `useMemo` from React.

**Lint:** All checks pass (0 errors, 0 warnings). Dev server compiles successfully.

---
## Task ID: W1-C - PostPropertyWizard, Footer, MobileNav Enhancement Agent
### Work Task
Upgrade three exclusive files: PostPropertyWizard.tsx (T2 — wire to API), Footer.tsx (T10 — wire links), MobileNav.tsx (T24 — iOS safe area).

### Work Summary

**PostPropertyWizard.tsx (T2 — Wire to API):**
- Added `formatPriceLabel` helper function outside component that formats price as "₹X Lakh", "₹X.XX Cr", or "₹X,000/mo" based on category
- Replaced toast-only `handleSubmit` with full async API POST to `/api/listings?XTransformPort=3000`
- Builds complete `PropertyListing` object from form state with ALL required fields:
  - `id`: `prop-${Date.now()}`, `ownerId`: `owner-${Date.now()}`
  - category, propertyType, title, description (same as title)
  - price from expectedPrice/monthlyRent, priceLabel from formatPriceLabel
  - bhk (studio→0), bathrooms, balconies, carpetArea, furnishing
  - possessionStatus, ageOfProperty
  - locality, city (defaults 'Chennai'), state ('Tamil Nadu'), address
  - lat: 13.0827, lng: 80.2707 (default Chennai coords)
  - images: [], amenities from selectedAmenities
  - verified: false, reraRegistered: !!reraId, directFromOwner: true
  - ownerName, ownerPhone from form, createdAt/updatedAt: ISO string
- Added validation for required fields (title, propertyType, ownerName, ownerPhone)
- Success toast: "Property posted successfully! It will be visible after verification."
- Error handling for non-ok responses and network errors
- Imported `PropertyListing` type from `@/types`

**Footer.tsx (T10 — Wire links):**
- Imported `useAcreFlowStore` from `@/lib/store`
- Property Type links converted from `<a href="#">` to `<button>` elements with click handlers
- Created `PROPERTY_TYPE_LINKS` mapping: Apartments→'apartment', Villas→'villa', Plots→'plot', Commercial→'commercial-office', PG/Hostels→'pg', Office Space→'commercial-office'
- Each property type button calls `setFilters({ category, propertyTypes: [mappedType] })` + `setView('search')`
- City links converted to buttons calling `setSelectedCity(city)` + `setView('search')`
- Company links converted to buttons; "Contact" navigates to lead-center
- Social icons updated with proper URLs: Instagram, Twitter, Facebook, LinkedIn, YouTube (all with `target="_blank" rel="noopener noreferrer"`)
- App Store/Google Play links kept as `<a href="#">`

**MobileNav.tsx (T24 — iOS safe area):**
- Added iOS safe area padding via `style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}` on nav element
- Updated nav items to: Search (Search icon), Shortlist (Heart icon), Post (PlusCircle icon), Activity (Bell icon), Profile (User icon)
- Activity tab shows unread notification count badge from store's `unreadCount()`
- All items use Blue Monochrome palette with Montserrat font styling
- Post navigates to 'post-property', Profile navigates to 'lead-center', Search navigates to 'search'

**Lint:** All checks pass (0 errors, 0 warnings). Dev server compiles successfully.

---
## Task ID: W1-D - New Components Agent (Testimonials, FAQ, BuilderProjects, TopAgents, UrgencyBanner)
### Work Task
Create 5 new components for AcreFlow: Testimonials.tsx (T7), FAQ.tsx (T8), BuilderProjects.tsx (T26), TopAgents.tsx (T30), UrgencyBanner.tsx (T21). All use Blue Monochrome palette, Montserrat font, lucide-react icons, and 'use client' directive.

### Work Summary

**Testimonials.tsx (T7):**
- Section with py-16 bg-white, max-w-7xl container
- Heading "What Our Customers Say" + subtitle "Real stories from real homeowners"
- 3-column responsive grid (grid-cols-1 md:grid-cols-3 gap-6)
- 6 testimonial cards with: first-letter avatar circle (bg-sky, text-royal), name/role, star rating (Star icons from lucide, filled/empty), italic quote, property info line
- All mock data as specified: Priya Sharma, Rajesh Kumar, Amit Patel, Sneha Reddy, Dr. Venkat, Meera Krishnan

**FAQ.tsx (T8):**
- Section with py-16 bg-cream, max-w-3xl container
- Heading "Frequently Asked Questions"
- Uses shadcn Accordion (type="single" collapsible) with 8 FAQ items
- AccordionTrigger styled text-sm font-medium text-navy, AccordionContent text-sm text-slate-accent leading-relaxed
- All 8 Q&A pairs implemented as specified

**BuilderProjects.tsx (T26):**
- Section with py-16 bg-white, max-w-7xl container
- Header with title + "View All Projects" Button variant="outline"
- 3-column responsive grid with 6 builder project cards
- Each card: property-card hover lift, gradient image area with Building2 icon, builder name, project name, MapPin location, price range (text-royal font-bold), config badges (bg-sky rounded-full), Verified/RERA badges, "View Details →" link
- All 6 projects: Prestige Belle Vue, Hiranandani Egattur, VIP Golf Avenue, Casagrand Florenza, Purva Windermere, Akshaya Today

**TopAgents.tsx (T30):**
- Section with py-16 bg-cream, max-w-7xl container
- Heading "Trusted Agents & Builders" + subtitle
- 4-column responsive grid (grid-cols-2 md:grid-cols-4)
- 4 agent cards: Building2 avatar (bg-sky), name, experience, deals count, star rating, "Contact" Button (bg-royal text-white)
- All 4 agents: Suresh Properties, Chennai Homes, Green Valley Realty, Metro Builders

**UrgencyBanner.tsx (T21):**
- Compact section py-3 bg-navy
- Flex centered content: Zap icon (text-amber-400), emoji + offer text (text-white), "Post Now" Button (bg-white text-navy)

**Files created (5):**
- `src/components/acreflow/Testimonials.tsx`
- `src/components/acreflow/FAQ.tsx`
- `src/components/acreflow/BuilderProjects.tsx`
- `src/components/acreflow/TopAgents.tsx`
- `src/components/acreflow/UrgencyBanner.tsx`

**Lint:** All checks pass (0 errors, 0 warnings). Dev server compiles successfully.

---
## Task ID: W1-E - Enhancement Agent (MarketIntel, ServiceIcons, LeadCenter)
### Work Task
Upgrade three exclusive components: MarketIntel.tsx (T9 — city-aware), ServiceIcons.tsx (T11 — service detail modals), LeadCenter.tsx (T27 — lead status management).

### Work Summary

**MarketIntel.tsx (T9 — City-aware):**
- Imported `useAcreFlowStore` and reads `selectedCity` to dynamically switch all displayed data
- Created comprehensive `CITY_DATA` record with data for 5 cities: Chennai (existing Anna Nagar data preserved), Mumbai (trends 12000→14200, avg 14200, 15.2% YoY), Delhi (8500→10200, avg 10200, 12.8%), Bangalore (7500→9800, avg 9800, 22.1%), Hyderabad (5500→7200, avg 7200, 25.3%)
- Each city has 3 localities with unique trend data, insights ratings, and nearby places in `LOCALITY_DATA` record
- Tab labels dynamically show the selected city's localities (e.g., Mumbai: Andheri, Bandra, Powai)
- Price chart Y-axis auto-scales based on min/max of each city's data (via dynamic `toSvgY` function)
- Locality insights grid and nearby places list update with city-specific ratings and locations
- City-level summary bar shows avg price and YoY growth for the selected city
- Heading shows "Showing data for {city}" with MapPin icon
- Fallback: unknown cities default to Chennai data; unknown localities generate randomized data

**ServiceIcons.tsx (T11 — Service detail modals):**
- Removed dead `setView('home')` handler; replaced with `selectedService` local state (number | null)
- Added Dialog from shadcn/ui with `max-w-lg mx-auto`
- Each service card click opens a Dialog with:
  - Gradient accent bar at top (royal → sky)
  - Large service icon (w-14 h-14 bg-sky rounded-xl)
  - Service name (text-lg font-bold text-navy) + subtitle "Professional service by AcreFlow partners"
  - Full description paragraph (text-sm text-slate-accent)
  - Features list in cream rounded box: 4 bullet points with CheckCircle2 icons (text-success)
  - Starting price in sky/50 rounded box (text-lg font-bold text-royal)
  - Two CTA buttons: "Get Started" (bg-royal text-white with ArrowRight) + "Learn More" (outline)
- All 6 service details implemented with specific pricing and features as specified
- Removed unused `useAcreFlowStore` import (no longer needed)
- Added proper `&apos;` escaping for apostrophes in JSX

**LeadCenter.tsx (T27 — Lead status management):**
1. **Status Change Dropdown:** Added a Filter icon Select trigger on each lead card's right action column. Uses shadcn Select with Hot (red), Warm (amber), Cold (blue) options. On change calls `onStatusChange` → updates lead in state + toast "Lead status updated to {Status}"
2. **Delete Lead:** Added Trash2 icon button (red-400 → red-600 on hover). Clicking triggers `window.confirm` with lead name. On confirm: removes from leads array + toast "Lead deleted"
3. **Edit Lead:** Added Pencil icon button (highlighted in edit mode). Clicking toggles inline edit mode: buyerName and buyerPhone become editable Input fields. Save (Check icon, bg-royal) validates non-empty and updates state + toast. Cancel (X icon) reverts changes and exits edit mode.
4. **Click-to-filter Stat Cards:** All 4 stat cards (Total, Hot, Warm, Cold) are now clickable with cursor-pointer. Clicking sets `activeTab` to the corresponding status. Active stat card shows a colored ring highlight (royal for all, red for hot, amber for warm, blue for cold).
- Refactored `LeadCard` and `LeadList` components to accept `onStatusChange`, `onDeleteLead`, and `onEditLead` callback props
- All new icons imported: Pencil, Trash2, Check, X from lucide-react

**Lint:** All checks pass (0 errors, 0 warnings). Dev server compiles successfully.

---
## Task ID: W2-A - Header, WhyAcreFlow, HeroSearch Enhancement Agent
### Work Task
Upgrade three exclusive files: Header.tsx (T19 — notification bell, T20 — dark mode toggle), WhyAcreFlow.tsx (T22 — remove duplicate stats), HeroSearch.tsx (T22 — polish trust stats).

### Work Summary

**Header.tsx (T19 — Notification Bell, T20 — Dark Mode Toggle):**

T19 - Notification Bell:
- Added `Bell`, `Check` imports from lucide-react, `useRef` and `useEffect` from React
- Destructured `unreadCount`, `showNotificationPanel`, `setShowNotificationPanel`, `notifications`, `markNotificationRead` from store
- Added notification button (hidden on mobile, `hidden md:flex`) with Bell icon before User icon
- Red circle badge (`bg-red-500 text-white text-[10px] font-bold`) shows `unreadCount()` when > 0
- On click: toggles `showNotificationPanel`
- Dropdown panel: `absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border shadow-xl z-50`
  - Header: "Notifications" title + "Mark all as read" link (with Check icon, calls `markNotificationRead` for all unread)
  - Notification list (`max-h-72 overflow-y-auto acreflow-scrollbar`): each item is a button with:
    - Unread blue dot indicator (w-2.5 h-2.5 rounded-full bg-royal) if `!read`
    - Title (text-sm font-medium text-navy truncate)
    - Message (text-xs text-slate-accent line-clamp-2)
    - Time (text-xs text-slate-light mt-1)
    - On click: `markNotificationRead(id)`
  - Empty state: "No new notifications" centered text
- Close on outside click via `useEffect` with `mousedown` event listener on document, using `notifPanelRef`

T20 - Dark Mode Toggle:
- Added `Sun`, `Moon` imports from lucide-react
- Destructured `darkMode`, `toggleDarkMode` from store
- Button: `w-10 h-10 rounded-full flex items-center justify-center hover:bg-cream transition` (hidden on mobile)
- Shows Sun icon when `darkMode` is true (to switch to light), Moon icon when false (to switch to dark)
- `aria-label` for accessibility

**WhyAcreFlow.tsx (T22 — Remove Duplicate Stats):**
- Removed the entire `stats` array and stats counter row (the 4 stat cards: 10,000+, 50+, 5,000+, ₹0)
- Added descriptive subtitle under main heading: "Experience real estate the way it should be — transparent, efficient, and completely broker-free."
- Added intro paragraph before feature grid: "At AcreFlow, we believe finding your dream property should be simple and stress-free..."
- Intro paragraph styled: `max-w-2xl mx-auto text-center text-slate-accent mb-10 text-sm leading-relaxed`
- Changed feature grid from `lg:grid-cols-4` to `lg:grid-cols-3` for better 6-card layout (2×3 on large screens)
- Kept all 6 feature cards unchanged

**HeroSearch.tsx (T22 — Polish Trust Stats):**
- Kept the trust stats row as the ONLY place showing stats
- Each stat now uses `px-4 sm:px-6 md:px-8` for responsive padding
- Label changed to uppercase with tracking: `text-xs text-white/70 font-medium tracking-wide uppercase`
- Added `Fragment` import from React
- Added thin white separator between stats: `w-px h-10 bg-white/10` rendered between each stat (not after the last)
- Used `Fragment` with `key` prop to wrap stat + separator in the map

**Files modified (3):**
- `src/components/acreflow/Header.tsx`
- `src/components/acreflow/WhyAcreFlow.tsx`
- `src/components/acreflow/HeroSearch.tsx`

**Lint:** All checks pass (0 errors, 0 warnings). Dev server compiles successfully.

---
## Task ID: W2-B - Final Code Cleanup Agent
### Work Task
Final code cleanup for AcreFlow: remove `ignoreBuildErrors` from next.config.ts (T32), verify/clean unused types in src/types/index.ts (T31), add safe-area, dark mode scrollbar, and page transitions to globals.css.

### Work Summary

**TASK 1 — next.config.ts (T32):**
- Removed `typescript: { ignoreBuildErrors: true }` block from config
- Retained `output: "standalone"` and `reactStrictMode: false`
- Dev server restarted successfully after config change

**TASK 2 — src/types/index.ts (T31 — Clean unused types):**
- Verified all type exports with grep across the project
- All listed types confirmed as needed or part of the type system:
  - `ListingCategory`, `PropertyType`, `Furnishing`, `PossessionStatus` — imported by PostPropertyWizard.tsx
  - `ListingStatus`, `VerificationStatus` — type definitions part of the type system (kept as per task directive)
  - `LeadStatus` — imported by LeadCenter.tsx
  - `PropertyListing` — imported by 8+ files (components, API route, store, mock-data)
  - `SearchFilters` — imported by store.ts, SearchResults.tsx
  - `Lead` — imported by mock-data.ts, LeadCenter.tsx
  - `LocalityInsight`, `PriceTrend` — imported by MarketIntel.tsx, mock-data.ts
  - `AppView` — imported by store.ts
  - `AMENITIES`, `CITIES` — imported by PostPropertyWizard.tsx
  - `BHK_OPTIONS`, `defaultFilters` — exported constants kept for potential future use
- **No changes made** — all types retained

**TASK 3 — src/app/globals.css additions:**
1. **Safe area support** — Added `@supports` block after `@layer base` for `.safe-bottom` class using `env(safe-area-inset-bottom)`
2. **Dark mode chart colors** — Verified `.dark` section already has correct chart colors: `--chart-1: #DBEAFE`, `--chart-2: #2563EB`, `--chart-3: #1E40AF`, `--chart-4: #64748B`, `--chart-5: #0A192F` — no changes needed
3. **Page transition classes** — Added `.page-enter` (opacity 0, translateY 10px) and `.page-enter-active` (opacity 1, translateY 0, 0.3s ease transition) after existing animations
4. **Dark mode scrollbar** — Added `.dark .acreflow-scrollbar::-webkit-scrollbar-thumb` with `#334155` background and hover state with `#475569`

**Files modified (2):**
- `next.config.ts` — removed `ignoreBuildErrors`
- `src/app/globals.css` — added safe-area, page transitions, dark scrollbar styles

**Lint:** All checks pass (0 errors, 0 warnings). Dev server compiles and restarts successfully.
---
Task ID: W3-HeaderRedesign
Agent: Main Architect
Task: Redesign home page header to match NoBroker reference image

Work Log:
- Analyzed reference image using VLM (NoBroker-style header design)
- Completely redesigned Header.tsx: removed blue top bar, created clean single white header
- Header now has: Logo (left), EMI Calculator link (center-desktop), Notification bell + Dark mode + Login/Signup + Post Property CTA + Hamburger (right)
- Integrated category tabs (Buy, Rent, Commercial, PG/Co-living, Plots/Land) directly below header bar
- Integrated search bar below tabs: City selector dropdown + search input + blue search button
- City selector shows dropdown with all cities, active city highlighted with check mark
- Search bar has auto-suggest dropdown for localities and landmarks
- Category tabs show active blue underline for current filter category
- Redesigned HeroSearch.tsx: removed blue gradient hero, replaced with clean gray-50 content section
- HeroSearch now shows headline, subheadline, trust stats (mobile grid / desktop horizontal), and quick explore links
- Mobile menu (Sheet) updated with new category tabs, city selector, EMI Calculator link
- All notifications, dark mode, and city dropdown functionality preserved

Stage Summary:
- Header completely redesigned to match NoBroker reference layout
- Files modified: src/components/acreflow/Header.tsx, src/components/acreflow/HeroSearch.tsx
- No changes needed to page.tsx (imports remain the same)
- Lint: All checks pass, dev server compiles successfully, returns HTTP 200

---
Task ID: 2a
Agent: Dark Mode - Layout Components
Task: Add dark: Tailwind classes to Header.tsx, MobileNav.tsx, Footer.tsx, UrgencyBanner.tsx

Work Log:
- Added comprehensive dark mode support using Navy blue palette (#0A192F, #112240, #1D3461, #94A3B8, #64748B, #F1F5F9)
- Header.tsx: Added dark:bg, dark:border, dark:text, dark:hover classes to main header bar, EMI Calculator link, notification bell/button/dropdown panel, dark mode toggle, divider, login/signup buttons, Post Property CTA, mobile menu trigger, mobile nav links, mobile CTA section, category tabs bar, search bar container, city selector/dropdown, auto-suggest dropdown. Did NOT modify the mobile sheet's bg-navy header (already dark-themed).
- MobileNav.tsx: Added dark:bg-[#112240], dark:border-[#1D3461], dark:shadow-none to nav bar. Added dark:text-[#64748B] to inactive icon/text states.
- Footer.tsx: Added border-t border-gray-200 dark:border-[#1D3461] to main footer for dark mode visual separation (footer bg-navy blends with dark page bg #0A192F). All inner content already dark-themed (text-white, text-slate-light, bg-white/10) — no further changes needed.
- UrgencyBanner.tsx: Added border-b border-white/10 dark:border-[#1D3461] for dark mode separation. Added dark:hover:bg-gray-200 to Post Now button.

Files modified (4):
- src/components/acreflow/Header.tsx
- src/components/acreflow/MobileNav.tsx
- src/components/acreflow/Footer.tsx
- src/components/acreflow/UrgencyBanner.tsx

Lint: All checks pass (0 errors, 0 warnings). Dev server compiles successfully.

---
## Task ID: 2b - Dark Mode: Home Sections Part 1
### Agent: Dark Mode - Home Sections Part 1
### Work Task
Add dark mode support to HeroSearch.tsx, ServiceIcons.tsx, FeaturedProperties.tsx, and WhyAcreFlow.tsx using `dark:` Tailwind classes with the AcreFlow dark color palette.

### Work Summary

**HeroSearch.tsx:**
- Section: `bg-white` → `dark:bg-[#0A192F]`, border → `dark:border-[#1D3461]`
- Headline: `text-navy` → `dark:text-white`, span → `dark:text-[#60A5FA]`
- Subheadline: `text-gray-500` → `dark:text-[#94A3B8]`
- Trust stats (mobile & desktop): icon `dark:text-[#60A5FA]`, value `dark:text-white`, label `dark:text-[#64748B]`, icon bg `dark:bg-[#1D3461]/50`, divider `dark:bg-[#1D3461]`
- Quick Explore cards: `dark:bg-[#112240]`, border `dark:border-[#1D3461]`, icon bg `dark:bg-[#1D3461]/50`, icon `dark:text-[#60A5FA]`, label `dark:text-[#94A3B8]`, chevron `dark:text-[#64748B]`
- "Quick Explore" heading: `dark:text-[#64748B]`

**ServiceIcons.tsx:**
- Section: `bg-cream` → `dark:bg-[#0A192F]`
- Headings: `text-navy` → `dark:text-white`, `text-slate-accent` → `dark:text-[#94A3B8]`
- Service cards: `dark:bg-[#112240]`, border `dark:border-[#1D3461]`, icon circle `dark:bg-[#1D3461]`, icon `dark:text-[#60A5FA]`, title `dark:text-white`, desc `dark:text-[#94A3B8]`
- Dialog: `dark:bg-[#112240]`, all text colors, feature list bg `dark:bg-[#0A192F]`, price box `dark:bg-[#1D3461]/50`, Learn More button `dark:text-white` + `dark:hover:bg-[#1D3461]`

**FeaturedProperties.tsx:**
- Section: `bg-white` → `dark:bg-[#0A192F]`
- Heading: `text-navy` → `dark:text-white`, subtitle `dark:text-[#94A3B8]`
- Cards: `dark:bg-[#112240]`, border `dark:border-[#1D3461]`, image bg `dark:bg-[#1D3461]`
- Action buttons (heart/share): `dark:bg-[#0A192F]/90`, `dark:hover:bg-[#112240]`, icons `dark:text-[#94A3B8]`
- Card body: price `dark:text-[#60A5FA]`, title `dark:text-white`, location/specs/footer `dark:text-[#94A3B8]`, divider `dark:border-[#1D3461]`, view details `dark:text-[#60A5FA]`

**WhyAcreFlow.tsx:**
- Section: `bg-white` → `dark:bg-[#0A192F]`
- Headings & paragraphs: `text-navy` → `dark:text-white`, `text-slate-accent` → `dark:text-[#94A3B8]`
- Feature cards: `dark:bg-[#112240]`, border `dark:border-[#1D3461]`, icon bg `dark:bg-[#1D3461]`, icon `dark:text-[#60A5FA]`, title `dark:text-white`, desc `dark:text-[#94A3B8]`

**Lint:** All checks pass (0 errors, 0 warnings). Dev server compiles successfully.

---
## Task ID: 2d - Dark Mode: Home Sections Part 3
### Agent: Dark Mode - Home Sections Part 3
### Work Task
Add dark mode support to MobileAppCTA.tsx, SkeletonLoader.tsx (create new), ComparisonTray.tsx, and globals.css dark skeleton-shimmer variant. Check page.tsx for any dark-specific adjustments.

### Work Summary

**MobileAppCTA.tsx:**
- App store buttons: `bg-white` → `dark:bg-[#112240]`, `hover:bg-white/90` → `dark:hover:bg-[#1D3461]`
- Store button text/icons: `text-slate-accent` → `dark:text-[#94A3B8]`, `text-navy` → `dark:text-white`
- Phone mockup: `bg-white/10` → `dark:bg-white/5`, border `dark:border-white/10`
- Phone inner bg: `bg-sky` → `dark:bg-[#1D3461]`
- Brand text: `text-navy` → `dark:text-white`
- Icon accents: `text-royal` → `dark:text-[#60A5FA]`

**SkeletonLoader.tsx (NEW FILE):**
- Created comprehensive skeleton loading components with built-in dark mode support
- `PropertyCardSkeleton` — Single property card skeleton with image, price, title, location, tags, footer
- `PropertyCardGridSkeleton` — Grid of N property card skeletons (default 6, 3-col responsive)
- `SectionTitleSkeleton` — Section heading + subtitle placeholders
- `StatCardSkeleton` — Stat card with icon, value, label placeholders
- `TextLineSkeleton` — Generic text line with configurable width
- `DetailPageSkeleton` — Full property detail page skeleton (breadcrumb, gallery, thumbnails, content, sidebar)
- All skeletons use `skeleton-shimmer` CSS class + dark variants via `dark:bg-[#112240]`, `dark:bg-[#1D3461]`, `dark:border-[#1D3461]`

**ComparisonTray.tsx:**
- Tray container: `bg-white` → `dark:bg-[#112240]`
- Handle bar: `bg-gray-300` → `dark:bg-[#475569]`
- Header border: `dark:border-[#1D3461]`
- Heading: `text-navy` → `dark:text-white`
- Badge: `bg-sky` → `dark:bg-[#1D3461]`, `text-royal` → `dark:text-[#60A5FA]`
- Clear All text: `dark:text-[#94A3B8]`
- Empty state: circle bg `dark:bg-[#1D3461]`, icon `dark:text-[#94A3B8]`, text `dark:text-white`
- Comparison rows: even rows `bg-cream` → `dark:bg-[#0A192F]`, odd rows `bg-white` → `dark:bg-[#112240]`
- Label column: `dark:text-[#94A3B8]`
- Value cells: `text-navy` → `dark:text-white`, highlight bg `dark:bg-success/20`
- Boolean icons (X marks): `text-slate-light` → `dark:text-[#64748B]`
- Property cards: `dark:bg-[#0A192F]`, border `dark:border-[#1D3461]`
- Remove button: `bg-white/90` → `dark:bg-[#112240]`
- Fallback image: `bg-cream` → `dark:bg-[#1D3461]`
- Card content: title `dark:text-white`, location `dark:text-[#94A3B8]`, price `dark:text-[#60A5FA]`
- Amenities chips: `bg-sky` → `dark:bg-[#1D3461]`, `text-royal` → `dark:text-[#60A5FA]`
- "+N more" text: `dark:text-[#94A3B8]`
- Best Value card: `bg-sky/50` → `dark:bg-[#1D3461]/50`, border `dark:border-[#60A5FA]/20`
- Star icon: `dark:text-[#60A5FA]`
- Best Value title: `dark:text-white`, desc `dark:text-[#94A3B8]`

**globals.css:**
- Added `.dark .skeleton-shimmer` animation variant: uses darker gradient colors `#1D3461 25%, #233554 50%, #1D3461 75%`
- Updated `.filter-chip-inactive` with dark mode: `dark:bg-[#112240]`, `dark:text-[#94A3B8]`, `dark:border-[#1D3461]`, `dark:hover:border-[#60A5FA]`, `dark:hover:text-[#60A5FA]`

**page.tsx:**
- Reviewed — no changes needed. Main wrapper uses `bg-background` which already handles dark mode via CSS variables. Comparison floating button uses `bg-navy`/`bg-royal` which are dark-appropriate.

**Files modified (3):**
- `src/components/acreflow/MobileAppCTA.tsx`
- `src/components/acreflow/ComparisonTray.tsx`
- `src/app/globals.css`

**Files created (1):**
- `src/components/acreflow/SkeletonLoader.tsx`

**Lint:** All checks pass (0 errors, 0 warnings). Dev server compiles successfully.

---
## Task ID: 2c - Dark Mode: Home Sections Part 2
### Agent: Dark Mode - Home Sections Part 2
### Work Task
Add dark mode support to MarketIntel.tsx, Testimonials.tsx, FAQ.tsx, BuilderProjects.tsx, and TopAgents.tsx using `dark:` Tailwind classes with the AcreFlow dark color palette.

### Work Summary

**MarketIntel.tsx:**
- Section: `bg-cream` → `dark:bg-[#0A192F]`
- Headings: `text-navy` → `dark:text-white`, `text-slate-accent` → `dark:text-[#94A3B8]`, `text-royal` → `dark:text-[#60A5FA]`
- City summary cards: `bg-white` → `dark:bg-[#112240]`, border `dark:border-[#1D3461]`
- Card titles: `text-navy` → `dark:text-white`
- Insight items: icon bg colors (`bg-emerald-50`, `bg-red-50`, `bg-purple-50`, `bg-amber-50`, `bg-indigo-50`) all → `dark:bg-[#1D3461]`; `bg-sky` → `dark:bg-[#1D3461]`
- Insight icons: `text-royal` → `dark:text-[#60A5FA]`
- StarRating empty stars: `fill-gray-300 text-gray-300` → `dark:fill-[#334155] dark:text-[#334155]`
- Nearby places: `bg-royal` dot → `dark:bg-[#60A5FA]`, `text-navy` → `dark:text-white`, `text-slate-accent` → `dark:text-[#94A3B8]`
- SVG Price Chart:
  - Grid lines: `stroke="#E2E8F0"` converted to className `stroke-slate-200 dark:stroke-[#1D3461]`
  - Y-axis/X-axis text: `className="fill-slate-accent"` → `dark:fill-[#94A3B8]`
  - Data point circles: `fill="#FFFFFF" stroke="#1E40AF"` converted to className `fill-white dark:fill-[#0A192F] stroke-blue-800 dark:stroke-[#60A5FA]`
  - Gradient fills kept as-is (blue tones work well on dark backgrounds)

**Testimonials.tsx:**
- Section: `bg-white` → `dark:bg-[#112240]`
- Testimonial cards: `bg-white` → `dark:bg-[#0A192F]`, border `dark:border-[#1D3461]`
- Avatar circle: `bg-sky` → `dark:bg-[#1D3461]`, text `dark:text-[#60A5FA]`
- Name: `text-navy` → `dark:text-white`, role: `text-slate-accent` → `dark:text-[#94A3B8]`
- Empty stars: `text-gray-200` → `dark:text-[#334155]`
- Quote: `text-slate-accent` → `dark:text-[#94A3B8]`, property info: `text-slate-light` → `dark:text-[#64748B]`

**FAQ.tsx:**
- Section: `bg-cream` → `dark:bg-[#0A192F]`
- Heading: `text-navy` → `dark:text-white`
- Accordion trigger: `text-navy` → `dark:text-white`
- Accordion content: `text-slate-accent` → `dark:text-[#94A3B8]`
- Note: shadcn Accordion `border-border` already has dark CSS variable support

**BuilderProjects.tsx:**
- Section: `bg-white` → `dark:bg-[#112240]`
- Project cards: `bg-white` → `dark:bg-[#0A192F]`, border `dark:border-[#1D3461]`
- Image area gradient: `from-navy/5 to-royal/10` → `dark:from-navy/10 dark:to-royal/20`
- Building2 icon: `text-royal/20` → `dark:text-[#60A5FA]/20`
- Builder name: `text-slate-accent` → `dark:text-[#94A3B8]`
- Project name: `text-navy` → `dark:text-white`
- MapPin & location: `text-slate-accent` → `dark:text-[#94A3B8]`
- Price: `text-royal` → `dark:text-[#60A5FA]`
- Config badges: `bg-sky` → `dark:bg-[#1D3461]`, `text-navy` → `dark:text-white`
- RERA text: `text-slate-accent` → `dark:text-[#94A3B8]`
- View Details: `text-royal` → `dark:text-[#60A5FA]`

**TopAgents.tsx:**
- Section: `bg-cream` → `dark:bg-[#0A192F]`
- Agent cards: `bg-white` → `dark:bg-[#112240]`, border `dark:border-[#1D3461]`
- Avatar circle: `bg-sky` → `dark:bg-[#1D3461]`, icon `dark:text-[#60A5FA]`
- Name: `text-navy` → `dark:text-white`
- Experience: `text-slate-accent` → `dark:text-[#94A3B8]`
- Deals: `text-royal` → `dark:text-[#60A5FA]`
- Empty stars: `text-gray-200` → `dark:text-[#334155]`
- Rating text: `text-slate-accent` → `dark:text-[#94A3B8]`

**Files modified (5):**
- src/components/acreflow/MarketIntel.tsx
- src/components/acreflow/Testimonials.tsx
- src/components/acreflow/FAQ.tsx
- src/components/acreflow/BuilderProjects.tsx
- src/components/acreflow/TopAgents.tsx

**Lint:** All checks pass (0 errors, 0 warnings). Dev server compiles successfully.

---
## Task ID: 2f - Dark Mode: Inner Pages Part 2
### Agent: Dark Mode - Inner Pages Part 2
### Work Task
Add dark mode support to PostPropertyWizard.tsx and LeadCenter.tsx using `dark:` Tailwind classes with the AcreFlow dark color palette.

### Work Summary

**PostPropertyWizard.tsx:**
- Top bar heading: `text-navy` → `dark:text-white`
- Progress step circles (inactive): `bg-muted` → `dark:bg-[#1D3461]`, text `dark:text-[#94A3B8]`, border `dark:border-[#1D3461]`
- Progress step labels: `text-slate-accent` → `dark:text-[#94A3B8]`
- Progress connector lines: `bg-border` → `dark:bg-[#1D3461]`
- Category buttons (inactive): `bg-white text-gray-600 border-gray-300` → `dark:bg-[#112240] dark:text-[#94A3B8] dark:border-[#1D3461]`, hover `dark:hover:border-royal/40 dark:hover:text-white`
- Property type cards (active): `bg-sky/30` → `dark:bg-[#1D3461]/30`, icon/text `dark:text-[#60A5FA]`
- Property type cards (inactive): `border-border` → `dark:border-[#1D3461]`, icon `dark:text-[#94A3B8]`, text `dark:text-white`
- All section labels (`text-navy`): → `dark:text-white`
- All input labels (`text-slate-accent`): → `dark:text-[#94A3B8]`
- Optional text (`text-slate-light`): → `dark:text-[#475569]`
- Price rupee prefix: `text-slate-accent` → `dark:text-[#94A3B8]`
- Card borders (`border-border`): → `dark:border-[#1D3461]`
- Amenities checkboxes (active): `bg-sky/30` → `dark:bg-[#1D3461]/30`, label text `dark:text-white`
- Amenities checkboxes (inactive): border `dark:border-[#1D3461]`
- Upload area border: `dark:border-[#1D3461]`, hover `dark:hover:border-[#60A5FA]`
- Upload icon/text: `text-slate-accent` → `dark:text-[#94A3B8]`, `text-navy` → `dark:text-white`, `text-royal` → `dark:text-[#60A5FA]`
- Thumbnail grid items: `bg-muted` → `dark:bg-[#1D3461]`, border `dark:border-[#1D3461]`
- Plus button for more uploads: `dark:bg-[#1D3461]`, border `dark:border-[#1D3461]`, hover `dark:hover:border-[#60A5FA]`
- Add More Photos button: `dark:border-[#60A5FA]`, `dark:text-[#60A5FA]`, hover `dark:hover:bg-[#1D3461]/30`
- Tips box: `bg-cream` → `dark:bg-[#0A192F]`, heading `dark:text-white`, text `dark:text-[#94A3B8]`
- Review section separators (`bg-border`): → `dark:bg-[#1D3461]`
- Review section headings: `dark:text-white`
- Review labels: `dark:text-[#94A3B8]`
- Review values: `dark:text-white`
- Amenity badges: `bg-sky` → `dark:bg-[#1D3461]`, `text-royal` → `dark:text-[#60A5FA]`
- Confirmation checkbox box: `bg-cream` → `dark:bg-[#0A192F]`, label `dark:text-white`

**LeadCenter.tsx:**
- Top bar heading: `text-navy` → `dark:text-white`, back button `dark:hover:bg-[#1D3461]`
- Stat cards: `bg-white` → `dark:bg-[#112240]`, border `dark:border-[#1D3461]`
- Active stat card ring highlights: `dark:ring-[#60A5FA]/30 dark:border-[#60A5FA]/30`, hot `dark:ring-red-500/30`, warm `dark:ring-amber-500/30`, cold `dark:ring-blue-500/30`
- Stat icon backgrounds: `bg-royal/10` → `dark:bg-[#1D3461]`, `bg-red-50` → `dark:bg-red-900/20`, `bg-amber-50` → `dark:bg-amber-900/20`, `bg-blue-50` → `dark:bg-blue-900/20`
- Stat icon colors: `text-royal` → `dark:text-[#60A5FA]`, `text-red-600` → `dark:text-red-400`, `text-amber-600` → `dark:text-amber-400`, `text-blue-600` → `dark:text-blue-400`

---
## Task ID: 2e - Dark Mode: Inner Pages Part 1
### Agent: Dark Mode - Inner Pages Part 1
### Work Task
Add dark mode support to SearchResults.tsx (remaining card content), PropertyDetail.tsx, and EMICalculator.tsx using `dark:` Tailwind classes with the AcreFlow dark color palette.

### Work Summary

**SearchResults.tsx (remaining property card content area):**
- Compare button (inactive): `bg-white/90 hover:bg-white` → `dark:bg-[#112240]/90 dark:hover:bg-[#112240]`
- Compare icon (inactive): `text-slate-accent` → `dark:text-[#94A3B8]`
- Card price: `text-royal` → `dark:text-[#60A5FA]`
- Card title: `text-navy` → `dark:text-white`
- Card location: `text-slate-accent` → `dark:text-[#94A3B8]`
- Card specs: `text-slate-accent` → `dark:text-[#94A3B8]`
- Card footer border: `border-t border-border` → `dark:border-[#1D3461]`
- Card footer owner: `text-slate-accent` → `dark:text-[#94A3B8]`
- Card "View Details" link: `text-royal` → `dark:text-[#60A5FA]`
- Note: FilterSidebarContent, MapPlaceholderView, CardSkeleton, breadcrumb, tabs, sidebar, top bar, and other sections already had dark mode classes from prior work.

**PropertyDetail.tsx (comprehensive dark mode — 100+ edits):**
- Page wrapper: `bg-cream` → `dark:bg-[#0A192F]`
- Skeleton loader: `bg-cream` → `dark:bg-[#0A192F]`
- Sticky action bar: `bg-white border-t` → `dark:bg-[#112240] dark:border-[#1D3461]`
- Price text: `text-royal` → `dark:text-[#60A5FA]`
- EMI text: `text-slate-accent` → `dark:text-[#94A3B8]`
- Compare button text: `text-royal` → `dark:text-[#60A5FA]`
- Back button: `text-slate-accent hover:text-navy` → `dark:text-[#94A3B8] dark:hover:text-white`
- Action buttons (save/share/compare): `hover:bg-white` → `dark:hover:bg-[#112240]`, `text-slate-accent` → `dark:text-[#94A3B8]`, `text-royal` → `dark:text-[#60A5FA]`
- Image gallery: `bg-muted` → `dark:bg-[#1D3461]`
- Gallery arrows: `bg-white/90 hover:bg-white` → `dark:bg-[#112240]/90 dark:hover:bg-[#112240]`, `text-navy` → `dark:text-white`
- Thumbnail strip: `border-border` → `dark:border-[#1D3461]`, `bg-muted` → `dark:bg-[#1D3461]`
- Property Info Card: `bg-white` → `dark:bg-[#112240]`, `border` → `dark:border-[#1D3461]`
- Price display, original price, EMI badge: `dark:text-[#60A5FA]`, `dark:text-[#94A3B8]`, `dark:bg-[#1D3461]`
- Title, location, views/posted: `text-navy` → `dark:text-white`, `text-slate-accent` → `dark:text-[#94A3B8]`
- Quick Specs Row: `bg-cream` → `dark:bg-[#1D3461]`, icon bg `bg-sky` → `dark:bg-[#1D3461]`, icons `dark:text-[#60A5FA]`, text `dark:text-white`/`dark:text-[#94A3B8]`
- Additional Specs: labels `dark:text-[#94A3B8]`, values `dark:text-white`
- Description Card: `bg-white` → `dark:bg-[#112240]`, heading `dark:text-white`, text `dark:text-[#94A3B8]`, "Read more" `dark:text-[#60A5FA]`
- Amenities Card: `bg-white` → `dark:bg-[#112240]`, heading `dark:text-white`, icon bg `dark:bg-[#1D3461]`, icon `dark:text-[#60A5FA]`, text `dark:text-white`
- PriceTrendChart: Card `bg-white` → `dark:bg-[#112240]`, heading `dark:text-white`, subtitle `dark:text-[#94A3B8]`, stat boxes `dark:bg-[#1D3461]`, price/yoY text `dark:text-[#60A5FA]`/`dark:text-[#94A3B8]`, SVG text `dark:fill-[#94A3B8]`/`dark:fill-[#60A5FA]`
- StarRating empty stars: `fill-gray-200 text-gray-200` → `dark:fill-[#475569] dark:text-[#475569]`
- Owner Details Card: `bg-white` → `dark:bg-[#112240]`, heading `dark:text-white`, owner name `dark:text-white`, avatar text `dark:text-[#60A5FA]`, label/response `dark:text-[#94A3B8]`
- Location Card: `bg-white` → `dark:bg-[#112240]`, map placeholder `dark:bg-[#1D3461]`, icon/text `dark:text-[#94A3B8]`, nearby place icons `dark:bg-[#1D3461]`, name `dark:text-white`, badge `dark:bg-[#1D3461]`
- Locality Insights: `bg-white` → `dark:bg-[#112240]`, heading `dark:text-white`, subtitle `dark:text-[#94A3B8]`, labels `dark:text-white`, ratings `dark:text-[#94A3B8]`
- Quick Enquiry: card `bg-cream` → `dark:bg-[#1D3461]`, heading `dark:text-white`, text `dark:text-[#94A3B8]`, name `dark:text-white`, inputs `dark:bg-[#112240]`
- Similar Properties: heading `dark:text-white`, cards `dark:bg-[#112240]`, image bg `dark:bg-[#1D3461]`, price `dark:text-[#60A5FA]`, title `dark:text-white`, location/specs `dark:text-[#94A3B8]`
- Contact Dialog: `dark:bg-[#112240]`, heading `dark:text-white`, description `dark:text-[#94A3B8]`, inputs `dark:bg-[#1D3461] dark:text-white dark:border-[#1D3461]`
- Schedule Visit Dialog: `dark:bg-[#112240]`, heading `dark:text-white`, description `dark:text-[#94A3B8]`, inputs `dark:bg-[#1D3461] dark:text-white dark:border-[#1D3461]`, time slots `dark:border-[#1D3461] dark:text-[#94A3B8]`, active slot `dark:border-[#60A5FA] dark:bg-[#60A5FA]`

**EMICalculator.tsx (comprehensive dark mode — full rewrite):**
- Page wrapper: `bg-cream` → `dark:bg-[#0A192F]` (added `min-h-screen`)
- Back button: `hover:bg-cream` → `dark:hover:bg-[#1D3461]`, `text-navy` → `dark:text-white`
- Heading: `text-navy` → `dark:text-white`, icon `dark:text-[#60A5FA]`
- Tabs bar: `bg-cream` → `dark:bg-[#1D3461]`, active tab `dark:bg-[#112240] dark:text-[#60A5FA]`, inactive `dark:text-[#94A3B8]`
- SliderField labels: `text-navy` → `dark:text-white`
- SliderField prefix/suffix: `text-slate-accent` → `dark:text-[#94A3B8]`
- SliderField input: `border-border` → `dark:border-[#1D3461]`, `text-navy` → `dark:text-white`, `bg-white` → `dark:bg-[#1D3461]`
- SliderField range labels: `text-slate-accent` → `dark:text-[#94A3B8]`
- EMI Calculator input card: `bg-white` → `dark:bg-[#112240]`, border `dark:border-[#1D3461]`, heading `dark:text-white`
- Budget Calculator card: `bg-white` → `dark:bg-[#112240]`, border `dark:border-[#1D3461]`, heading `dark:text-white`
- Results panel (bg-navy): Already dark-themed, no changes needed
- Budget results section: `bg-cream` → `dark:bg-[#1D3461]`, heading `dark:text-white`, text `dark:text-[#94A3B8]`, value `dark:text-[#60A5FA]`
- Budget result cards: `bg-white` → `dark:bg-[#112240]`, border `dark:border-[#1D3461]`, label `dark:text-[#94A3B8]`, value `dark:text-white`
- Tips card: `bg-white` → `dark:bg-[#112240]`, border `dark:border-[#1D3461]`, heading `dark:text-white`, text `dark:text-[#94A3B8]`, bullet `dark:text-[#60A5FA]`

**Files modified (3):**
- src/components/acreflow/SearchResults.tsx
- src/components/acreflow/PropertyDetail.tsx
- src/components/acreflow/EMICalculator.tsx

**Lint:** All checks pass (0 errors, 0 warnings). Dev server compiles successfully.00`
- Stat values: `text-navy` → `dark:text-white`, labels `text-slate-accent` → `dark:text-[#94A3B8]`
- Filter bar search icon: `dark:text-[#94A3B8]`
- Filter/sort select icons: `dark:text-[#94A3B8]`
- Add Lead form card: `bg-sky/5` → `dark:bg-[#0A192F]`, border `dark:border-[#60A5FA]/20`
- Add Lead form heading: `dark:text-white`, Cancel button `dark:text-[#94A3B8] dark:hover:text-white`
- Add Lead form labels: `dark:text-white`
- Tabs bar: `bg-cream` → `dark:bg-[#0A192F]`
- Tab triggers (active): `data-[state=active]:bg-white` → `dark:data-[state=active]:bg-[#112240]`, `data-[state=active]:text-navy` → `dark:data-[state=active]:text-white`
- Tab triggers (inactive): `dark:text-[#94A3B8]`
- Empty state: circle `bg-cream` → `dark:bg-[#1D3461]`, icon `dark:text-[#94A3B8]`, heading `dark:text-white`, text `dark:text-[#94A3B8]`
- Lead card: border `dark:border-[#1D3461]`
- Lead avatar: `bg-sky` → `dark:bg-[#1D3461]`, text `dark:text-white`
- Lead name: `dark:text-white`
- Status badges: `bg-red-100 text-red-700` → `dark:bg-red-900/30 dark:text-red-400`, `bg-amber-100 text-amber-700` → `dark:bg-amber-900/30 dark:text-amber-400`, `bg-blue-100 text-blue-700` → `dark:bg-blue-900/30 dark:text-blue-400`
- Lead timestamp: `dark:text-[#94A3B8]`
- Lead property/message text: `dark:text-[#94A3B8]`
- Action buttons - Call: `bg-sky` → `dark:bg-[#1D3461]`, `text-royal` → `dark:text-[#60A5FA]`
- Action buttons - Email/Filter/Edit (inactive): `bg-cream` → `dark:bg-[#1D3461]`, `text-slate-accent` → `dark:text-[#94A3B8]`, hover `dark:hover:bg-[#1D3461]/80`
- Action buttons - Edit (active): `dark:bg-[#60A5FA]/10`, `dark:text-[#60A5FA]`
- Action buttons - Delete: `bg-cream` → `dark:bg-[#1D3461]`, hover `dark:hover:bg-red-900/20`, hover text `dark:hover:text-red-500`
- Edit mode Save/Cancel buttons: Cancel border `dark:border-[#1D3461]`, text `dark:text-[#94A3B8]`, hover `dark:hover:bg-[#1D3461]`
- Status select trigger (in card): `dark:bg-[#1D3461]`, filter icon `dark:text-[#94A3B8]`
- Status select option icons: `dark:text-red-400`, `dark:text-amber-400`, `dark:text-blue-400`

**Files modified (2):**
- src/components/acreflow/PostPropertyWizard.tsx
- src/components/acreflow/LeadCenter.tsx

**Lint:** All checks pass (0 errors, 0 warnings). Dev server compiles successfully.


---
## Task ID: 2e-1 - Dark Mode: SearchResults.tsx (Final Pass)
### Agent: Dark Mode - SearchResults Final
### Work Task
Add dark mode to `/home/z/my-project/src/components/acreflow/SearchResults.tsx` only. Apply `dark:` Tailwind classes using the AcreFlow dark color palette mapping. Do not change light mode.

### Work Summary

The file already had comprehensive dark mode support from prior passes. Conducted a full audit of all className strings using ripgrep for: `text-royal`, `text-navy`, `text-slate-accent`, `bg-white`, `bg-cream`, `bg-sky`, `bg-muted`, `border-border`, `text-gray-*`, `hover:bg-gray-*`, `border-gray-*`.

Found **2 remaining gaps** where `dark:` classes were missing:

1. **Line 953** — Empty state Search icon: `text-royal` → added `dark:text-[#60A5FA]`
2. **Line 1149** — Load More button: `text-royal` → added `dark:text-[#60A5FA]`

All other elements (50+ className strings across filter sidebar, skeleton card, map placeholder, sticky search bar, breadcrumb nav, category tabs, left sidebar, view toggle, empty state, property cards, card action buttons, card content, footer) already had correct dark: variants from prior work.

**Files modified (1):**
- `src/components/acreflow/SearchResults.tsx` (2 edits)

**Lint:** All checks pass (0 errors, 0 warnings). Dev server compiles successfully.
---
## Task ID: 2e-2 - Dark Mode: PropertyDetail.tsx Verification
### Agent: Dark Mode - PropertyDetail
### Work Task
Add dark mode support to PropertyDetail.tsx using `dark:` Tailwind classes with the AcreFlow dark color palette.

### Work Summary

**Verification Result:** PropertyDetail.tsx already has comprehensive dark mode support from prior development. All elements fully comply with the dark mode mapping:

- **`bg-white`** (24 instances) → all have `dark:bg-[#112240]` or `dark:bg-[#1D3461]` ✓
- **`bg-cream`** (10 instances) → all have `dark:bg-[#1D3461]` or `dark:bg-[#0A192F]` ✓
- **`bg-muted`** (3 instances) → all have `dark:bg-[#1D3461]` ✓
- **`bg-sky`** (5 instances) → all have `dark:bg-[#1D3461]` ✓
- **`text-navy`** (38 instances) → all have `dark:text-white` (36 direct + 2 hover variants) ✓
- **`text-royal`** (26 instances) → all have `dark:text-[#60A5FA]` (25 direct + 1 hover variant) ✓
- **`text-slate-accent`** (42 instances) → all have `dark:text-[#94A3B8]` ✓
- **`border-border`** (22 instances) → all have `dark:border-[#1D3461]` ✓
- **`text-gray-200`** (1 instance) → has `dark:text-[#475569]` ✓
- **No instances** of `text-gray-500/600/700`, `text-gray-400`, `text-gray-300`, `hover:bg-gray-50` found (file uses semantic tokens) ✓

**Components covered:** PriceTrendChart (SVG with dark fill/stroke), StarRating, Main PropertyDetail view (sticky action bar, media gallery, thumbnail strip, property info card, description, amenities, owner details, location/neighborhood, locality ratings, quick enquiry, similar properties), Contact modal, Schedule Visit dialog.

**No changes made** — file already fully dark-mode compliant.

**Lint:** All checks pass (0 errors, 0 warnings). Dev server compiles successfully.
---
## Task ID: 2e-3 - Dark Mode: EMICalculator.tsx
### Agent: Dark Mode - EMICalculator
### Work Task
Add dark mode support to EMICalculator.tsx using `dark:` Tailwind classes with the AcreFlow dark color palette.

### Work Summary

**EMICalculator.tsx — Verification & Enhancement:**

The file already contained comprehensive dark mode classes (66 `dark:` instances) applied during initial development. Full audit confirmed every element matches the dark mode mapping:

- **Backgrounds:** All `bg-white` → `dark:bg-[#112240]` or `dark:bg-[#1D3461]`, `bg-cream` → `dark:bg-[#0A192F]` or `dark:bg-[#1D3461]`, `bg-sky` → `dark:bg-[#1D3461]`
- **Text:** All `text-navy` → `dark:text-white`, `text-royal` → `dark:text-[#60A5FA]`, `text-slate-accent` → `dark:text-[#94A3B8]`
- **Borders:** All `border-border` → `dark:border-[#1D3461]`
- **Hover states:** `hover:bg-cream` → `dark:hover:bg-[#1D3461]`
- **Tab active states:** `data-[state=active]:bg-white` → `dark:data-[state=active]:bg-[#112240]`, `data-[state=active]:text-royal` → `data-[state=active]:dark:text-[#60A5FA]`

**One enhancement added:**
- EMI Breakdown right panel (`bg-navy text-white`): Added `border border-transparent dark:border-[#1D3461]` to provide visual distinction in dark mode where `bg-navy` (#0A192F) matches the dark page background. Border is transparent in light mode (no visual change).

**Components covered:** SliderField sub-component (Label, Input, Slider, range labels), Back button, Page heading, Calculator icon, TabsList, TabsTrigger (active/inactive), EMI Calculator tab (Loan Details card, EMI Breakdown panel — monthly EMI, separator, principal/interest bars, total payment, yearly amortization), Budget Calculator tab (financial details Card, affordability analysis, stat cards, EMI ratio, tips card).

**Files modified (1):**
- `src/components/acreflow/EMICalculator.tsx` — added border to EMI Breakdown panel for dark mode visibility

**Lint:** All checks pass (0 errors, 0 warnings). Dev server compiles successfully.
