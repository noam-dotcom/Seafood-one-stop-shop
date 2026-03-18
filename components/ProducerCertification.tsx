'use client'

import { X, Shield, CheckCircle, Globe, Star, Award, Package,
  Truck, Leaf, FileCheck, Activity, Lock, BarChart3, Users,
  MapPin, Calendar, Hash, Building2, Microscope, Fish,
  ThumbsUp, Printer,
} from 'lucide-react'
import { type Producer } from '@/lib/data'

// ─── deterministic mock data builder ─────────────────────────────────────────
function buildCertData(p: Producer) {
  const n = p.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const iso: Record<string, string> = {
    Norway:'NO',Chile:'CL','UK':'GB',USA:'US',Canada:'CA',Japan:'JP',
    Australia:'AU',Thailand:'TH',Vietnam:'VN',Indonesia:'ID',Ecuador:'EC',
    India:'IN',Bangladesh:'BD',China:'CN',Egypt:'EG',Israel:'IL',
    Maldives:'MV',France:'FR',Spain:'ES',Italy:'IT',Greece:'GR',
    Turkey:'TR',Malta:'MT',Iceland:'IS',Ireland:'IE',Mexico:'MX',
    Peru:'PE','Dominican Republic':'DO','Nicaragua':'NI',
  }
  const cc = iso[p.country] ?? 'XX'
  const yr = p.yearFounded ?? 2000
  const seqNum = String(n % 9000 + 1000)
  const regNum = `${cc}-AQ-${yr}-${seqNum}`
  const certNum = `SH-VPC-${cc}-${seqNum}-26`

  // Facility size based on capacity
  const facilityHa = p.supplyCapacityMT > 10000 ? (40 + n % 60) :
                     p.supplyCapacityMT > 5000  ? (18 + n % 22) :
                     p.supplyCapacityMT > 1000  ? (8  + n % 10) : (2 + n % 5)

  const coldStorageMT = Math.round(p.supplyCapacityMT * (0.15 + (n % 20) * 0.01))
  const employees = p.supplyCapacityMT > 15000 ? (800 + n % 400) :
                    p.supplyCapacityMT > 5000  ? (200 + n % 200) :
                    p.supplyCapacityMT > 1000  ? (60  + n % 60 ) : (15 + n % 25)

  const auditMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const lastAuditMo = auditMonths[n % 12]
  const lastAuditYr = 2025 + (n % 2 > 0 ? 0 : 1)
  const nextAuditMo = auditMonths[(n + 6) % 12]
  const nextAuditYr = lastAuditYr + 1

  const entityTypes = ['Joint Stock Company','Limited Liability Company','Private Limited Company','Cooperative','Corporation']
  const entityType = entityTypes[n % entityTypes.length]

  const vatId = `${cc}${yr}${seqNum}${String(n % 100).padStart(2,'0')}`

  const fsms = ['HACCP-based FSMS', 'ISO 22000:2018', 'FSSC 22000 v5.1', 'SQF Level 3', 'BRC Food Safety Issue 9']
  const fsm = fsms[n % fsms.length]

  const shippingModes = ['Reefer Container (Sea Freight)','Air Freight (Express Cold Chain)','Both Sea & Air Freight']
  const shipping = shippingModes[n % shippingModes.length]

  const leadTimes: Record<string,string> = {
    Norway:'3–5 days (air), 14–21 days (sea)',
    Japan:'2–4 days (air), 18–25 days (sea)',
    Iceland:'3–6 days (air), 12–18 days (sea)',
    Chile:'4–7 days (air), 22–28 days (sea)',
    Ecuador:'3–5 days (air), 18–24 days (sea)',
    Canada:'2–4 days (air), 10–14 days (sea)',
    USA:'1–3 days (air), 8–12 days (sea)',
    default:'4–7 days (air), 18–30 days (sea)',
  }
  const leadTime = leadTimes[p.country] ?? leadTimes.default

  const exportMarkets = (() => {
    const base = ['European Union','United States']
    const extra: Record<string,string[]> = {
      Norway: ['Japan','South Korea','China','Brazil','Israel'],
      Japan: ['USA','EU','Singapore','Hong Kong','South Korea'],
      Iceland: ['EU','Russia','USA','China'],
      Ecuador: ['EU','USA','Japan','South Korea'],
      Thailand: ['EU','USA','Japan','China','Middle East'],
      Vietnam: ['EU','USA','Japan','South Korea','China'],
      China: ['EU','USA','Southeast Asia','Middle East'],
      default: ['Middle East','Southeast Asia','Australia'],
    }
    return [...base, ...(extra[p.country] ?? extra.default)].slice(0, 5)
  })()

  const insurers = ['Lloyd\'s of London','Allianz Trade','Zurich Insurance','AXA XL','Chubb']
  const insurer = insurers[n % insurers.length]

  const banks = ['HSBC Trade Finance','Rabobank Agri','DNB Bank','BNP Paribas Trade','Standard Chartered']
  const bank = banks[n % banks.length]

  const paymentTerms = ['LC at Sight','30/60 Days Open Account (established clients)','TT Advance + LC','D/P Documents Against Payment']
  const payTerm = paymentTerms[n % paymentTerms.length]

  const certDetails: Record<string, { body: string; certNo: string; expires: string }> = {
    MSC:          { body: 'Marine Stewardship Council (UK)',         certNo: `MSC-F-${seqNum}-${yr}`,    expires: `Dec ${nextAuditYr}` },
    ASC:          { body: 'Aquaculture Stewardship Council (NL)',    certNo: `ASC-C-${seqNum}-${yr}`,    expires: `Jun ${nextAuditYr}` },
    BAP:          { body: 'Best Aquaculture Practices (USA)',        certNo: `BAP-${seqNum}-${yr}`,      expires: `Sep ${nextAuditYr}` },
    'GlobalG.A.P':{ body: 'GLOBALG.A.P. (Germany)',                 certNo: `GGN-${yr}-${seqNum}`,      expires: `Mar ${nextAuditYr}` },
    HALAL:        { body: 'IFANCA / Local Halal Authority',         certNo: `HLM-${seqNum}-${yr}`,      expires: `Jan ${nextAuditYr}` },
    KOSHER:       { body: 'Orthodox Union (USA)',                    certNo: `OU-KOSH-${seqNum}`,        expires: `Dec ${nextAuditYr}` },
    BRC:          { body: 'British Retail Consortium (UK)',          certNo: `BRC-${seqNum}-${yr}`,      expires: `Aug ${nextAuditYr}` },
    HACCP:        { body: 'Internal / Competent Authority',         certNo: `HACCP-${seqNum}-${yr}`,    expires: 'Ongoing' },
    CITES:        { body: 'CITES Secretariat (Switzerland)',         certNo: `CITES-${seqNum}-${yr}`,    expires: 'Per Shipment' },
    DOP:          { body: 'Italian Ministry of Agriculture',         certNo: `DOP-IT-${seqNum}`,         expires: 'Perpetual' },
  }

  const auditResults = ['PASS — Zero Major Non-Conformances','PASS — 1 Minor NC, Closed','PASS — Full Compliance','PASS — Grade A']
  const auditResult = auditResults[n % auditResults.length]

  const verificationOfficers = ['Dr. Sarah Chen, Chief Compliance Officer','Mr. James Okafor, Head of Producer Verification','Ms. Anika Rosenberg, Senior Auditor','Mr. Daniel Park, Verification Director']
  const officer = verificationOfficers[n % verificationOfficers.length]

  const hash = n

  const tiers = p.rating >= 4.8 ? 'PLATINUM — Elite Verified Partner' :
                p.rating >= 4.6 ? 'GOLD — Premium Verified Partner' :
                                  'SILVER — Standard Verified Partner'

  const tierColor = p.rating >= 4.8 ? 'from-slate-300 via-white to-slate-300 text-slate-800' :
                    p.rating >= 4.6 ? 'from-yellow-300 via-amber-100 to-yellow-300 text-amber-900' :
                                      'from-gray-300 via-slate-200 to-gray-300 text-slate-700'

  return {
    regNum, certNum, facilityHa, coldStorageMT, employees, entityType, vatId,
    lastAudit: `${lastAuditMo} ${lastAuditYr}`, nextAudit: `${nextAuditMo} ${nextAuditYr}`,
    fsm, shipping, leadTime, exportMarkets, insurer, bank, payTerm,
    certDetails, auditResult, officer, tiers, tierColor, hash,
    registrationDate: `${auditMonths[(n + 3) % 12]} ${2022 + (n % 3)}`,
    issuedDate: 'March 2026',
    validUntil: 'March 2027',
  }
}

const CERT_SECTION_COLORS: Record<string, string> = {
  'Company Identity':      'bg-blue-950',
  'Facility':              'bg-navy-900',
}

// ─── Section header ───────────────────────────────────────────────────────────
function SecHead({ num, icon, title }: { num: number; icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0B1E3F] text-yellow-400 font-bold text-sm shrink-0">
        {num}
      </div>
      <div className="flex items-center gap-2 flex-1">
        <span className="text-[#0B1E3F]">{icon}</span>
        <h3 className="font-bold text-[#0B1E3F] text-base tracking-wide uppercase text-sm">{title}</h3>
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-[#0B1E3F]/30 to-transparent" />
    </div>
  )
}

function InfoRow({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between py-1.5 border-b border-blue-50 last:border-0">
      <span className="text-xs text-slate-500 font-medium w-48 shrink-0">{label}</span>
      <span className={`text-xs text-right flex-1 ${mono ? 'font-mono text-[#0B1E3F] font-semibold' : 'text-slate-800'}`}>{value}</span>
    </div>
  )
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0">{children}</div>
}

// ─── Main component ───────────────────────────────────────────────────────────
export function ProducerCertification({ producer: p, onClose }: { producer: Producer; onClose: () => void }) {
  const d = buildCertData(p)

  const ratingStars = Array.from({ length: 5 }, (_, i) => i < Math.round(p.rating))

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-screen flex items-start justify-center py-8 px-4">
        <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden" style={{ fontFamily: '"Times New Roman", Georgia, serif' }}>

          {/* ══ HEADER COVER ════════════════════════════════════════════ */}
          <div className="relative bg-[#0B1E3F] text-white overflow-hidden">
            {/* Decorative diagonal stripe */}
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 12px)' }} />
            {/* Gold top bar */}
            <div className="h-1.5 bg-gradient-to-r from-yellow-600 via-yellow-300 to-yellow-600 w-full" />

            <div className="relative px-10 py-8">
              <div className="flex items-start justify-between">
                {/* Left: Platform branding */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
                    <span className="text-3xl">🌊</span>
                  </div>
                  <div>
                    <p className="text-yellow-400 text-xs font-sans tracking-[0.25em] uppercase font-semibold">SeaHub Global Trade Platform</p>
                    <p className="text-white text-xl font-bold mt-0.5" style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.05em' }}>
                      Verified Producer Certification
                    </p>
                    <p className="text-blue-200 text-xs mt-1 font-sans">Official Platform Verification Booklet · Confidential Trade Document</p>
                  </div>
                </div>
                {/* Right: Certificate number */}
                <div className="text-right">
                  <p className="text-yellow-300 text-[10px] font-sans tracking-widest uppercase">Certificate No.</p>
                  <p className="text-white font-mono text-sm font-bold mt-0.5">{d.certNum}</p>
                  <p className="text-blue-300 text-[10px] font-sans mt-2">Issued: {d.issuedDate}</p>
                  <p className="text-blue-300 text-[10px] font-sans">Valid Until: {d.validUntil}</p>
                </div>
              </div>

              {/* Producer name banner */}
              <div className="mt-6 border border-yellow-500/40 rounded-xl bg-white/5 backdrop-blur-sm px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-400/80 text-[10px] font-sans tracking-[0.3em] uppercase">This certifies that</p>
                    <h1 className="text-white text-2xl font-bold mt-1" style={{ fontFamily: 'Georgia, serif' }}>{p.name}</h1>
                    <p className="text-blue-200 text-sm mt-1 font-sans flex items-center gap-2">
                      <span>📍</span>
                      {p.region ? `${p.region}, ` : ''}{p.country}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-block px-4 py-2 rounded-xl bg-gradient-to-r ${d.tierColor} text-xs font-bold font-sans shadow-md`}>
                      {d.tiers}
                    </div>
                    <div className="flex items-center justify-end gap-1 mt-2">
                      {ratingStars.map((filled, i) => (
                        <svg key={i} className={`w-4 h-4 ${filled ? 'text-yellow-400' : 'text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-yellow-400 text-sm font-bold ml-1">{p.rating}/5.0</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Certification badges row */}
              <div className="mt-4 flex flex-wrap gap-2">
                {p.certifications.map(cert => (
                  <span key={cert} className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/20 border border-yellow-500/40 rounded-full text-yellow-300 text-[11px] font-sans font-semibold">
                    <CheckCircle className="w-3 h-3" /> {cert}
                  </span>
                ))}
              </div>
            </div>

            {/* Gold bottom bar */}
            <div className="h-1.5 bg-gradient-to-r from-yellow-600 via-yellow-300 to-yellow-600 w-full" />
          </div>

          {/* ══ DOCUMENT BODY ═══════════════════════════════════════════ */}
          <div className="bg-[#FAFBFD] px-10 py-8 space-y-8" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>

            {/* ── Section 1: Company Identity ── */}
            <section>
              <SecHead num={1} icon={<Building2 className="w-4 h-4" />} title="Company Identity & Legal Registration" />
              <Grid2>
                <InfoRow label="Legal Entity Type" value={d.entityType} />
                <InfoRow label="Registration Number" value={d.regNum} mono />
                <InfoRow label="Country of Incorporation" value={`${p.country} ${p.region ? `(${p.region})` : ''}`} />
                <InfoRow label="VAT / Tax Registration" value={d.vatId} mono />
                <InfoRow label="Year Founded" value={p.yearFounded ? String(p.yearFounded) : '—'} />
                <InfoRow label="Platform Registration" value={d.registrationDate} />
                <InfoRow label="Business Classification" value={
                  p.speciesGroups.includes('Value Added') || p.speciesGroups.includes('Seafood Specials')
                    ? 'Processing & Value-Added Manufacturer'
                    : p.certifications.includes('ASC') || p.certifications.includes('GlobalG.A.P')
                      ? 'Aquaculture Producer & Exporter'
                      : 'Wild Catch Harvester & Exporter'
                } />
                <InfoRow label="Verification Status" value={
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[11px] font-sans font-bold">
                    <CheckCircle className="w-3 h-3" /> Fully Verified
                  </span>
                } />
              </Grid2>
            </section>

            <hr className="border-blue-100" />

            {/* ── Section 2: Facility Information ── */}
            <section>
              <SecHead num={2} icon={<Building2 className="w-4 h-4" />} title="Facility Information & Production Capabilities" />
              <Grid2>
                <InfoRow label="Main Facility Location" value={`${p.region ?? 'N/A'}, ${p.country}`} />
                <InfoRow label="Facility Area" value={`${d.facilityHa} hectares (approx.)`} />
                <InfoRow label="Annual Production Capacity" value={<span className="font-bold text-emerald-700 font-sans">{p.supplyCapacityMT.toLocaleString()} MT / year</span>} />
                <InfoRow label="Cold Storage Capacity" value={`${d.coldStorageMT.toLocaleString()} MT`} />
                <InfoRow label="Workforce" value={`${d.employees.toLocaleString()} employees`} />
                <InfoRow label="Processing Technology" value="Modern automated processing lines with CCP monitoring" />
                <InfoRow label="Temperature Management" value="−60°C to +4°C full cold chain (HACCP-controlled)" />
                <InfoRow label="Water Source & Treatment" value="Certified potable water with UV + ozone treatment" />
              </Grid2>
            </section>

            <hr className="border-blue-100" />

            {/* ── Section 3: Species & Product Portfolio ── */}
            <section>
              <SecHead num={3} icon={<Fish className="w-4 h-4" />} title="Species Portfolio & Product Catalog" />
              <div className="mb-3 flex flex-wrap gap-2">
                {p.speciesGroups.map(sp => (
                  <span key={sp} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-xs font-sans font-semibold">
                    🐟 {sp}
                  </span>
                ))}
              </div>
              <Grid2>
                <InfoRow label="Primary Species" value={p.speciesGroups[0] ?? '—'} />
                <InfoRow label="Total SKUs on Platform" value={`${5 + (p.id.charCodeAt(p.id.length-1) % 8)} active products`} />
                <InfoRow label="Min. Order Quantity" value="500 kg (standard pallet)" />
                <InfoRow label="Max. Order Quantity" value={`${Math.round(p.supplyCapacityMT * 0.03).toLocaleString()} MT (single order)`} />
                <InfoRow label="Packaging Options" value="Master carton · Retail pack · Bulk IWP" />
                <InfoRow label="Labelling Compliance" value="EU 1169/2011 · FDA 21 CFR · JAS (Japan)" />
              </Grid2>
            </section>

            <hr className="border-blue-100" />

            {/* ── Section 4: Certifications & Standards ── */}
            <section>
              <SecHead num={4} icon={<Award className="w-4 h-4" />} title="Quality Certifications & Standards" />
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-sans border-collapse">
                  <thead>
                    <tr className="bg-[#0B1E3F]">
                      {['Certification','Issuing Body','Certificate No.','Expiry / Review','Status'].map(h => (
                        <th key={h} className="px-3 py-2.5 text-left text-yellow-300 font-semibold tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {p.certifications.map((cert, i) => {
                      const cd = d.certDetails[cert] ?? { body: 'Competent Authority', certNo: `CERT-${cert}-${p.id}`, expires: 'Annual' }
                      return (
                        <tr key={cert} className={i % 2 === 0 ? 'bg-white' : 'bg-blue-50/50'}>
                          <td className="px-3 py-2.5 font-bold text-[#0B1E3F]">{cert}</td>
                          <td className="px-3 py-2.5 text-slate-600">{cd.body}</td>
                          <td className="px-3 py-2.5 font-mono text-slate-700">{cd.certNo}</td>
                          <td className="px-3 py-2.5 text-slate-600">{cd.expires}</td>
                          <td className="px-3 py-2.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold">
                              <CheckCircle className="w-2.5 h-2.5" /> ACTIVE
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            <hr className="border-blue-100" />

            {/* ── Section 5: Quality Assurance Program ── */}
            <section>
              <SecHead num={5} icon={<Microscope className="w-4 h-4" />} title="Quality Assurance Program" />
              <Grid2>
                <InfoRow label="QA System Framework" value={d.fsm} />
                <InfoRow label="In-House Laboratory" value="ISO/IEC 17025 accredited testing lab" />
                <InfoRow label="Sampling Frequency" value="Every batch — microbiological, chemical & sensory" />
                <InfoRow label="Traceability System" value="Lot-level digital traceability (catch-to-export)" />
                <InfoRow label="Shelf-Life Validation" value="Validated under worst-case storage conditions" />
                <InfoRow label="Species Authentification" value="DNA barcoding on request (CFIA protocol)" />
                <InfoRow label="Residue Testing" value="Antibiotics, heavy metals, dioxins — per EU 37/2010" />
                <InfoRow label="QA Team Size" value={`${3 + (p.id.charCodeAt(0) % 8)} dedicated QA specialists`} />
              </Grid2>
            </section>

            <hr className="border-blue-100" />

            {/* ── Section 6: Food Safety Management ── */}
            <section>
              <SecHead num={6} icon={<Shield className="w-4 h-4" />} title="Food Safety Management System" />
              <Grid2>
                <InfoRow label="FSMS Standard" value={d.fsm} />
                <InfoRow label="HACCP Plan" value="Approved by Competent Authority · Annual review" />
                <InfoRow label="Critical Control Points" value={`${3 + (p.id.charCodeAt(1) % 4)} CCPs identified and monitored`} />
                <InfoRow label="Corrective Action System" value="Documented CAR procedure with 48h response SLA" />
                <InfoRow label="Allergen Management" value="Dedicated allergen control procedure in place" />
                <InfoRow label="Pest Control" value="Third-party contracted — monthly inspection schedule" />
                <InfoRow label="Foreign Object Detection" value="X-ray + metal detection on 100% of output lines" />
                <InfoRow label="Recall Capability" value="Mock recall tested annually — ≤4h full trace-back" />
              </Grid2>
            </section>

            <hr className="border-blue-100" />

            {/* ── Section 7: Sustainability & Environment ── */}
            <section>
              <SecHead num={7} icon={<Leaf className="w-4 h-4" />} title="Sustainability & Environmental Compliance" />
              <Grid2>
                <InfoRow label="Sustainability Standard" value={
                  p.certifications.includes('MSC') ? 'MSC Chain-of-Custody — Wild Catch Fishery' :
                  p.certifications.includes('ASC') ? 'ASC Chain-of-Custody — Responsible Aquaculture' :
                  'Internal Sustainability Program (target MSC/ASC by 2027)'
                } />
                <InfoRow label="Bycatch Management" value={p.certifications.includes('MSC') ? 'MSC-compliant bycatch minimization plan' : 'Species-specific monitoring protocols'} />
                <InfoRow label="Wastewater Treatment" value="Certified biological wastewater treatment plant" />
                <InfoRow label="Solid Waste Recycling" value={`${60 + (p.id.charCodeAt(0) % 35)}% of processing waste recycled`} />
                <InfoRow label="Carbon Reduction Plan" value="Net-zero roadmap filed with platform (target 2035)" />
                <InfoRow label="Energy Efficiency" value="ISO 50001 energy management system in progress" />
                <InfoRow label="Water Consumption" value={`${(2.5 + (p.id.charCodeAt(0) % 20) * 0.1).toFixed(1)} L per kg product — below industry avg.`} />
                <InfoRow label="Environmental License" value={`${p.country} Env. Permit No. EP-${p.id.toUpperCase()}-${p.yearFounded ?? 2000}`} />
              </Grid2>
            </section>

            <hr className="border-blue-100" />

            {/* ── Section 8: Supply Chain & Logistics ── */}
            <section>
              <SecHead num={8} icon={<Truck className="w-4 h-4" />} title="Supply Chain & Logistics Capabilities" />
              <Grid2>
                <InfoRow label="Shipping Modes" value={d.shipping} />
                <InfoRow label="Lead Times" value={d.leadTime} />
                <InfoRow label="Cold Chain Certification" value="ATP-certified reefer transport throughout" />
                <InfoRow label="Export Markets" value={d.exportMarkets.join(' · ')} />
                <InfoRow label="Incoterms Offered" value="FOB · CIF · DAP · EXW" />
                <InfoRow label="Palletization" value="EUR-pallet / CHEP compatible · ISPM-15 compliant" />
                <InfoRow label="Freight Forwarder" value="Tier-1 3PL partners in origin country" />
                <InfoRow label="Real-Time Monitoring" value="IoT temperature logger on all shipments" />
              </Grid2>
            </section>

            <hr className="border-blue-100" />

            {/* ── Section 9: Trade References & Financial ── */}
            <section>
              <SecHead num={9} icon={<BarChart3 className="w-4 h-4" />} title="Trade References & Financial Standing" />
              <Grid2>
                <InfoRow label="Primary Banking Partner" value={d.bank} />
                <InfoRow label="Trade Finance Facility" value="Confirmed revolving LC facility in place" />
                <InfoRow label="Payment Terms" value={d.payTerm} />
                <InfoRow label="Trade Credit Insurance" value={`${d.insurer} — Export Credit Policy`} />
                <InfoRow label="Credit Rating" value={`${p.rating >= 4.8 ? 'AA — Excellent' : p.rating >= 4.6 ? 'A+ — Strong' : 'A — Good'} (SeaHub Internal Score)`} />
                <InfoRow label="Platform Transactions" value={`${(20 + (p.id.charCodeAt(0) % 80))} completed orders on platform`} />
                <InfoRow label="Dispute History" value="No open disputes — clean trade record" />
                <InfoRow label="Annual Export Turnover" value={`USD ${(p.supplyCapacityMT * (8 + p.id.charCodeAt(0) % 12) / 1000).toFixed(1)}M (estimated)`} />
              </Grid2>
            </section>

            <hr className="border-blue-100" />

            {/* ── Section 10: Regulatory Compliance ── */}
            <section>
              <SecHead num={10} icon={<FileCheck className="w-4 h-4" />} title="Regulatory & Customs Compliance" />
              <Grid2>
                <InfoRow label="EU Approved Establishment" value={`EU Reg. No. ${p.country.slice(0,2).toUpperCase()} ${p.id.toUpperCase()}-${p.yearFounded ?? 2000}`} />
                <InfoRow label="FDA Registration (USA)" value={`FDA Est. No. ${(d.hash % 90000 + 10000)}`} />
                <InfoRow label="Country SPS Agreement" value={`Bilateral SPS protocol — ${p.country} ↔ EU / USA / Japan`} />
                <InfoRow label="Export Health Certificate" value="Official Veterinary Certificate issued per shipment" />
                <InfoRow label="CITES Compliance" value={p.certifications.includes('CITES') ? 'CITES Appendix II permit holder' : 'N/A — non-CITES species'} />
                <InfoRow label="Sanitary Registration" value={`${p.country} Competent Authority — License No. ${d.regNum}`} />
                <InfoRow label="Customs AEO Status" value={`${p.rating >= 4.7 ? 'AEO-C (Customs Simplifications) certified' : 'Standard customs clearance'}`} />
                <InfoRow label="Anti-IUU Compliance" value="Catch documentation scheme in full compliance" />
              </Grid2>
            </section>

            <hr className="border-blue-100" />

            {/* ── Section 11: Audit History ── */}
            <section>
              <SecHead num={11} icon={<Activity className="w-4 h-4" />} title="Audit History & Inspection Records" />
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-xs font-sans border-collapse">
                  <thead>
                    <tr className="bg-[#0B1E3F]">
                      {['Audit Date','Auditor Type','Scope','Result','NCs'].map(h => (
                        <th key={h} className="px-3 py-2.5 text-left text-yellow-300 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { date: d.lastAudit,    type: 'Third-Party',    scope: 'Full Facility + QMS',    result: d.auditResult,                                 ncs: d.auditResult.includes('0') ? 'None' : '1 Minor (Closed)' },
                      { date: `${['Mar','Sep','Oct','Jan'][d.hash%4]} ${(p.yearFounded ?? 2000) + Math.max(0,2024-(p.yearFounded??2000)-1)}`, type: 'Competent Authority', scope: 'Food Safety + Labelling', result: 'PASS — Compliant',  ncs: 'None' },
                      { date: `${['Jun','Nov','Feb','Aug'][d.hash%4]} 2023`, type: 'Customer Audit',  scope: 'HACCP + Cold Chain',    result: 'PASS — Grade A',                              ncs: 'None' },
                    ].map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-blue-50/50'}>
                        <td className="px-3 py-2.5 font-semibold text-slate-700">{row.date}</td>
                        <td className="px-3 py-2.5 text-slate-600">{row.type}</td>
                        <td className="px-3 py-2.5 text-slate-600">{row.scope}</td>
                        <td className="px-3 py-2.5">
                          <span className="text-emerald-700 font-bold">{row.result}</span>
                        </td>
                        <td className="px-3 py-2.5 text-slate-500">{row.ncs}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Grid2>
                <InfoRow label="Next Scheduled Audit" value={d.nextAudit} />
                <InfoRow label="Audit Frequency" value="Annual third-party + bi-annual internal" />
              </Grid2>
            </section>

            <hr className="border-blue-100" />

            {/* ── Section 12: Digital Verification & Platform Status ── */}
            <section>
              <SecHead num={12} icon={<Lock className="w-4 h-4" />} title="Digital Verification & Platform Status" />
              <Grid2>
                <InfoRow label="Platform Membership" value={d.tiers} />
                <InfoRow label="Verification Officer" value={d.officer} />
                <InfoRow label="Verification Date" value={d.issuedDate} />
                <InfoRow label="Document Valid Until" value={d.validUntil} />
                <InfoRow label="Digital Certificate Hash" value={<span className="font-mono text-[10px] text-slate-500">{btoa(d.certNum).slice(0,24)}</span>} />
                <InfoRow label="Blockchain Record" value={<span className="text-emerald-700 font-sans font-semibold text-[11px]">✓ Immutable record on SeaHub Ledger</span>} />
                <InfoRow label="Data Privacy" value="GDPR Art. 28 processor agreement on file" />
                <InfoRow label="Platform Profile" value={<span className="text-blue-600 font-sans text-[11px] underline cursor-pointer">View live profile → seahub.io/producers/{p.id}</span>} />
              </Grid2>
            </section>
          </div>

          {/* ══ CERTIFICATION FOOTER ════════════════════════════════════ */}
          <div className="relative bg-[#0B1E3F] text-white overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-yellow-600 via-yellow-300 to-yellow-600" />
            <div className="px-10 py-8">
              <div className="grid grid-cols-3 gap-8">

                {/* Seal */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-24 h-24 rounded-full border-4 border-yellow-500 flex flex-col items-center justify-center bg-yellow-500/10 shadow-lg">
                    <span className="text-3xl">🌊</span>
                    <p className="text-yellow-400 text-[8px] font-bold text-center leading-tight mt-1 font-sans tracking-wide">SEAHUB<br/>VERIFIED</p>
                  </div>
                  <p className="text-yellow-400/70 text-[9px] mt-2 text-center font-sans tracking-widest uppercase">Official Seal</p>
                </div>

                {/* Declaration */}
                <div className="text-center">
                  <p className="text-blue-200 text-[11px] leading-relaxed font-sans italic">
                    "This certification confirms that <strong className="text-white not-italic">{p.name}</strong> has successfully completed SeaHub's comprehensive producer verification program and meets all platform standards for quality, safety, traceability and regulatory compliance."
                  </p>
                  <p className="text-yellow-400 text-[10px] mt-3 font-sans font-semibold tracking-wide">
                    — SeaHub Global Trade Platform
                  </p>
                </div>

                {/* Signature block */}
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-32 border-b border-yellow-500/40 mb-2" />
                  <p className="text-white text-[11px] font-semibold font-sans">{d.officer.split(',')[0]}</p>
                  <p className="text-blue-300 text-[10px] font-sans">{d.officer.split(',').slice(1).join(',').trim()}</p>
                  <p className="text-yellow-400/70 text-[9px] mt-2 font-sans tracking-wide uppercase">Authorised Signatory</p>
                  <p className="text-blue-300/60 text-[9px] font-sans mt-0.5">{d.issuedDate}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <p className="text-blue-300/50 text-[9px] font-sans">
                  Certificate No. {d.certNum} · This document is digitally signed and tamper-evident.
                  Verify authenticity at seahub.io/verify · © {new Date().getFullYear()} SeaHub Global Trade Platform Ltd. All rights reserved.
                </p>
                <p className="text-blue-300/50 text-[9px] font-sans text-right">
                  Page 1 of 1 · Confidential
                </p>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-yellow-600 via-yellow-300 to-yellow-600" />
          </div>

          {/* ══ CONTROL BAR (outside the doc, for UX) ═══════════════════ */}
          <div className="bg-slate-100 border-t border-slate-200 px-6 py-3 flex items-center justify-between">
            <p className="text-xs text-slate-500 font-sans flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              Confidential · For authorized trade parties only · SeaHub Verified Producer Program
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold font-sans bg-[#0B1E3F] text-white rounded-lg hover:bg-[#162D5A] transition-colors"
              >
                <Printer className="w-3.5 h-3.5" /> Print / Save PDF
              </button>
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold font-sans bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
