'use client'

import { useState } from 'react'
import {
  BookOpen, Play, Search, Filter, Award, Globe2, FileText,
  ChevronRight, Clock, Eye, Star, Download, ExternalLink,
  ShieldCheck, Leaf, Zap, Package, Truck, Fish, BarChart3,
  Users, CheckCircle, AlertCircle, Info, BookMarked, Calendar,
  Droplets, Flame, Activity, MapPin, Anchor, ChefHat, Heart,
  Share2, Sparkles, TrendingUp, Plus, Camera
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { KNOWLEDGE_VIDEOS, CERTIFICATIONS, TRADE_REGULATIONS, RECIPES } from '@/lib/data'
import { cn } from '@/lib/utils'
import { useT } from '@/lib/i18n'

// ─── Fish Species Data ────────────────────────────────────────────────────────
interface FishSpecies {
  id: string
  emoji: string
  marketName: string
  scientificName: string
  commonNames: string[]
  tagline: string
  description: string
  nutrition: { calories: number; protein: number; fat: number; omega3: number; cholesterol: number; sodium: number }
  taste: string
  texture: string
  cookingTip: string
  fishingMethod: string[]
  productionForms: string[]
  faozones: { code: string; name: string }[]
  supplyCountries: string[]
  seasons: { month: string; level: 0 | 1 | 2 | 3 }[]  // 0=none,1=low,2=available,3=peak
  seasonNote: string
  top5: { country: string; flag: string; qty: string; share: string }[]
  color: string
  colorLight: string
  urnerBarryNote: string
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const FISH_SPECIES: FishSpecies[] = [
  {
    id: 'salmon',
    emoji: '🐟',
    marketName: 'Atlantic Salmon',
    scientificName: 'Salmo salar',
    commonNames: ['Atlantic Salmon', 'Norwegian Salmon', 'Scottish Salmon', 'Chilean Salmon'],
    tagline: "World's #1 farmed fish · Rich, buttery, omega-3 powerhouse",
    description: 'Atlantic Salmon is the world\'s most commercially important farmed fish, accounting for over 70% of global salmon consumption. Native to both sides of the North Atlantic, virtually all commercial supply comes from open-net sea-cage aquaculture in Norway, Chile, Scotland, and Canada. Prized for its rich, fatty flesh loaded with omega-3 fatty acids, it is arguably the most traded fresh seafood commodity globally — quoted daily on the Oslo Stock Exchange.',
    nutrition: { calories: 208, protein: 20, fat: 13, omega3: 2.2, cholesterol: 63, sodium: 59 },
    taste: 'Rich, buttery, and distinctly "salmon" — mild yet full-flavored with a pleasant sweetness. Higher fat content gives a luxurious mouth-feel. Norwegian and Chilean fish differ slightly in flavor due to feed and temperature differences.',
    texture: 'Firm but tender and flaky. The characteristic large flake structure separates cleanly. High inter-muscular fat creates a silky, moist bite. Super-chilled (0°C) fresh fish has superior texture to frozen.',
    cookingTip: 'Excellent raw as sashimi or sushi. Equally outstanding smoked, pan-seared (skin-on), grilled, or cured as gravlax. Belly flaps are richest and best for smoking.',
    fishingMethod: ['Open-net sea-cage aquaculture (dominant, 99%)', 'Recirculating Aquaculture Systems (RAS) — growing', 'Wild capture from rivers (Atlantic coast) — minimal commercial volume', 'Pacific salmon species (different genus) caught by purse seine in Alaska/Pacific NW'],
    productionForms: ['HOG Whole (Head-On Gutted)', 'Whole Fresh Chilled', 'Fillet Skin-On (portion-ready)', 'Fillet Skinless', 'Portions 100-200g IQF', 'Trim D & Belly Flaps', 'Smoked (cold & hot)', 'Salmon Burger / Patty'],
    faozones: [
      { code: 'FAO 27', name: 'Northeast Atlantic (Norway, Scotland, Faroes)' },
      { code: 'FAO 87', name: 'Southeast Pacific (Chile)' },
      { code: 'FAO 21', name: 'Northwest Atlantic (Canada)' },
      { code: 'FAO 57', name: 'East Indian Ocean (Australia, Tasmania)' },
    ],
    supplyCountries: ['Norway', 'Chile', 'United Kingdom (Scotland)', 'Canada', 'Faroe Islands', 'Australia', 'Iceland'],
    seasons: [
      { month: 'Jan', level: 3 }, { month: 'Feb', level: 3 }, { month: 'Mar', level: 3 },
      { month: 'Apr', level: 3 }, { month: 'May', level: 3 }, { month: 'Jun', level: 2 },
      { month: 'Jul', level: 2 }, { month: 'Aug', level: 2 }, { month: 'Sep', level: 3 },
      { month: 'Oct', level: 3 }, { month: 'Nov', level: 3 }, { month: 'Dec', level: 3 },
    ],
    seasonNote: 'Year-round availability from aquaculture. Norwegian volumes typically dip slightly June–August due to biological growth cycles. Q4 and Q1 are peak supply and export periods.',
    top5: [
      { country: 'Norway',         flag: '🇳🇴', qty: '1,600,000 MT', share: '52%' },
      { country: 'Chile',          flag: '🇨🇱', qty: '1,050,000 MT', share: '34%' },
      { country: 'UK (Scotland)',  flag: '🇬🇧', qty: '200,000 MT',  share: '7%' },
      { country: 'Canada',         flag: '🇨🇦', qty: '130,000 MT',  share: '4%' },
      { country: 'Faroe Islands',  flag: '🇫🇴', qty: '90,000 MT',   share: '3%' },
    ],
    color: '#f97316',
    colorLight: '#fff7ed',
    urnerBarryNote: 'Norwegian Salmon spot prices are quoted FOB Oslo daily. Key price drivers: Norwegian Kroner exchange rate, biological production volumes, EU and US import demand, and competing supply from Chile. Prices in NOK/kg are the global benchmark.',
  },
  {
    id: 'tuna',
    emoji: '🐠',
    marketName: 'Yellowfin Tuna',
    scientificName: 'Thunnus albacares',
    commonNames: ['Yellowfin Tuna', 'Ahi Tuna (Hawaii)', 'Thon Jaune (French)', 'Atún de Aleta Amarilla (Spanish)'],
    tagline: "Global ocean warrior · Lean protein giant · Sashimi & canning powerhouse",
    description: 'Yellowfin Tuna is one of the most commercially significant tuna species, found throughout tropical and subtropical oceans globally. It occupies a unique dual market — the sashimi-grade premium segment (super-frozen at −60°C) and the mass-market canned/loins segment. Indonesia, Philippines, and Ecuador are the world\'s top producers. A highly migratory species managed by international commissions (WCPFC, IOTC, ICCAT).',
    nutrition: { calories: 109, protein: 24, fat: 1.1, omega3: 0.32, cholesterol: 45, sodium: 47 },
    taste: 'Mild, clean, meaty ocean flavor with a slightly sweet finish. Much leaner than salmon — a very neutral, versatile taste that absorbs marinades and seasonings exceptionally well. Sashimi-grade fish has a delicate sweetness.',
    texture: 'Firm, dense, and steak-like. Meaty with a satisfying chew. Large muscle fibers create a distinctive grain. Super-frozen (−60°C) preserves the translucent red color and firm texture preferred for sashimi.',
    cookingTip: 'Serve raw as sashimi or tataki (lightly seared exterior, raw center). Excellent as tuna steaks seared rare to medium-rare. The belly (toro) is the fattiest, most prized cut for sashimi. Loins work perfectly in poke bowls, sandwiches, and salads.',
    fishingMethod: ['Purse seine — bulk catch for loins/canning (~65% of catch)', 'Long-line — sashimi-grade, lower bycatch, higher quality', 'Pole-and-line — MSC-certified sustainable method', 'FAD (Fish Aggregating Devices) — efficient but higher bycatch concern'],
    productionForms: ['Whole Round Fresh (air freight)', 'Loins IQF Vacuum-Packed', 'Steaks IQF', 'Sashimi Grade Super Frozen −60°C', 'Belly Flaps (Toro)', 'Marinated Steaks (value-added)', 'Canned in brine / oil'],
    faozones: [
      { code: 'FAO 71', name: 'Western Central Pacific (Indonesia, Philippines, PNG)' },
      { code: 'FAO 57', name: 'Eastern Indian Ocean (Maldives, Sri Lanka)' },
      { code: 'FAO 51', name: 'Western Indian Ocean (Maldives, Seychelles)' },
      { code: 'FAO 87', name: 'Southeast Pacific (Ecuador, Peru)' },
      { code: 'FAO 34', name: 'Eastern Central Atlantic (Ghana, Côte d\'Ivoire)' },
    ],
    supplyCountries: ['Indonesia', 'Philippines', 'Ecuador', 'Maldives', 'Papua New Guinea', 'Spain (processing)', 'Thailand (canning)'],
    seasons: [
      { month: 'Jan', level: 2 }, { month: 'Feb', level: 3 }, { month: 'Mar', level: 3 },
      { month: 'Apr', level: 3 }, { month: 'May', level: 2 }, { month: 'Jun', level: 2 },
      { month: 'Jul', level: 2 }, { month: 'Aug', level: 2 }, { month: 'Sep', level: 3 },
      { month: 'Oct', level: 3 }, { month: 'Nov', level: 3 }, { month: 'Dec', level: 2 },
    ],
    seasonNote: 'Year-round availability. Pacific catches peak Feb–May and Sep–Dec following migration patterns. Indian Ocean peaks differ by sub-region. Supply is highly weather and El Niño dependent.',
    top5: [
      { country: 'Indonesia',      flag: '🇮🇩', qty: '620,000 MT', share: '26%' },
      { country: 'Philippines',    flag: '🇵🇭', qty: '450,000 MT', share: '19%' },
      { country: 'Ecuador',        flag: '🇪🇨', qty: '350,000 MT', share: '15%' },
      { country: 'Maldives',       flag: '🇲🇻', qty: '200,000 MT', share: '8%' },
      { country: 'Papua New Guinea',flag: '🇵🇬', qty: '180,000 MT', share: '7%' },
    ],
    color: '#0ea5e9',
    colorLight: '#f0f9ff',
    urnerBarryNote: 'Urner Barry tracks Yellowfin loins (IQF, vacuum-packed) FOB origin and CIF major ports. Key price drivers: Pacific fishing conditions, WCPFC quota compliance, Japan and EU import demand, and competing Skipjack availability for canning.',
  },
  {
    id: 'tilapia',
    emoji: '🐡',
    marketName: 'Nile Tilapia',
    scientificName: 'Oreochromis niloticus',
    commonNames: ["Tilapia", "Nile Tilapia", "St. Peter's Fish", "Aquaculture White Fish", "Ngege (East Africa)"],
    tagline: "World's most farmed fish · Mild, versatile, affordable protein",
    description: "Tilapia is the second most widely farmed fish globally (after carp) and the world's most affordable white-fish protein. Native to the Nile River basin in Africa, Nile Tilapia is now farmed in over 135 countries. China dominates production. Its mild, neutral flavor makes it ideal for a vast range of cuisines and markets. Often called the 'aquaculture chicken' for its feed efficiency and rapid growth.",
    nutrition: { calories: 96, protein: 20, fat: 1.7, omega3: 0.24, cholesterol: 50, sodium: 52 },
    taste: "Very mild, slightly sweet, almost neutral flavor — a clean white-fish taste. Significantly less 'fishy' than most seafood, making it highly accessible to consumers who prefer subtle flavors. Absorbs seasonings and sauces very well.",
    texture: 'Firm, white flesh with a medium flake. Low fat content means it can become dry if overcooked. Skinless fillets have a clean, bright white appearance prized in retail and food service.',
    cookingTip: 'Extremely versatile — fry, bake, steam, grill, or use in tacos. Excellent as breaded fillets (the world\'s biggest food service format). Marinate to add flavor. Do not overcook — optimal at 145°F internal temp.',
    fishingMethod: ['Intensive pond aquaculture (dominant — 90%)', 'Semi-intensive pond/rice-paddy polyculture', 'Lake cage culture (Lake Victoria, Lake Volta)', 'Wild capture from African Great Lakes (declining)'],
    productionForms: ['Whole Round (fresh or frozen)', 'Fillet Skinless IQF (most traded form)', 'Fillet Skin-On', 'Portions 100–170g IQF', 'Smoked Whole', 'Breaded Fillet (value-added)', 'Marinated Fillet'],
    faozones: [
      { code: 'FAO 61', name: 'Northwest Pacific (China dominates production)' },
      { code: 'FAO 51', name: 'Western Indian Ocean (East Africa, Egypt)' },
      { code: 'FAO 41', name: 'Southwest Atlantic (Brazil)' },
      { code: 'FAO 31', name: 'Western Central Atlantic (Honduras, Costa Rica)' },
    ],
    supplyCountries: ['China', 'Indonesia', 'Egypt', 'Bangladesh', 'Brazil', 'Honduras', 'Colombia', 'Thailand'],
    seasons: [
      { month: 'Jan', level: 3 }, { month: 'Feb', level: 3 }, { month: 'Mar', level: 3 },
      { month: 'Apr', level: 2 }, { month: 'May', level: 2 }, { month: 'Jun', level: 2 },
      { month: 'Jul', level: 2 }, { month: 'Aug', level: 2 }, { month: 'Sep', level: 3 },
      { month: 'Oct', level: 3 }, { month: 'Nov', level: 3 }, { month: 'Dec', level: 3 },
    ],
    seasonNote: 'Year-round from intensive aquaculture. Chinese production peak is Q1 and Q4 with harvests shipped globally. Egyptian and African wild catches are seasonal (March–June and September–December).',
    top5: [
      { country: 'China',       flag: '🇨🇳', qty: '1,800,000 MT', share: '38%' },
      { country: 'Indonesia',   flag: '🇮🇩', qty: '1,200,000 MT', share: '25%' },
      { country: 'Egypt',       flag: '🇪🇬', qty: '900,000 MT',   share: '19%' },
      { country: 'Bangladesh',  flag: '🇧🇩', qty: '500,000 MT',   share: '10%' },
      { country: 'Brazil',      flag: '🇧🇷', qty: '400,000 MT',   share: '8%' },
    ],
    color: '#059669',
    colorLight: '#f0fdf4',
    urnerBarryNote: 'Urner Barry tracks Chinese Tilapia fillet prices (IQF skinless) FOB Qingdao/Guangzhou and CIF US/EU. Chinese production costs and exchange rate are the dominant price drivers. US is the world\'s largest tilapia importer.',
  },
  {
    id: 'shrimp',
    emoji: '🦐',
    marketName: 'Whiteleg Shrimp (Vannamei)',
    scientificName: 'Litopenaeus vannamei',
    commonNames: ['Whiteleg Shrimp', 'Vannamei Shrimp', 'Pacific White Shrimp', 'Western White Prawn'],
    tagline: "World's #1 traded seafood · 70% of global farmed shrimp",
    description: 'Whiteleg Shrimp (Litopenaeus vannamei) is the world\'s most commercially important crustacean and the single most traded seafood commodity globally by value. Native to the Pacific coast of Latin America, it was introduced to Asian aquaculture in the 1990s and now dominates production in Ecuador, China, Vietnam, India, and Indonesia. Ecuador has emerged as the largest single supplier over the past decade.',
    nutrition: { calories: 85, protein: 18, fat: 0.9, omega3: 0.28, cholesterol: 152, sodium: 294 },
    taste: 'Mildly sweet with a clean, delicate ocean flavor. Less pronounced than tiger prawn. The characteristic sweetness intensifies when cooked simply (boiled or steamed). Minimal "fishy" notes — very broad consumer appeal.',
    texture: 'Firm yet tender with a satisfying snap when bitten. Shell-on maintains more moisture during cooking. The firm texture holds well in high-heat applications (wok, grill). PD (peeled, deveined) cooked can become soft if overcooked.',
    cookingTip: 'Exceptional in stir-fries, curries, pasta, and on the grill. Do not overcook — 2-3 minutes per side maximum. Shell-on grilled is preferred in Mediterranean markets. Cocktail preparations highlight the natural sweetness.',
    fishingMethod: ['Intensive pond aquaculture (dominant ~95%)', 'Super-intensive biofloc/RAS systems (growing)', 'Wild catch from Pacific coast Ecuador/Peru (minimal)', 'Semi-intensive mangrove-friendly systems (sustainable premium)'],
    productionForms: ['HLSO 16/20, 21/25, 26/30, 31/40, 41/50 (count per lb)', 'PD Raw IQF (Peeled Deveined)', 'PD Cooked IQF', 'Butterfly Cut', 'Nobashi (stretched, Japanese market)', 'Breaded / Panko', 'Tempura', 'Cocktail', 'Block Frozen'],
    faozones: [
      { code: 'FAO 87', name: 'Southeast Pacific (Ecuador — world #1)' },
      { code: 'FAO 61', name: 'Northwest Pacific (China, Vietnam)' },
      { code: 'FAO 57', name: 'Eastern Indian Ocean (India, Indonesia, Thailand)' },
      { code: 'FAO 51', name: 'Western Indian Ocean (India, Bangladesh)' },
    ],
    supplyCountries: ['Ecuador', 'China', 'India', 'Vietnam', 'Indonesia', 'Thailand', 'Bangladesh', 'Honduras'],
    seasons: [
      { month: 'Jan', level: 2 }, { month: 'Feb', level: 2 }, { month: 'Mar', level: 3 },
      { month: 'Apr', level: 3 }, { month: 'May', level: 3 }, { month: 'Jun', level: 2 },
      { month: 'Jul', level: 2 }, { month: 'Aug', level: 2 }, { month: 'Sep', level: 3 },
      { month: 'Oct', level: 3 }, { month: 'Nov', level: 3 }, { month: 'Dec', level: 2 },
    ],
    seasonNote: 'Year-round from aquaculture. Asian peak harvests: March–May (spring cycle) and September–November (autumn cycle). Ecuador production is more evenly distributed year-round. EMS (Early Mortality Syndrome) disease outbreaks can create sudden supply disruptions.',
    top5: [
      { country: 'Ecuador',    flag: '🇪🇨', qty: '1,100,000 MT', share: '27%' },
      { country: 'China',      flag: '🇨🇳', qty: '800,000 MT',   share: '20%' },
      { country: 'India',      flag: '🇮🇳', qty: '700,000 MT',   share: '17%' },
      { country: 'Vietnam',    flag: '🇻🇳', qty: '600,000 MT',   share: '15%' },
      { country: 'Indonesia',  flag: '🇮🇩', qty: '500,000 MT',   share: '12%' },
    ],
    color: '#f43f5e',
    colorLight: '#fff1f2',
    urnerBarryNote: 'Urner Barry is the authoritative price-reporting agency for US shrimp markets. Key benchmarks: HLSO 21/25 and 31/40 FOB origin and landed US Gulf. Ecuador prices and Asian disease outbreaks are the primary market movers.',
  },
  {
    id: 'lobster',
    emoji: '🦞',
    marketName: 'American Lobster',
    scientificName: 'Homarus americanus',
    commonNames: ['American Lobster', 'Maine Lobster', 'Canadian Lobster', 'North Atlantic Lobster', 'New England Lobster'],
    tagline: "Crown jewel of North Atlantic seafood · Premium luxury protein",
    description: 'American Lobster is the most commercially valuable seafood species harvested in North America and one of the world\'s most prized luxury seafood commodities. Caught in the cold Northwest Atlantic from New England to Atlantic Canada, it commands premium prices globally. Canada (primarily Nova Scotia, PEI, New Brunswick, Newfoundland) is by far the world\'s largest supplier, exporting live and frozen product to the US, Europe, China, and beyond.',
    nutrition: { calories: 89, protein: 19, fat: 0.9, omega3: 0.18, cholesterol: 72, sodium: 423 },
    taste: 'Distinctly sweet, delicate, slightly briny flavor. The claw meat is the sweetest and most tender; the tail is firmer and milder. Cold-water tails (Canadian/NZ) are generally considered sweeter than warm-water (Caribbean/Brazil) spiny tails.',
    texture: 'Firm yet tender when properly cooked. The tail has a meatier, denser texture. Claw and knuckle meat is more delicate and succulent. Overcooking makes lobster rubbery — the most common preparation mistake.',
    cookingTip: 'Live lobster: steam 8–10 min (1¼ lb), boil in heavily salted water. Tails: split and broil 8–10 min with butter. Claw meat: excellent in bisque, rolls, and pasta. The classic broiled split tail with drawn butter is the gold standard for food service.',
    fishingMethod: ['Trap/pot fishing (dominant — sustainable) with escape vents and size limits', 'Managed wild fishery with strict quota, size, and egg-bearing female protections', 'Seasonal closures during breeding periods', 'No commercial aquaculture at scale (lobster difficult to farm)'],
    productionForms: ['Live (air freight — premium pricing)', 'Whole Cooked (1.5lb, 2lb graded)', 'Hard-Shell Tails IQF (various oz)', 'Soft-Shell Tails (Caribbean/Brazil)', 'Knuckle & Claw Meat frozen', 'Claw Meat frozen', 'Lobster Bisque (value-added)', 'Lobster Roll filling'],
    faozones: [
      { code: 'FAO 21', name: 'Northwest Atlantic (Canada — dominant; Maine/NE USA)' },
      { code: 'FAO 31', name: 'Western Central Atlantic (Caribbean spiny lobster — Panulirus argus)' },
      { code: 'FAO 41', name: 'Southwest Atlantic (Brazil — southern spiny lobster)' },
      { code: 'FAO 81', name: 'Southwest Pacific (New Zealand — rock/spiny lobster)' },
    ],
    supplyCountries: ['Canada (Nova Scotia, PEI, NB, NL)', 'USA (Maine, Massachusetts)', 'Caribbean islands', 'Brazil', 'New Zealand', 'Australia', 'Norway (European Lobster)'],
    seasons: [
      { month: 'Jan', level: 2 }, { month: 'Feb', level: 1 }, { month: 'Mar', level: 1 },
      { month: 'Apr', level: 1 }, { month: 'May', level: 2 }, { month: 'Jun', level: 3 },
      { month: 'Jul', level: 3 }, { month: 'Aug', level: 3 }, { month: 'Sep', level: 3 },
      { month: 'Oct', level: 3 }, { month: 'Nov', level: 3 }, { month: 'Dec', level: 2 },
    ],
    seasonNote: 'Canadian Maritime peak: June–December (moulting creates soft-shell spring season). Maine peak: late June–November. Winter months see lower volumes as lobsters retreat to deeper cold water. Chinese New Year creates significant demand spike in January.',
    top5: [
      { country: 'Canada',          flag: '🇨🇦', qty: '150,000 MT', share: '62%' },
      { country: 'USA (Maine)',      flag: '🇺🇸', qty: '65,000 MT',  share: '27%' },
      { country: 'New Zealand',      flag: '🇳🇿', qty: '8,000 MT',   share: '3%' },
      { country: 'Australia',        flag: '🇦🇺', qty: '6,000 MT',   share: '2%' },
      { country: 'Caribbean',        flag: '🌊',  qty: '6,000 MT',   share: '2%' },
    ],
    color: '#dc2626',
    colorLight: '#fef2f2',
    urnerBarryNote: 'Urner Barry tracks live lobster (per pound) at Boston and Portland Maine docks, and hard-shell tails (various oz) FOB Halifax/Boston. Chinese New Year (Jan–Feb) demand surge, Canadian quota decisions, and US-China trade relations are the dominant market movers.',
  },
  {
    id: 'hamachi',
    emoji: '🐡',
    marketName: 'Japanese Yellowtail (Hamachi)',
    scientificName: 'Seriola quinqueradiata',
    commonNames: ['Hamachi', 'Yellowtail', 'Buri (adult/winter)', 'Inada (juvenile)', 'Meji (sub-adult)', 'Kingfish (Australia/NZ — Seriola lalandi)'],
    tagline: "Japan's most prized farmed sashimi fish · Buttery, rich, season-dependent",
    description: "Japanese Yellowtail (Hamachi/Buri) is Japan's most commercially important farmed marine fish, deeply embedded in Japanese food culture. The same fish is called by different names depending on its size and age — a practice unique to Japanese cuisine (\"shusse-uo\" or promotion fish). Farmed in net-pens in the warm coastal waters of Kagoshima, Ehime, and Kochi prefectures. The winter Buri (\"Kan-buri\") is the most prized, with the highest fat content, harvested December–February.",
    nutrition: { calories: 146, protein: 22, fat: 6.5, omega3: 1.5, cholesterol: 70, sodium: 41 },
    taste: 'Rich, buttery, and distinctly \"Hamachi\" — more flavorful and fatty than most white fish, yet more delicate than salmon. The belly (toro) is exceptionally rich. Winter Buri has higher fat content and a more intense, sweet flavor.',
    texture: 'Firm but silky and smooth. High inter-muscular fat creates a luxurious, melt-in-the-mouth quality particularly prized in sashimi. Slightly firmer than salmon. The collar (Kama) has concentrated fat and the most intense flavor.',
    cookingTip: 'Supreme as sashimi (hira-zukuri thick slices), sushi nigiri, or carpaccio. Hamachi Kama (grilled collar) is a cult dish in Japanese restaurants worldwide. Excellent for teriyaki, shabu-shabu, and Japanese hot-pot. The belly/toro is best served raw.',
    fishingMethod: ['Net-pen sea-cage aquaculture in Japan (dominant)', 'Wild juvenile (\"mojako\") capture for ongrowing — traditional Japanese method', 'Pure aquaculture (recirculating/hatchery broodstock) — increasing', 'Kingfish farmed in Australia, NZ, Spain, and Portugal (Seriola lalandi/dumerili)'],
    productionForms: ['Whole Fresh (air freight — primarily Japan domestic)', 'Loin Fillet Skinless (Japanese restaurant trade)', 'Sashimi Grade Super Frozen −60°C (export)', 'Collar (Kama) IQF', 'Belly (Toro) Frozen', 'Yellowtail Kingfish Fillet (Australian premium)'],
    faozones: [
      { code: 'FAO 61', name: 'Northwest Pacific (Japan — dominant producer; South Korea)' },
      { code: 'FAO 57', name: 'Eastern Indian Ocean (Australia — Kingfish)' },
      { code: 'FAO 81', name: 'Southwest Pacific (New Zealand — Kingfish)' },
    ],
    supplyCountries: ['Japan (Kagoshima, Ehime, Kochi, Nagasaki)', 'South Korea', 'Australia (SA, WA)', 'New Zealand', 'Spain', 'Portugal'],
    seasons: [
      { month: 'Jan', level: 3 }, { month: 'Feb', level: 3 }, { month: 'Mar', level: 2 },
      { month: 'Apr', level: 2 }, { month: 'May', level: 2 }, { month: 'Jun', level: 2 },
      { month: 'Jul', level: 2 }, { month: 'Aug', level: 1 }, { month: 'Sep', level: 2 },
      { month: 'Oct', level: 2 }, { month: 'Nov', level: 3 }, { month: 'Dec', level: 3 },
    ],
    seasonNote: 'Japanese aquaculture is year-round. The most prized "Kan-buri" (winter yellowtail) is harvested December–February when fat content peaks (up to 17% lipid). Summer fish are lighter with less fat. Australian Kingfish is summer-peak (Southern Hemisphere).',
    top5: [
      { country: 'Japan',        flag: '🇯🇵', qty: '130,000 MT', share: '81%' },
      { country: 'Australia',    flag: '🇦🇺', qty: '12,000 MT',  share: '7%' },
      { country: 'South Korea',  flag: '🇰🇷', qty: '8,000 MT',   share: '5%' },
      { country: 'New Zealand',  flag: '🇳🇿', qty: '4,000 MT',   share: '3%' },
      { country: 'Spain',        flag: '🇪🇸', qty: '2,000 MT',   share: '1%' },
    ],
    color: '#8b5cf6',
    colorLight: '#f5f3ff',
    urnerBarryNote: 'Hamachi pricing is primarily tracked through Japanese domestic auction prices (Tsukiji/Toyosu market) and export FOB Japan values. Export volumes are small relative to domestic consumption. Australian Kingfish is priced separately as a premium alternative.',
  },
]

// ─── Season Level Colors ──────────────────────────────────────────────────────
const SEASON_COLORS = {
  0: { bg: 'bg-slate-100', text: 'text-slate-300', label: 'Off Season', icon: '–' },
  1: { bg: 'bg-amber-100', text: 'text-amber-600', label: 'Low',        icon: '○' },
  2: { bg: 'bg-emerald-100', text: 'text-emerald-600', label: 'Available', icon: '●' },
  3: { bg: 'bg-emerald-500', text: 'text-white',       label: 'Peak',    icon: '★' },
}

// ─── Knowledge Data ────────────────────────────────────────────────────────────
const GUIDES = [
  {
    title: 'The Definitive Guide to Salmon Aquaculture',
    category: 'Aquaculture',
    readTime: 18,
    complexity: 'Intermediate',
    icon: '🐟',
    description: 'From roe to export: complete lifecycle management, disease prevention, and harvest optimization for Atlantic salmon.',
    tags: ['Salmon', 'Norway', 'Farming', 'HACCP'],
  },
  {
    title: "IQF vs Block Frozen: A Commercial Buyer's Comparison",
    category: 'Processing',
    readTime: 12,
    complexity: 'Beginner',
    icon: '❄️',
    description: 'When to specify IQF vs block frozen, cost implications, and quality differences that matter for food service vs retail.',
    tags: ['Processing', 'Freezing', 'Quality', 'Buying'],
  },
  {
    title: 'EU Seafood Import Compliance 2026 — Complete Guide',
    category: 'Regulations',
    readTime: 25,
    complexity: 'Advanced',
    icon: '🇪🇺',
    description: 'Everything you need to know about IUU regulations, catch certificates, HACCP requirements, and the new digital traceability mandate.',
    tags: ['EU', 'Compliance', 'Import', '2026'],
  },
  {
    title: 'Understanding Shrimp Grades: Count, Size & Quality',
    category: 'Processing',
    readTime: 8,
    complexity: 'Beginner',
    icon: '🦐',
    description: 'Master the sizing nomenclature (16/20, 21/25, 31/40...), quality grades, and what they mean for pricing and applications.',
    tags: ['Shrimp', 'Grades', 'Sizing', 'Quality'],
  },
  {
    title: 'Cold Chain Best Practices: -18°C to Consumer',
    category: 'Logistics',
    readTime: 15,
    complexity: 'Intermediate',
    icon: '🚢',
    description: 'Optimal temperature management through every logistics touchpoint, HACCP requirements, and documentation best practices.',
    tags: ['Cold Chain', 'Logistics', 'HACCP', 'Temperature'],
  },
  {
    title: 'MSC Certification: How to Get and Maintain It',
    category: 'Sustainability',
    readTime: 20,
    complexity: 'Intermediate',
    icon: '🌊',
    description: 'Step-by-step guide to MSC certification process, costs, audit requirements, and the commercial benefits of becoming certified.',
    tags: ['MSC', 'Sustainability', 'Certification', 'Wild Catch'],
  },
]

const URNER_BARRY_SUMMARIES = [
  {
    date: 'March 6, 2026',
    title: 'Weekly Shrimp Market Update',
    highlight: 'Vannamei prices soft at $7.20/kg; Ecuador volumes robust',
    detail: 'Despite strong supply from Ecuador, domestic US consumption remains steady. 16/20 grade showing premium strength.',
    species: 'Shrimp',
  },
  {
    date: 'March 5, 2026',
    title: 'Salmon Market Report',
    highlight: 'Norwegian spot prices firm at NOK 105/kg; tightening expected',
    detail: 'Norwegian Salmon Association reports biological challenges affecting Q2 volumes. Chilean supply partially compensating.',
    species: 'Salmon',
  },
  {
    date: 'March 4, 2026',
    title: 'Tuna & Swordfish Update',
    highlight: 'Yellowfin strong; Bluefin premium stable at $12-14/kg',
    detail: 'Japan market continues to absorb premium Bluefin. Indonesian yellowfin catches improving with Pacific conditions.',
    species: 'Tuna',
  },
]

// ─── Sub-components ────────────────────────────────────────────────────────────
function VideoCard({ video }: { video: typeof KNOWLEDGE_VIDEOS[0] }) {
  return (
    <Card className="overflow-hidden group cursor-pointer" hover>
      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 h-36 flex items-center justify-center">
        <span className="text-4xl">{video.thumbnail}</span>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
          <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-xl">
            <Play className="w-6 h-6 text-slate-900 ml-1" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded-md">
          {video.duration}
        </div>
        <div className="absolute top-2 left-2">
          <Badge variant="ocean">{video.category}</Badge>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug mb-2">
          {video.title}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-2">{video.description}</p>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Eye className="w-3.5 h-3.5" />
            {video.views}
          </div>
          <div className="flex flex-wrap gap-1">
            {video.tags.slice(0, 2).map(t => (
              <span key={t} className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

function GuideCard({ guide }: { guide: typeof GUIDES[0] }) {
  const t = useT()
  return (
    <Card className="p-5" hover>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-ocean-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0 border border-ocean-100">
          {guide.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1 mb-1.5">
            <Badge variant="ocean">{guide.category}</Badge>
            <Badge variant={guide.complexity === 'Beginner' ? 'success' : guide.complexity === 'Intermediate' ? 'warning' : 'danger'}>
              {guide.complexity}
            </Badge>
          </div>
          <h3 className="text-sm font-semibold text-slate-900 mb-1 line-clamp-2">{guide.title}</h3>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-2">{guide.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="w-3 h-3" />
              {guide.readTime} {t('page.knowledge.minRead')}
            </div>
            <button className="text-xs font-semibold text-ocean-600 hover:text-ocean-700 flex items-center gap-0.5">
              {t('page.knowledge.readGuide')} <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}

// ─── Fish Species Profile Component ──────────────────────────────────────────
function FishProfile({ sp }: { sp: FishSpecies }) {
  const barMax = Math.max(...sp.top5.map(c => parseFloat(c.qty.replace(/,/g, ''))))

  return (
    <div className="space-y-6">
      {/* Hero card */}
      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {/* Fish "photo" */}
          <div
            className="md:col-span-1 flex flex-col items-center justify-center p-8 min-h-48"
            style={{ background: `linear-gradient(135deg, ${sp.color}22, ${sp.color}11)` }}
          >
            <span className="text-9xl mb-3 select-none drop-shadow-lg">{sp.emoji}</span>
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: sp.color }}>
                {sp.marketName}
              </p>
              <p className="text-xs italic text-slate-400">{sp.scientificName}</p>
            </div>
          </div>

          {/* Names + Description */}
          <div className="md:col-span-2 p-6">
            <div className="flex flex-wrap gap-1.5 mb-3">
              {sp.commonNames.map(n => (
                <span key={n} className="text-xs px-2 py-0.5 rounded-full border border-slate-200 text-slate-600 bg-white">{n}</span>
              ))}
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">{sp.marketName}</h2>
            <p className="text-xs italic text-slate-400 mb-3">{sp.scientificName}</p>
            <p className="text-sm text-slate-500 italic font-medium mb-3" style={{ color: sp.color }}>
              {sp.tagline}
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">{sp.description}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nutrition Facts */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl" style={{ backgroundColor: sp.colorLight }}>
              <Activity className="w-4 h-4" style={{ color: sp.color }} />
            </div>
            <h3 className="font-bold text-slate-900">Nutrition Facts</h3>
            <span className="text-xs text-slate-400 ml-auto">per 100g raw</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Calories', value: `${sp.nutrition.calories} kcal`, icon: Flame, highlight: false },
              { label: 'Protein', value: `${sp.nutrition.protein}g`, icon: Activity, highlight: true },
              { label: 'Total Fat', value: `${sp.nutrition.fat}g`, icon: Droplets, highlight: false },
              { label: 'Omega-3', value: `${sp.nutrition.omega3}g`, icon: Fish, highlight: true },
              { label: 'Cholesterol', value: `${sp.nutrition.cholesterol}mg`, icon: Activity, highlight: false },
              { label: 'Sodium', value: `${sp.nutrition.sodium}mg`, icon: Droplets, highlight: false },
            ].map(n => {
              const Icon = n.icon
              return (
                <div key={n.label} className={cn(
                  'p-3 rounded-xl border flex items-center gap-3',
                  n.highlight ? 'border-opacity-30' : 'border-slate-100 bg-slate-50'
                )}
                style={n.highlight ? { backgroundColor: sp.colorLight, borderColor: sp.color + '44' } : {}}>
                  <Icon className="w-4 h-4 flex-shrink-0" style={{ color: n.highlight ? sp.color : '#94a3b8' }} />
                  <div>
                    <p className="text-xs text-slate-500">{n.label}</p>
                    <p className="text-sm font-bold text-slate-900">{n.value}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Eating Qualities */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl" style={{ backgroundColor: sp.colorLight }}>
              <Star className="w-4 h-4" style={{ color: sp.color }} />
            </div>
            <h3 className="font-bold text-slate-900">Eating Qualities</h3>
          </div>
          <div className="space-y-4">
            <div className="p-3 rounded-xl" style={{ backgroundColor: sp.colorLight }}>
              <p className="text-xs font-bold mb-1.5" style={{ color: sp.color }}>TASTE PROFILE</p>
              <p className="text-sm text-slate-700 leading-relaxed">{sp.taste}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs font-bold text-slate-500 mb-1.5">TEXTURE</p>
              <p className="text-sm text-slate-700 leading-relaxed">{sp.texture}</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-xs font-bold text-amber-600 mb-1.5">💡 COOKING TIP</p>
              <p className="text-sm text-slate-700 leading-relaxed">{sp.cookingTip}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fishing / Production Methods */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl" style={{ backgroundColor: sp.colorLight }}>
              <Anchor className="w-4 h-4" style={{ color: sp.color }} />
            </div>
            <h3 className="font-bold text-slate-900">Fishing & Production Methods</h3>
          </div>
          <ul className="space-y-2 mb-4">
            {sp.fishingMethod.map((m, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: sp.color }} />
                {m}
              </li>
            ))}
          </ul>
          <div className="border-t border-slate-100 pt-4">
            <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Production Forms Traded</p>
            <div className="flex flex-wrap gap-1.5">
              {sp.productionForms.map(f => (
                <span key={f} className="text-xs px-2 py-1 rounded-lg border border-slate-200 bg-white text-slate-600">{f}</span>
              ))}
            </div>
          </div>
        </Card>

        {/* Seasonal Availability */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl" style={{ backgroundColor: sp.colorLight }}>
              <Calendar className="w-4 h-4" style={{ color: sp.color }} />
            </div>
            <h3 className="font-bold text-slate-900">Seasonal Availability</h3>
          </div>
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-1 mb-3">
            {sp.seasons.map((s, i) => {
              const cfg = SEASON_COLORS[s.level]
              return (
                <div key={i} className="text-center">
                  <div className={cn('w-full aspect-square rounded-lg flex items-center justify-center text-sm font-bold mb-1', cfg.bg, cfg.text)}>
                    {cfg.icon}
                  </div>
                  <p className="text-xs text-slate-400">{MONTHS[i]}</p>
                </div>
              )
            })}
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {([3, 2, 1, 0] as const).map(level => {
              const cfg = SEASON_COLORS[level]
              return (
                <span key={level} className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', cfg.bg, cfg.text)}>
                  {cfg.icon} {cfg.label}
                </span>
              )
            })}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">{sp.seasonNote}</p>
        </Card>
      </div>

      {/* Global Supply — FAO Zones + Top 5 Countries */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-5">
          <div className="p-2 rounded-xl" style={{ backgroundColor: sp.colorLight }}>
            <Globe2 className="w-4 h-4" style={{ color: sp.color }} />
          </div>
          <h3 className="font-bold text-slate-900">Global Supply, FAO Zones & Top Producing Countries</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* FAO Zones */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">FAO Fishing Areas</p>
            <div className="space-y-2">
              {sp.faozones.map(z => (
                <div key={z.code} className="flex items-start gap-2 p-2.5 rounded-xl border border-slate-100 bg-slate-50">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: sp.color }}>{z.code}</span>
                  <p className="text-xs text-slate-600 leading-relaxed">{z.name}</p>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Supply Countries</p>
              <div className="flex flex-wrap gap-1.5">
                {sp.supplyCountries.map(c => (
                  <span key={c} className="text-xs px-2 py-0.5 rounded-full border text-slate-600"
                    style={{ borderColor: sp.color + '44', backgroundColor: sp.colorLight }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Top 5 Countries Table */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Top 5 Countries — Annual Production</p>
            <div className="space-y-2">
              {sp.top5.map((c, i) => {
                const barPct = (parseFloat(c.qty.replace(/,/g, '')) / barMax) * 100
                return (
                  <div key={c.country} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 w-4">#{i + 1}</span>
                        <span className="text-base">{c.flag}</span>
                        <span className="font-medium text-slate-800">{c.country}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 text-xs">{c.qty}</span>
                        <span className="text-xs text-slate-400 ml-1">({c.share})</span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${barPct}%`, backgroundColor: sp.color }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Urner Barry Intelligence */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 border-l-4" style={{ borderLeftColor: sp.color }}>
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="w-4 h-4" style={{ color: sp.color }} />
          <h3 className="font-bold text-slate-900">Urner Barry Market Intelligence</h3>
          <Badge variant="ocean">UB</Badge>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">{sp.urnerBarryNote}</p>
      </div>
    </div>
  )
}

// ─── Recipes Data & Components ────────────────────────────────────────────────
const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: 'success',
  Medium: 'warning',
  Hard: 'danger',
}

const TRENDING_DISHES = [
  { dish: 'Norwegian Salmon Poke Bowl', trend: '+340%', region: 'USA', emoji: '🍱' },
  { dish: 'Ecuadorian Ceviche', trend: '+125%', region: 'Global', emoji: '🍋' },
  { dish: 'Japanese Tuna Tataki', trend: '+89%', region: 'Europe', emoji: '🐠' },
  { dish: 'Thai Shrimp Green Curry', trend: '+67%', region: 'MENA', emoji: '🍛' },
  { dish: 'Icelandic Fish & Chips', trend: '+54%', region: 'UK', emoji: '🐟' },
  { dish: 'Portuguese Cod Bacalhau', trend: '+43%', region: 'Americas', emoji: '🥘' },
]

const CHEF_PICKS = [
  { name: 'Chef Nobu Matsuhisa', specialty: 'Japanese-Peruvian Fusion', flag: '🇯🇵', rating: 5.0 },
  { name: 'Chef José Andrés', specialty: 'Spanish Mediterranean', flag: '🇪🇸', rating: 4.9 },
  { name: 'Chef Alice Waters', specialty: 'California Farm-to-Table', flag: '🇺🇸', rating: 4.8 },
  { name: 'Chef Yotam Ottolenghi', specialty: 'Middle Eastern Fusion', flag: '🇮🇱', rating: 4.9 },
]

const SEAFOOD_CULTURE = [
  { country: 'Japan', dish: 'Sushi & Sashimi', emoji: '🍣', color: 'from-red-50 to-pink-50 border-red-100' },
  { country: 'Portugal', dish: 'Bacalhau (Salt Cod)', emoji: '🐟', color: 'from-yellow-50 to-amber-50 border-yellow-100' },
  { country: 'Thailand', dish: 'Tom Yum Seafood', emoji: '🍜', color: 'from-green-50 to-emerald-50 border-green-100' },
  { country: 'Spain', dish: 'Paella de Mariscos', emoji: '🥘', color: 'from-orange-50 to-red-50 border-orange-100' },
  { country: 'Peru', dish: 'Ceviche Clásico', emoji: '🍋', color: 'from-sky-50 to-blue-50 border-sky-100' },
  { country: 'Morocco', dish: 'Chermoula Fish', emoji: '🫙', color: 'from-amber-50 to-yellow-50 border-amber-100' },
  { country: 'Norway', dish: 'Gravlaks & Smørbrød', emoji: '🍞', color: 'from-purple-50 to-violet-50 border-purple-100' },
  { country: 'USA', dish: 'New England Chowder', emoji: '🥣', color: 'from-slate-50 to-gray-50 border-slate-100' },
]

function RecipeCard({ recipe, featured = false }: { recipe: typeof RECIPES[0]; featured?: boolean }) {
  const t = useT()
  const [saved, setSaved] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const difficultyKey = `page.recipes.difficulty.${recipe.difficulty.toLowerCase()}`

  return (
    <Card className={cn('overflow-hidden', featured && 'lg:col-span-2')} hover>
      <div className={cn(
        'bg-gradient-to-br flex items-center justify-center',
        recipe.species === 'Atlantic Salmon' ? 'from-orange-100 to-red-50' :
        recipe.species === 'White Shrimp' ? 'from-orange-50 to-amber-50' :
        'from-blue-50 to-sky-50',
        featured ? 'h-48' : 'h-32'
      )}>
        <span className={cn('select-none', featured ? 'text-8xl' : 'text-5xl')}>{recipe.image}</span>
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-1.5 mb-2">
          <Badge variant={DIFFICULTY_COLORS[recipe.difficulty] as any}>{t(difficultyKey)}</Badge>
          {recipe.tags.map(tag => <Badge key={tag} variant="default">{tag}</Badge>)}
        </div>
        <h3 className={cn('font-bold text-slate-900 mb-1', featured ? 'text-xl' : 'text-base')}>{recipe.name}</h3>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 bg-gradient-to-br from-ocean-500 to-ocean-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {recipe.chef[6]}
          </div>
          <span className="text-sm text-slate-600 font-medium">{recipe.chef}</span>
          <span className="text-slate-300">•</span>
          <span className="text-xs text-slate-500">{recipe.origin}</span>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed mb-3 line-clamp-2">{recipe.description}</p>
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{recipe.time} min</span>
          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{recipe.servings} {t('page.recipes.servings')}</span>
          <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />{recipe.rating} ({recipe.reviews.toLocaleString()})</span>
        </div>
        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 mb-3">
          <div className="flex items-center gap-1.5 mb-1">
            <BarChart3 className="w-3 h-3 text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-700">Trade Intelligence</span>
          </div>
          <p className="text-xs text-emerald-700 leading-relaxed">{recipe.businessNote}</p>
        </div>
        {expanded && (
          <div className="border-t border-slate-100 pt-3 mt-3 space-y-3">
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Ingredients</h4>
              <ul className="space-y-1">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                    <span className="text-ocean-400 mt-0.5">•</span>{ing}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Method</h4>
              <ol className="space-y-1.5">
                {recipe.instructions.map((step, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                    <span className="bg-ocean-100 text-ocean-700 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
        <div className="flex gap-2 mt-3">
          <Button variant="primary" size="sm" className="flex-1" onClick={() => setExpanded(!expanded)}>
            <BookOpen className="w-3.5 h-3.5" />
            {expanded ? 'Hide' : t('page.recipes.viewRecipe')}
          </Button>
          <button onClick={() => setSaved(!saved)} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
            <Heart className={cn('w-4 h-4', saved ? 'fill-red-500 text-red-500' : 'text-slate-400')} />
          </button>
          <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
            <Share2 className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
    </Card>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function KnowledgePage() {
  const t = useT()
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeTab, setActiveTab] = useState<'guides' | 'videos' | 'regulations' | 'certifications' | 'urnerbarry' | 'species' | 'recipes'>('guides')
  const [selectedSpecies, setSelectedSpecies] = useState<string>('salmon')
  const [recipeSearch, setRecipeSearch] = useState('')
  const [recipeSpeciesFilter, setRecipeSpeciesFilter] = useState('All')

  const RECIPE_SPECIES_FILTER = ['All', 'Atlantic Salmon', 'Yellowfin Tuna', 'Tilapia', 'Shrimp', 'Lobster', 'Value Added Seafood']
  const filteredRecipes = RECIPES.filter(r => {
    const matchesSpecies = recipeSpeciesFilter === 'All' || r.species === recipeSpeciesFilter
    const matchesSearch = !recipeSearch || r.name.toLowerCase().includes(recipeSearch.toLowerCase()) || r.chef.toLowerCase().includes(recipeSearch.toLowerCase())
    return matchesSpecies && matchesSearch
  })

  const KNOWLEDGE_CATEGORIES = [
    { id: 'all',          label: t('page.knowledge.cat.all'),          icon: BookOpen },
    { id: 'aquaculture',  label: t('page.knowledge.cat.aquaculture'),   icon: Fish },
    { id: 'processing',   label: t('page.knowledge.cat.processing'),    icon: Package },
    { id: 'logistics',    label: t('page.knowledge.cat.coldchain'),     icon: Truck },
    { id: 'regulations',  label: t('page.knowledge.cat.regulations'),   icon: ShieldCheck },
    { id: 'sustainability',label: t('page.knowledge.cat.sustainability'),icon: Leaf },
    { id: 'market',       label: t('page.knowledge.cat.market'),        icon: BarChart3 },
  ]

  const TABS = [
    { id: 'guides',         label: t('page.knowledge.tab.guides') },
    { id: 'videos',         label: t('page.knowledge.tab.videos') },
    { id: 'regulations',    label: t('page.knowledge.tab.regulations') },
    { id: 'certifications', label: t('page.knowledge.tab.certs') },
    { id: 'species',        label: '🐟 Species Guide' },
    { id: 'recipes',        label: '🍽️ Recipes' },
    { id: 'urnerbarry',     label: t('page.knowledge.tab.reports') },
  ]

  const currentSpecies = FISH_SPECIES.find(s => s.id === selectedSpecies) ?? FISH_SPECIES[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('page.knowledge.title')}</h1>
          <p className="text-slate-500 text-sm mt-1">{t('page.knowledge.subtitle')}</p>
        </div>
        <Button variant="secondary" size="sm">
          <Search className="w-4 h-4" />
          {t('page.knowledge.search')}
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto">
        {TABS.map((tab: any) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
              activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Guides ── */}
      {activeTab === 'guides' && (
        <div className="space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {KNOWLEDGE_CATEGORIES.map(cat => {
              const Icon = cat.icon
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all',
                    activeCategory === cat.id
                      ? 'bg-ocean-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-ocean-300'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.label}
                </button>
              )
            })}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GUIDES.map((guide, i) => <GuideCard key={i} guide={guide} />)}
          </div>
        </div>
      )}

      {/* ── Videos ── */}
      {activeTab === 'videos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">AI-curated professional seafood industry content</p>
            <Button variant="secondary" size="sm"><Filter className="w-4 h-4" />Filter</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {KNOWLEDGE_VIDEOS.map(video => <VideoCard key={video.id} video={video} />)}
          </div>
          <Card className="p-5 bg-ocean-50 border-ocean-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-ocean-600 rounded-xl">
                <Play className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-ocean-900">More Videos Coming Weekly</p>
                <p className="text-xs text-ocean-700 mt-0.5">Our AI curates 10+ new industry videos every week from conference talks, farm tours, and processing facility documentaries.</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ── Trade Regulations ── */}
      {activeTab === 'regulations' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900">Regulatory Disclaimer</p>
              <p className="text-xs text-amber-700 mt-0.5">This information is provided for guidance only. Always verify with official government sources and consult a trade compliance specialist before shipping.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TRADE_REGULATIONS.map((reg) => (
              <Card key={reg.country} className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{reg.flag}</span>
                  <div>
                    <h3 className="font-semibold text-slate-900">{reg.country}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant={reg.complexity === 'High' ? 'danger' : reg.complexity === 'Medium' ? 'warning' : 'success'}>
                        {reg.complexity} Complexity
                      </Badge>
                      <span className="text-sm font-semibold text-slate-700">Import Duty: {reg.importDuty}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1 mb-3">
                  <p className="text-xs font-semibold text-slate-700 mb-1.5">Requirements:</p>
                  {reg.requirements.map((req, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
                      <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" />{req}
                    </div>
                  ))}
                </div>
                <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-700 leading-relaxed">{reg.note}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Card className="p-5">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-ocean-600" />AI Customs Duty Estimator
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Product Value (USD)</label>
                <input type="number" placeholder="e.g. 50000" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Destination Country</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                  <option>European Union</option><option>United States</option><option>Japan</option><option>China</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Species</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                  <option>Atlantic Salmon</option><option>Shrimp</option><option>Tuna</option><option>Cod</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Origin Country</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                  <option>Norway</option><option>Ecuador</option><option>Vietnam</option><option>Iceland</option>
                </select>
              </div>
            </div>
            <Button variant="primary" size="sm" className="mt-3">Calculate Estimated Duties</Button>
          </Card>
        </div>
      )}

      {/* ── Certifications ── */}
      {activeTab === 'certifications' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CERTIFICATIONS.map(cert => (
              <Card key={cert.code} className="p-5" hover>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl border border-slate-100 bg-slate-50 flex-shrink-0">
                    {cert.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900">{cert.code}</h3>
                      <span className="text-xs text-slate-500 font-normal">{cert.name}</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {cert.code === 'MSC' && "World's leading sustainable wild fish certification. Required by major EU and UK retailers."}
                      {cert.code === 'ASC' && 'Global standard for responsible aquaculture. Covers environmental and social criteria.'}
                      {cert.code === 'BAP' && 'Covers shrimp, fish, feeds, farms, hatcheries, and processing plants.'}
                      {cert.code === 'GlobalG.A.P' && 'International standards for Good Agricultural Practice in aquaculture production.'}
                      {cert.code === 'HALAL' && 'Required for access to Middle East, North Africa, and Muslim-majority markets.'}
                      {cert.code === 'KOSHER' && 'Enables access to Jewish markets. Requires specific species, handling, and audit standards.'}
                      {cert.code === 'BRC' && 'Recognized global standard for food safety and quality management in processing.'}
                      {cert.code === 'HACCP' && 'Systematic preventive approach to food safety. Required by most importing countries.'}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Button variant="outline" size="sm">Find Certified Suppliers</Button>
                      <Button variant="ghost" size="sm"><ExternalLink className="w-3.5 h-3.5" />Official Site</Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ── Recipes ── */}
      {activeTab === 'recipes' && (
        <div className="space-y-6">
          {/* Hero */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 to-pink-700 p-6 sm:p-8">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <ChefHat className="w-5 h-5 text-white" />
                </div>
                <span className="text-white/80 text-sm font-medium">{t('page.recipes.curated')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t('page.recipes.title')}</h2>
              <p className="text-rose-100 text-sm sm:text-base leading-relaxed max-w-xl">{t('page.recipes.subtitle')}</p>
            </div>
          </div>

          {/* Search */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={recipeSearch}
                onChange={e => setRecipeSearch(e.target.value)}
                placeholder={t('page.recipes.search')}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>
            <Button variant="secondary"><Filter className="w-4 h-4" />Filter</Button>
          </div>

          {/* Species Filter */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {RECIPE_SPECIES_FILTER.map(s => (
              <button
                key={s}
                onClick={() => setRecipeSpeciesFilter(s)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                  recipeSpeciesFilter === s
                    ? 'bg-rose-500 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-rose-300'
                )}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Trending Dishes */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-rose-500" />
              <h2 className="text-lg font-bold text-slate-900">{t('page.recipes.trending')}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {TRENDING_DISHES.map(dish => (
                <Card key={dish.dish} className="p-3 text-center cursor-pointer" hover>
                  <span className="text-3xl mb-2 block">{dish.emoji}</span>
                  <p className="text-xs font-semibold text-slate-900 line-clamp-2 leading-tight mb-1">{dish.dish}</p>
                  <p className="text-xs font-bold text-emerald-600">{dish.trend}</p>
                  <p className="text-xs text-slate-400">{dish.region}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Chef Picks */}
          <Card className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <h2 className="font-bold text-slate-900">{t('page.recipes.featuredChefs')}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {CHEF_PICKS.map(chef => (
                <div key={chef.name} className="flex items-center gap-2 p-2 bg-white/60 rounded-xl">
                  <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {chef.flag}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">{chef.name}</p>
                    <p className="text-xs text-slate-500 truncate">{chef.specialty}</p>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-slate-700">{chef.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recipes Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Chef-Curated Recipes</h2>
              <Badge variant="default">{t('page.recipes.badge')}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecipes.map((recipe, i) => (
                <RecipeCard key={recipe.id} recipe={recipe} featured={i === 0} />
              ))}
            </div>
          </div>

          {/* Community */}
          <Card className="p-6 text-center border-dashed border-2 border-rose-200 bg-rose-50/30">
            <Camera className="w-10 h-10 text-rose-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 mb-1">{t('page.recipes.share')}</h3>
            <p className="text-sm text-slate-500 mb-4 max-w-md mx-auto">
              Are you a chef, restaurant owner, or passionate seafood cook? Share your recipe and reach 48,000+ seafood industry professionals worldwide.
            </p>
            <Button variant="primary" className="bg-rose-500 hover:bg-rose-600">
              <Plus className="w-4 h-4" />{t('page.recipes.submit')}
            </Button>
          </Card>

          {/* Seafood Culture */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4">{t('page.recipes.culture')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {SEAFOOD_CULTURE.map(item => (
                <Card key={item.country} className={`p-4 bg-gradient-to-br border ${item.color} cursor-pointer`} hover>
                  <span className="text-3xl mb-2 block">{item.emoji}</span>
                  <p className="text-sm font-bold text-slate-900">{item.country}</p>
                  <p className="text-xs text-slate-600">{item.dish}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Urner Barry ── */}
      {activeTab === 'urnerbarry' && (
        <div className="space-y-4">
          <Card className="p-5 bg-gradient-to-r from-ocean-900 to-slate-900">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-ocean-300" />
              <div>
                <h3 className="font-bold text-white">Urner Barry Market Intelligence</h3>
                <p className="text-ocean-300 text-sm mt-0.5">
                  AI-summarized reports from one of seafood&apos;s most trusted price reporting agencies. Full reports available to Premium subscribers.
                </p>
              </div>
            </div>
          </Card>
          <div className="space-y-3">
            {URNER_BARRY_SUMMARIES.map((report, i) => (
              <Card key={i} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="ocean">{report.species}</Badge>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />{report.date}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">{report.title}</h3>
                    <p className="text-sm text-emerald-600 font-medium mb-2">{report.highlight}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{report.detail}</p>
                  </div>
                  <Button variant="secondary" size="sm" className="flex-shrink-0">
                    <Download className="w-4 h-4" />Report
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          <Card className="p-5 border-dashed border-2 border-ocean-200 bg-ocean-50/50">
            <div className="text-center">
              <Award className="w-8 h-8 text-ocean-600 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-900 mb-1">{t('page.knowledge.premium.title')}</h3>
              <p className="text-sm text-slate-500 mb-3">Get full Urner Barry reports, live data feeds, and API access</p>
              <Button variant="primary">
                {t('page.knowledge.premium.title')} — {t('page.knowledge.premium.price')}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ── Species Guide ── */}
      {activeTab === 'species' && (
        <div className="space-y-6">
          {/* Species Selector */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {FISH_SPECIES.map(sp => (
              <button
                key={sp.id}
                onClick={() => setSelectedSpecies(sp.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap text-sm font-medium transition-all border flex-shrink-0',
                  selectedSpecies === sp.id
                    ? 'text-white border-transparent shadow-md'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                )}
                style={selectedSpecies === sp.id ? { backgroundColor: sp.color } : {}}
              >
                <span className="text-lg">{sp.emoji}</span>
                {sp.marketName}
              </button>
            ))}
          </div>

          {/* Species Profile */}
          <FishProfile sp={currentSpecies} />
        </div>
      )}
    </div>
  )
}
