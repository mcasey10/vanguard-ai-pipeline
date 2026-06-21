import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Sparkles, PenLine, ChevronDown, ChevronUp } from 'lucide-react'

// ---------------------------------------------------------------------------
// Coach mark bubble (same structure as FS-AUTO-1 / FS-MAN-2)
// ---------------------------------------------------------------------------

function CoachMarkBubble({ text, onDismiss }: { text: string; onDismiss: () => void }) {
  return (
    <div className="relative" style={{ filter: 'drop-shadow(0px 4px 8px rgba(4,5,5,0.2))' }}>
      <div className="absolute" style={{ left: 133, top: -8, width: 0, height: 0,
        borderLeft: '7px solid transparent', borderRight: '7px solid transparent',
        borderBottom: '8px solid white' }} />
      <div className="bg-white rounded-[4px] w-[280px]">
        <div className="flex items-center justify-end pt-[10px] pb-[4px] px-[12px]">
          <button onClick={onDismiss} className="text-[14px] text-vg-ink-muted cursor-pointer leading-none" aria-label="Dismiss tip">×</button>
        </div>
        <div className="px-[12px] pb-[12px]">
          <p className="text-[13px] text-vg-ink leading-normal">{text}</p>
        </div>
      </div>
    </div>
  )
}

function HintBadge({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-[14px] h-[14px] border border-vg-ink-muted rounded-full flex items-center justify-center shrink-0 cursor-pointer" aria-label="Learn about Wait & Save">
      <span className="text-[9px] text-vg-ink-muted leading-none">?</span>
    </button>
  )
}

function RadioDot({ selected }: { selected: boolean }) {
  return (
    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${selected ? 'border-vg-ink' : 'border-vg-ink-muted'}`}>
      {selected && <div className="w-2 h-2 rounded-full bg-vg-ink" />}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Canonical lot data (from pm/08-sample-dataset.json — never recalled from memory)
// NAV: VTSAX $145.20, VBTLX $9.18
// ---------------------------------------------------------------------------

type Lot = {
  lotId: string
  acquisitionDate: string   // display format MM/DD/YYYY
  shares: number
  costPerShare: number
  totalCost: number
  currentValue: number
  gainLoss: number          // unrealized_gain_loss
  gainLossPerShare: number  // nav - costPerShare
  holdingPeriod: 'LT' | 'ST'
  waitAndSave?: {
    daysUntilLT: number
    ltConversionDate: string
    savingsAmount: string
    noticeText: string
  }
}

const VTSAX_LOTS: Lot[] = [
  // LT lots — ordered by acquisition date
  { lotId: 'T-VTSAX-01', acquisitionDate: '03/15/2004', shares: 200,  costPerShare: 35.20,  totalCost: 7040.00,   currentValue: 29040.00, gainLoss: 22000.00,  gainLossPerShare: 110.00, holdingPeriod: 'LT' },
  { lotId: 'T-VTSAX-02', acquisitionDate: '11/20/2008', shares: 300,  costPerShare: 25.40,  totalCost: 7620.00,   currentValue: 43560.00, gainLoss: 35940.00,  gainLossPerShare: 119.80, holdingPeriod: 'LT' },
  { lotId: 'T-VTSAX-03', acquisitionDate: '06/10/2012', shares: 250,  costPerShare: 45.80,  totalCost: 11450.00,  currentValue: 36300.00, gainLoss: 24850.00,  gainLossPerShare: 99.40,  holdingPeriod: 'LT' },
  { lotId: 'T-VTSAX-04', acquisitionDate: '09/15/2016', shares: 200,  costPerShare: 62.30,  totalCost: 12460.00,  currentValue: 29040.00, gainLoss: 16580.00,  gainLossPerShare: 82.90,  holdingPeriod: 'LT' },
  { lotId: 'T-VTSAX-05', acquisitionDate: '04/01/2020', shares: 150,  costPerShare: 72.50,  totalCost: 10875.00,  currentValue: 21780.00, gainLoss: 10905.00,  gainLossPerShare: 72.70,  holdingPeriod: 'LT' },
  { lotId: 'T-VTSAX-06', acquisitionDate: '07/15/2023', shares: 100,  costPerShare: 110.20, totalCost: 11020.00,  currentValue: 14520.00, gainLoss: 3500.00,   gainLossPerShare: 35.00,  holdingPeriod: 'LT' },
  { lotId: 'T-VTSAX-07', acquisitionDate: '11/10/2024', shares: 75,   costPerShare: 138.50, totalCost: 10387.50,  currentValue: 10890.00, gainLoss: 502.50,    gainLossPerShare: 6.70,   holdingPeriod: 'LT' },
  // ST lots
  { lotId: 'T-VTSAX-08', acquisitionDate: '08/15/2025', shares: 150,  costPerShare: 132.40, totalCost: 19860.00,  currentValue: 21780.00, gainLoss: 1920.00,   gainLossPerShare: 12.80,  holdingPeriod: 'ST' },
  { lotId: 'T-VTSAX-09', acquisitionDate: '11/20/2025', shares: 172,  costPerShare: 128.90, totalCost: 22170.80,  currentValue: 24974.40, gainLoss: 2803.60,   gainLossPerShare: 16.30,  holdingPeriod: 'ST',
    waitAndSave: {
      daysUntilLT: 166,          // from PRD 10 VT8 (note: arithmetically 177 from 2026-05-27; dataset uses 223 from as_of_date 2026-04-11; Figma/VT8 display 166 — see dataset note)
      ltConversionDate: '2026-11-20',
      savingsAmount: '$37.03',
      noticeText: 'Your estimated federal tax will be reduced by $37.03, if you wait until this lot converts to a long-term holding. This lot converts to a long-term holding in 166 days.',
    },
  },
]

const VBTLX_LOTS: Lot[] = [
  // LT lots with harvestable losses
  { lotId: 'T-VBTLX-01', acquisitionDate: '07/15/2019', shares: 1500, costPerShare: 11.20, totalCost: 16800.00, currentValue: 13770.00, gainLoss: -3030.00, gainLossPerShare: -2.02, holdingPeriod: 'LT' },
  { lotId: 'T-VBTLX-02', acquisitionDate: '10/20/2021', shares: 2000, costPerShare: 11.45, totalCost: 22900.00, currentValue: 18360.00, gainLoss: -4540.00, gainLossPerShare: -2.27, holdingPeriod: 'LT' },
  { lotId: 'T-VBTLX-03', acquisitionDate: '05/10/2023', shares: 1500, costPerShare: 9.65,  totalCost: 14475.00, currentValue: 13770.00, gainLoss: -705.00,  gainLossPerShare: -0.47, holdingPeriod: 'LT' },
  // ST lot
  { lotId: 'T-VBTLX-04', acquisitionDate: '09/20/2025', shares: 600,  costPerShare: 9.22,  totalCost: 5532.00,  currentValue: 5508.00,  gainLoss: -24.00,   gainLossPerShare: -0.04, holdingPeriod: 'ST' },
]

const LOT_DATA: Record<string, Lot[]> = { VTSAX: VTSAX_LOTS, VBTLX: VBTLX_LOTS }

function fmt(n: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n)
}
function fmtDollar(n: number): string {
  const abs = Math.abs(n)
  const s = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(abs)
  return n < 0 ? `−${s}` : s
}

// ---------------------------------------------------------------------------
// Lot Detail Header (Figma 376:4775 — bg-[#f0f0f0], 36px)
// ---------------------------------------------------------------------------

function LotDetailHeader() {
  return (
    <div className="flex h-9 items-center overflow-clip px-3 w-[1375px] bg-[#f0f0f0] shrink-0">
      <div className="w-[220px] flex items-center justify-between pr-2 shrink-0 h-full">
        <span className="text-[12px] font-semibold text-vg-ink-muted">Shares to sell</span>
      </div>
      <div className="flex-1 min-w-px" />
      <div className="w-[100px] flex items-center justify-end gap-0.5 shrink-0 h-full">
        <span className="text-[12px] font-semibold text-vg-ink-muted text-right whitespace-nowrap">Shares owned</span>
        <span className="text-[10px] text-vg-ink-muted">⇅</span>
      </div>
      <div className="flex-1 min-w-px" />
      <div className="w-[120px] flex items-center justify-end gap-0.5 shrink-0 h-full">
        <span className="text-[12px] font-semibold text-vg-ink-muted text-right whitespace-nowrap">Total cost</span>
        <span className="text-[10px] text-vg-ink-muted">⇅</span>
      </div>
      <div className="flex-1 min-w-px" />
      <div className="w-[160px] flex items-center justify-end gap-0.5 shrink-0 h-full">
        <span className="text-[12px] font-semibold text-vg-ink-muted text-right whitespace-nowrap overflow-hidden text-ellipsis">Est. gain/loss (per share)</span>
        <span className="text-[10px] text-vg-ink-muted">⇅</span>
      </div>
      <div className="flex-1 min-w-px" />
      <div className="w-[150px] flex items-center justify-end gap-0.5 shrink-0 h-full">
        <span className="text-[12px] font-semibold text-vg-ink-muted text-right whitespace-nowrap">Est. available proceeds</span>
        <span className="text-[10px] text-vg-ink-muted">⇅</span>
      </div>
      <div className="flex-1 min-w-px" />
      <div className="w-[120px] flex items-center gap-0.5 shrink-0 h-full">
        <span className="text-[12px] font-semibold text-vg-ink-muted whitespace-nowrap">Date acquired</span>
        <span className="text-[10px] text-vg-ink-muted">⇅</span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Section header for LT / ST groupings
// ---------------------------------------------------------------------------

function LotSectionHeader({ label }: { label: string }) {
  return (
    <div className="flex h-9 items-center px-3 bg-[#f8f8f8] border-t border-[#e8e9e9] w-full shrink-0">
      <span className="text-[12px] font-semibold text-vg-ink-muted">{label}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Normal Lot Row (bg-[#fafafa], 48px)
// ---------------------------------------------------------------------------

function NormalLotRow({ lot, sharesInput, onSharesChange }:
  { lot: Lot; sharesInput: string; onSharesChange: (v: string) => void }) {
  const isGain = lot.gainLoss >= 0
  const glColor = isGain ? 'text-[#007a00]' : 'text-[#c8102e]'

  return (
    <div className="flex h-12 items-center overflow-clip px-3 w-[1375px] bg-[#fafafa] border-b border-[#e8e9e9] shrink-0">
      {/* Shares to sell — 220px: input + All checkbox */}
      <div className="w-[220px] flex items-center gap-2 shrink-0 h-full">
        <input
          type="text"
          inputMode="numeric"
          value={sharesInput}
          onChange={e => onSharesChange(e.target.value.replace(/[^\d.]/g, ''))}
          className="w-[120px] h-[28px] px-3 border border-vg-ink rounded-[4px] text-[14px] text-vg-ink text-right bg-white focus:outline-none focus:ring-2 focus:ring-vg-ink/20"
        />
        <label className="flex items-center gap-1.5 cursor-pointer">
          <div className="w-[13px] h-[13px] border border-vg-ink rounded-[2px] bg-white shrink-0" />
          <span className="text-[12px] text-vg-ink whitespace-nowrap">All</span>
        </label>
      </div>
      <div className="flex-1 min-w-px" />
      {/* Shares owned — 100px */}
      <div className="w-[100px] flex items-center justify-end shrink-0 h-full">
        <span className="text-[12px] text-vg-ink whitespace-nowrap">{fmt(lot.shares, 3)}</span>
      </div>
      <div className="flex-1 min-w-px" />
      {/* Total cost — 120px */}
      <div className="w-[120px] flex items-center justify-end shrink-0 h-full">
        <span className="text-[12px] text-vg-ink whitespace-nowrap">{fmtDollar(lot.totalCost)}</span>
      </div>
      <div className="flex-1 min-w-px" />
      {/* Est. gain/loss (per share) — 160px: two lines */}
      <div className="w-[160px] flex flex-col items-end justify-center gap-[3px] shrink-0 h-full py-1.5">
        <div className="flex items-center gap-1">
          <span className={`text-[12px] font-bold ${glColor}`}>{isGain ? '↑' : '↓'}</span>
          <span className={`text-[12px] font-bold ${glColor} whitespace-nowrap`}>{fmtDollar(Math.abs(lot.gainLoss))}</span>
        </div>
        <span className="text-[12px] text-vg-ink-muted whitespace-nowrap">({isGain ? '+' : '−'}${Math.abs(lot.gainLossPerShare).toFixed(2)})</span>
      </div>
      <div className="flex-1 min-w-px" />
      {/* Est. available proceeds — 150px */}
      <div className="w-[150px] flex items-center justify-end shrink-0 h-full">
        <span className="text-[12px] text-vg-ink whitespace-nowrap">{fmtDollar(lot.currentValue)}</span>
      </div>
      <div className="flex-1 min-w-px" />
      {/* Date acquired — 120px */}
      <div className="w-[120px] flex items-center shrink-0 h-full">
        <span className="text-[12px] text-vg-ink whitespace-nowrap">{lot.acquisitionDate}</span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Wait & Save Lot Row (bg-[#fff8e8], amber left accent, inline notice)
// ---------------------------------------------------------------------------

function WaitSaveLotRow({ lot, sharesInput, onSharesChange, showHint, hintsVisible, onHintClick }:
  { lot: Lot; sharesInput: string; onSharesChange: (v: string) => void
    showHint: boolean; hintsVisible: boolean; onHintClick: () => void }) {
  const ws = lot.waitAndSave!

  return (
    <div className="flex w-full bg-[#fff8e8] border-b border-[#e8e9e9] shrink-0">
      {/* Amber left accent — #ffad00, 4px wide, full height */}
      <div className="bg-[#ffad00] w-1 self-stretch shrink-0" />

      <div className="flex flex-col flex-1 pb-2">
        {/* Lot data row — same columns as NormalLotRow */}
        <div className="flex h-12 items-center overflow-clip px-2 w-[1375px]">
          <div className="w-[220px] flex items-center gap-2 shrink-0 h-full">
            <input
              type="text"
              inputMode="numeric"
              value={sharesInput}
              onChange={e => onSharesChange(e.target.value.replace(/[^\d.]/g, ''))}
              className="w-[120px] h-[28px] px-3 border border-vg-ink rounded-[4px] text-[14px] text-vg-ink text-right bg-white focus:outline-none focus:ring-2 focus:ring-vg-ink/20"
            />
            <label className="flex items-center gap-1.5 cursor-pointer">
              <div className="w-[13px] h-[13px] border border-vg-ink rounded-[2px] bg-white shrink-0" />
              <span className="text-[12px] text-vg-ink whitespace-nowrap">All</span>
            </label>
          </div>
          <div className="flex-1 min-w-px" />
          <div className="w-[100px] flex items-center justify-end shrink-0 h-full">
            <span className="text-[12px] text-vg-ink whitespace-nowrap">{fmt(lot.shares, 3)}</span>
          </div>
          <div className="flex-1 min-w-px" />
          <div className="w-[120px] flex items-center justify-end shrink-0 h-full">
            <span className="text-[12px] text-vg-ink whitespace-nowrap">{fmtDollar(lot.totalCost)}</span>
          </div>
          <div className="flex-1 min-w-px" />
          <div className="w-[160px] flex flex-col items-end justify-center gap-[3px] shrink-0 h-full py-1.5">
            <div className="flex items-center gap-1">
              <span className="text-[12px] font-bold text-[#007a00]">↑</span>
              <span className="text-[12px] font-bold text-[#007a00] whitespace-nowrap">{fmtDollar(lot.gainLoss)}</span>
            </div>
            <span className="text-[12px] text-vg-ink-muted whitespace-nowrap">(+${lot.gainLossPerShare.toFixed(2)})</span>
          </div>
          <div className="flex-1 min-w-px" />
          <div className="w-[150px] flex items-center justify-end shrink-0 h-full">
            <span className="text-[12px] text-vg-ink whitespace-nowrap">{fmtDollar(lot.currentValue)}</span>
          </div>
          <div className="flex-1 min-w-px" />
          <div className="w-[120px] flex items-center shrink-0 h-full">
            <span className="text-[12px] text-vg-ink whitespace-nowrap">{lot.acquisitionDate}</span>
          </div>
        </div>

        {/* Wait & Save inline notice */}
        <div className="flex items-center gap-2.5 px-2.5 pb-1">
          <span className="text-[14px] font-bold text-[#ffad00] shrink-0">⚠</span>
          <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">Wait &amp; Save opportunity</span>
          <p className="text-[12px] text-vg-ink flex-1">{ws.noticeText}</p>
          {showHint && hintsVisible && (
            <HintBadge onClick={onHintClick} />
          )}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Collapsed active fund row — shown for the OTHER active fund when one is
// expanded into lot detail. Same 96px structure as FS-MAN-2 (64px main +
// 32px details) but "Lot details ▾" navigates to /manual-lot with that fund.
// Matches Figma FS-MAN-LOT: 388:2534 (VBTLX at y=777, 96px when VTSAX expanded)
// ---------------------------------------------------------------------------

type CollapsedActiveFundData = {
  ticker: string; fullName: string; shares: string; balance: string
  sellAmount: string
  estSTGains: string; estSTColor: string
  estLTGains: string; estLTColor: string
  estTax: string
  impact: string; impactColor: string
  rationale: string
  waitAndSave?: string
}

function CollapsedActiveFundRow({ fund, onLotDetails }: {
  fund: CollapsedActiveFundData
  onLotDetails: (ticker: string) => void
}) {
  return (
    <div className="flex flex-col border-b border-[#e8e9e9] w-full bg-white">
      {/* Main Row — 64px */}
      <div className="flex h-16 items-center overflow-hidden px-3 w-full bg-white">
        <div className="w-[280px] h-full flex flex-col justify-center gap-[3px] px-2 shrink-0 overflow-hidden">
          <span className="text-[12px] text-vg-ink-muted truncate">{fund.fullName}</span>
          <a className="text-[14px] font-bold text-[#1255cc] underline whitespace-nowrap">{fund.ticker}</a>
        </div>
        <div className="w-[140px] h-full flex flex-col justify-center gap-[3px] px-2 shrink-0 overflow-hidden">
          <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">{fund.shares} shares</span>
          <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">{fund.balance}</span>
        </div>
        <div className="w-[128px] h-full flex flex-col justify-center gap-[3px] px-1 shrink-0 overflow-hidden">
          <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">SELL AMOUNT</span>
          <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">{fund.sellAmount}</span>
        </div>
        <div className="w-[130px] h-full flex items-center gap-2 px-2 shrink-0 overflow-hidden">
          <div className="w-4 h-4 border-[1.5px] border-[#767676] rounded-[2px] shrink-0 bg-white" />
          <span className="text-[12px] text-vg-ink whitespace-nowrap">Sell all shares</span>
        </div>
        <div className="w-[160px] h-full flex flex-col justify-center gap-1 px-2 shrink-0 overflow-hidden">
          <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">COST BASIS METHOD</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">MinTax</span>
            <a className="text-[14px] text-[#1255cc] underline cursor-pointer whitespace-nowrap">Edit</a>
          </div>
        </div>
        <div className="w-[95px] h-full flex flex-col justify-center gap-[3px] px-2 shrink-0">
          <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">EST. ST GAINS</span>
          <span className={`text-[14px] font-bold whitespace-nowrap ${fund.estSTColor}`}>{fund.estSTGains}</span>
        </div>
        <div className="w-[95px] h-full flex flex-col justify-center gap-[3px] px-2 shrink-0">
          <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">EST. LT GAINS</span>
          <span className={`text-[14px] font-bold whitespace-nowrap ${fund.estLTColor}`}>{fund.estLTGains}</span>
        </div>
        <div className="w-[85px] h-full flex flex-col justify-center gap-[3px] px-2 shrink-0">
          <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">EST. TAX</span>
          <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">{fund.estTax}</span>
        </div>
        <div className="w-[110px] h-full flex flex-col justify-center gap-[3px] px-2 shrink-0">
          <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">IMPACT</span>
          <span className={`text-[12px] font-semibold whitespace-nowrap ${fund.impactColor}`}>{fund.impact}</span>
        </div>
        <div className="flex flex-1 h-full items-center justify-end px-2">
          <button className="h-[36px] w-[90px] rounded-full border-[1.5px] border-vg-ink bg-white text-[14px] font-bold text-vg-ink shrink-0 hover:opacity-90">Cancel</button>
        </div>
      </div>
      {/* Details Row — 32px */}
      <div className="flex h-8 items-center justify-between px-4 w-full bg-white">
        <div className="flex items-center gap-[5px]">
          <p className="text-[13px] italic text-vg-ink-muted">{fund.rationale}</p>
          {fund.waitAndSave && (
            <span className="flex items-center gap-1 px-2 py-[2px] rounded-full bg-[#e07000]">
              <span className="text-[9px] font-bold text-white tracking-[0.36px] whitespace-nowrap">WAIT &amp; SAVE {fund.waitAndSave}</span>
            </span>
          )}
        </div>
        <button onClick={() => onLotDetails(fund.ticker)} className="flex items-center gap-1 cursor-pointer shrink-0 hover:opacity-70">
          <span className="text-[12px] text-vg-ink-muted whitespace-nowrap">Lot details</span>
          <span className="text-vg-ink-muted text-base leading-none">▾</span>
        </button>
      </div>
    </div>
  )
}

// Inactive fund row for non-active funds below the active section
function InactiveFundRowLOT({ ticker, fullName, shares, balance }: {
  ticker: string; fullName: string; shares: string; balance: string
}) {
  return (
    <div className="flex h-16 items-center overflow-hidden px-3 w-full border-b border-[#e8e9e9] bg-[#fafafa]">
      <div className="w-[280px] h-full flex flex-col justify-center gap-[3px] px-2 shrink-0 overflow-hidden">
        <span className="text-[12px] text-vg-ink-muted truncate">{fullName}</span>
        <a className="text-[14px] font-bold text-[#1255cc] underline whitespace-nowrap">{ticker}</a>
      </div>
      <div className="w-[140px] h-full flex flex-col justify-center gap-[3px] px-2 shrink-0 overflow-hidden">
        <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">{shares} shares</span>
        <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">{balance}</span>
      </div>
      <div className="w-[128px] h-full shrink-0" /><div className="w-[130px] h-full shrink-0" />
      <div className="w-[160px] h-full shrink-0" /><div className="w-[95px] h-full shrink-0" />
      <div className="w-[95px] h-full shrink-0" /><div className="w-[85px] h-full shrink-0" />
      <div className="w-[110px] h-full shrink-0" />
      <div className="flex flex-1 h-full items-center justify-end px-2">
        <button className="h-[36px] w-[90px] rounded-full border-[1.5px] border-vg-ink bg-white text-[14px] font-bold text-vg-ink shrink-0 hover:opacity-90">Sell</button>
      </div>
    </div>
  )
}

// Collapsed active fund data for primary scenario (the OTHER active fund)
const COLLAPSED_FUND_DATA: Record<string, CollapsedActiveFundData> = {
  VTSAX: {
    ticker: 'VTSAX', fullName: 'Vanguard Total Stock Market Index Fund',
    shares: '1,597', balance: '$231,884.40', sellAmount: '$15,000.00',
    estSTGains: '$1,515.85', estSTColor: 'text-[#007a00]',
    estLTGains: '$0.00', estLTColor: 'text-vg-ink',
    estTax: '$363.80', impact: '-0.8% Equity', impactColor: 'text-[#007a00]',
    rationale: 'Selling the lowest-gain short-term lot (acquired Nov 2025) reduces domestic equity overweight while limiting estimated gross tax to $364.',
    waitAndSave: '$37.03',
  },
  VBTLX: {
    ticker: 'VBTLX', fullName: 'Vanguard Total Bond Market Index Fund',
    shares: '5,600', balance: '$51,408.00', sellAmount: '$10,000.00',
    estSTGains: '$0.00', estSTColor: 'text-vg-ink',
    estLTGains: '−$1,056.65', estLTColor: 'text-[#c8102e]',
    estTax: '$0.00', impact: '-0.4% Bonds', impactColor: 'text-[#c8102e]',
    rationale: 'Harvesting a $1,057 long-term bond loss nets against equity gains; combined taxable gain is $459 and estimated net tax is $110.',
  },
}

// ---------------------------------------------------------------------------
// Static banner values (same as FS-MAN-2 primary scenario)
// TODO: replace with engine output once REQ-OE-001–010 built
// ---------------------------------------------------------------------------

function getStaticPrimaryScenarioBannerValues() {
  return {
    saleTotal: '$25,000', salePct: '2.9% of portfolio',
    estSTGains: '$1,515.85', estLTGains: '-$1,056.65',
    estNetTax: '$110.21', effectiveRate: '0.44% effective rate',
    impactEquity: '−0.8%', impactBonds: '-0.4%',
  }
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function FundSelectionManualLot() {
  const navigate = useNavigate()
  const location = useLocation()
  const fund = (location.state as { fund?: string })?.fund ?? 'VTSAX'
  const lots = LOT_DATA[fund] ?? VTSAX_LOTS
  const bv = getStaticPrimaryScenarioBannerValues()

  // Coach mark — Wait & Save (single mark on this screen)
  // Sequential hint-indicator pattern per dev/CLAUDE.md
  const [hintsVisible, setHintsVisible]   = useState(true)
  const [openMark, setOpenMark]           = useState<'ws' | null>(null)

  // Per-lot shares input state
  // Initial values: T-VTSAX-09 pre-populated with primary scenario SpecID amount
  const [sharesInputs, setSharesInputs] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    for (const lot of lots) {
      init[lot.lotId] = lot.lotId === 'T-VTSAX-09' ? '103.306' : '0.000'
    }
    return init
  })

  // TODO (state lifting): sharesInputs should be lifted to FundSelectionManual2
  // so that lot-level checkbox/share changes update the parent's appliedAmounts
  // and Summary Banner (same pattern as appliedCents / onApply in FS-MAN-2).
  // Implement when the optimization engine (REQ-OE-001–010) is built.

  function handleSharesChange(lotId: string, value: string) {
    setSharesInputs(prev => ({ ...prev, [lotId]: value }))
  }

  // Account expansion
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set())
  function toggleAccount(id: string) {
    setExpandedAccounts(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id) ; else next.add(id)
      return next
    })
  }
  const iraExpanded  = expandedAccounts.has('ira')
  const rothExpanded = expandedAccounts.has('roth')

  const ltLots = lots.filter(l => l.holdingPeriod === 'LT')
  const stLots = lots.filter(l => l.holdingPeriod === 'ST')

  return (
    <>
      {/* Show Tips / Hide Tips — Figma: Controls/Show Tips [FS-MAN-LOT] (716:2917), x=978 y=20 */}
      <button
        onClick={() => { setHintsVisible(v => !v); setOpenMark(null) }}
        className="fixed z-50 flex items-center gap-[5px] cursor-pointer"
        style={{ top: 20, left: 978 }}
      >
        <div className="w-[14px] h-[14px] border border-vg-ink rounded-[7px] flex items-center justify-center shrink-0">
          <span className="text-[9px] text-vg-ink leading-none">?</span>
        </div>
        <span className="text-[13px] text-vg-ink underline whitespace-nowrap">
          {hintsVisible ? 'Hide tips' : 'Show tips'}
        </span>
      </button>

      <div className="flex flex-col items-start w-full">
        <div className="flex flex-col gap-6 py-10 w-full">

          {/* Row 1 — Page title + mode toggle */}
          <div className="flex items-center justify-between px-8 h-14">
            <h1 className="text-[30px] font-bold text-vg-ink whitespace-nowrap leading-normal">
              Sell &amp; Rebalance
            </h1>
            <div className="flex items-center border-[1.5px] border-vg-ink rounded-full p-[2px] bg-white">
              <button onClick={() => navigate('/automated')} className="flex items-center gap-1.5 px-4 py-2 rounded-[4px] text-[14px] font-bold text-vg-ink">
                <Sparkles size={16} className="text-vg-ink" />Automated
              </button>
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-vg-teal">
                <PenLine size={16} className="text-white" />
                <span className="text-[14px] font-bold text-white">Manual</span>
              </div>
            </div>
          </div>

          {/* Summary Banner — same static values as FS-MAN-2 */}
          <div className="flex items-center px-8 w-full">
            <div className="flex flex-1 items-start bg-[#e8f5f0] px-6 py-4">
              <div className="flex flex-col gap-1 flex-1 min-w-0 overflow-hidden px-3">
                <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">SALE TOTAL</span>
                <span className="text-[20px] font-bold text-vg-ink whitespace-nowrap">{bv.saleTotal}</span>
                <span className="text-[12px] text-vg-ink-muted whitespace-nowrap">{bv.salePct}</span>
              </div>
              <div className="self-stretch w-px bg-[#c8d8d4] shrink-0" />
              <div className="flex flex-col gap-1 flex-1 min-w-0 overflow-hidden px-3">
                <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">TAX BRACKET</span>
                <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">24% ST / 15% LT</span>
                <a className="text-[12px] text-[#1255cc] underline cursor-pointer whitespace-nowrap">Change</a>
              </div>
              <div className="self-stretch w-px bg-[#c8d8d4] shrink-0" />
              <div className="flex flex-col gap-1 flex-1 min-w-0 overflow-hidden px-3">
                <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">YTD REALIZED</span>
                <span className="text-[12px] text-vg-ink whitespace-nowrap">ST $1,245</span>
                <span className="text-[12px] text-vg-ink whitespace-nowrap">LT $8,750</span>
              </div>
              <div className="self-stretch w-px bg-[#c8d8d4] shrink-0" />
              <div className="flex flex-col gap-1 flex-1 min-w-0 overflow-hidden px-3">
                <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">EST. ST GAINS</span>
                <span className="text-[16px] font-bold text-[#007a00] whitespace-nowrap">{bv.estSTGains}</span>
              </div>
              <div className="self-stretch w-px bg-[#c8d8d4] shrink-0" />
              <div className="flex flex-col gap-1 flex-1 min-w-0 overflow-hidden px-3">
                <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">EST. LT GAINS</span>
                <span className="text-[16px] font-bold text-vg-red whitespace-nowrap">{bv.estLTGains}</span>
              </div>
              <div className="self-stretch w-px bg-[#c8d8d4] shrink-0" />
              <div className="flex flex-col gap-1 flex-1 min-w-0 overflow-hidden px-3">
                <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">EST. NET TAX</span>
                <span className="text-[16px] font-bold text-vg-ink whitespace-nowrap">{bv.estNetTax}</span>
                <span className="text-[12px] text-vg-ink-muted whitespace-nowrap">{bv.effectiveRate}</span>
              </div>
              <div className="self-stretch w-px bg-[#c8d8d4] shrink-0" />
              <div className="flex flex-col gap-0.5 flex-1 min-w-0 overflow-hidden px-3">
                <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">IMPACT</span>
                <div className="flex gap-1.5 items-center"><span className="text-[12px] text-vg-ink">Equity</span><span className="text-[12px] text-[#007a00]">{bv.impactEquity}</span></div>
                <div className="flex gap-1.5 items-center"><span className="text-[12px] text-vg-ink">Bonds</span><span className="text-[12px] text-vg-red">{bv.impactBonds}</span></div>
                <a className="text-[10px] text-[#1255cc] underline cursor-pointer whitespace-nowrap">Target allocation</a>
              </div>
            </div>
          </div>

          {/* Fund Table — relative wrapper anchors the W&S coach mark bubble */}
          <div className="flex flex-col items-start px-8 w-full">
            <div className="flex flex-col items-start w-full border border-[#e8e9e9] relative">

              {/* Taxable Brokerage header */}
              <div className="flex h-16 items-center px-4 bg-[#f8f8f8] border-b border-[#e8e9e9] w-full">
                <RadioDot selected={true} />
                <div className="w-2 shrink-0" />
                <div className="flex gap-1 items-center">
                  <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">Taxable Brokerage</span>
                  <span className="text-[12px] text-vg-ink-muted whitespace-nowrap">...4782</span>
                </div>
                <div className="flex-1" />
                <span className="text-[12px] text-vg-ink-muted whitespace-nowrap">62% Equity / 28% Bonds / 10% Other</span>
                <div className="w-4 shrink-0" />
                <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">$507,194.40</span>
                <div className="w-4 shrink-0" />
                <ChevronDown size={24} className="text-vg-ink shrink-0" />
              </div>

              {/* Column header row */}
              <div className="flex h-9 items-center px-3 bg-[#f8f8f8] border border-[#e0e0e0] w-full shrink-0">
                <div className="w-[280px] px-2 flex items-center h-full shrink-0">
                  <span className="text-[12px] font-semibold text-vg-ink">FUND</span>
                </div>
                <div className="w-[140px] px-2 flex items-center h-full shrink-0">
                  <span className="text-[12px] font-semibold text-vg-ink">POSITION</span>
                </div>
                <div className="flex-1" />
              </div>

              {/* EXPANDED active fund row — Main Row + Details Row + Lot Detail */}
              <div className="flex flex-col border-b border-[#e8e9e9] w-full bg-white">

                {/* Main Row — 64px */}
                <div className="flex h-16 items-center overflow-hidden px-3 w-full bg-white">
                  <div className="w-[280px] h-full flex flex-col justify-center gap-[3px] px-2 shrink-0 overflow-hidden">
                    <span className="text-[12px] text-vg-ink-muted truncate">
                      {fund === 'VTSAX' ? 'Vanguard Total Stock Market Index Fund' : 'Vanguard Total Bond Market Index Fund'}
                    </span>
                    <a className="text-[14px] font-bold text-[#1255cc] underline whitespace-nowrap">{fund}</a>
                  </div>
                  <div className="w-[140px] h-full flex flex-col justify-center gap-[3px] px-2 shrink-0 overflow-hidden">
                    <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">{fund === 'VTSAX' ? '1,597' : '5,600'} shares</span>
                    <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">{fund === 'VTSAX' ? '$231,884.40' : '$51,408.00'}</span>
                  </div>
                  {/* Read-only sell amount (SpecID mode: derived from lot inputs) */}
                  <div className="w-[128px] h-full flex flex-col justify-center gap-[3px] px-1 shrink-0 overflow-hidden">
                    <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">SELL AMOUNT</span>
                    <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">{fund === 'VTSAX' ? '$15,000.03' : '$10,000.00'}</span>
                  </div>
                  <div className="w-[130px] h-full flex items-center gap-2 px-2 shrink-0 overflow-hidden">
                    <div className="w-4 h-4 border-[1.5px] border-[#767676] rounded-[2px] shrink-0 bg-white" />
                    <span className="text-[12px] text-vg-ink whitespace-nowrap">Sell all shares</span>
                  </div>
                  <div className="w-[160px] h-full flex flex-col justify-center gap-1 px-2 shrink-0 overflow-hidden">
                    <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">COST BASIS METHOD</span>
                    <div className="flex items-center gap-1.5">
                      {/* VTSAX uses SpecID in primary scenario; VBTLX uses MinTax */}
                      <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">{fund === 'VTSAX' ? 'Spec ID' : 'MinTax'}</span>
                      <a className="text-[14px] text-[#1255cc] underline cursor-pointer whitespace-nowrap">Edit</a>
                    </div>
                  </div>
                  <div className="w-[95px] h-full flex flex-col justify-center gap-[3px] px-2 shrink-0">
                    <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">EST. ST GAINS</span>
                    <span className="text-[14px] font-bold text-[#007a00] whitespace-nowrap">{fund === 'VTSAX' ? '$1,515.85' : '$0.00'}</span>
                  </div>
                  <div className="w-[95px] h-full flex flex-col justify-center gap-[3px] px-2 shrink-0">
                    <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">EST. LT GAINS</span>
                    <span className={`text-[14px] font-bold whitespace-nowrap ${fund === 'VBTLX' ? 'text-[#c8102e]' : 'text-vg-ink'}`}>{fund === 'VTSAX' ? '$0.00' : '−$1,056.65'}</span>
                  </div>
                  <div className="w-[85px] h-full flex flex-col justify-center gap-[3px] px-2 shrink-0">
                    <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">EST. TAX</span>
                    <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">{fund === 'VTSAX' ? '$363.80' : '$0.00'}</span>
                  </div>
                  <div className="w-[110px] h-full flex flex-col justify-center gap-[3px] px-2 shrink-0">
                    <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">IMPACT</span>
                    <span className={`text-[12px] font-semibold whitespace-nowrap ${fund === 'VTSAX' ? 'text-[#007a00]' : 'text-[#c8102e]'}`}>{fund === 'VTSAX' ? '-0.8% Equity' : '-0.4% Bonds'}</span>
                  </div>
                  <div className="flex flex-1 h-full items-center justify-end px-2">
                    <button className="h-[36px] w-[90px] rounded-full border-[1.5px] border-vg-ink bg-white text-[14px] font-bold text-vg-ink shrink-0 hover:opacity-90">Cancel</button>
                  </div>
                </div>

                {/* Details Row — collapse trigger (chevron UP = currently expanded) */}
                <div className="flex h-8 items-center justify-between px-4 w-full bg-white border-b border-[#e8e9e9]">
                  <p className="text-[13px] italic text-vg-ink-muted">
                    {fund === 'VTSAX'
                      ? 'Selling the lowest-gain short-term lot (acquired Nov 2025) reduces domestic equity overweight while limiting estimated gross tax to $364.'
                      : 'Harvesting a $1,057 long-term bond loss nets against equity gains; combined taxable gain is $459 and estimated net tax is $110.'}
                  </p>
                  <button onClick={() => navigate('/manual-2')} className="flex items-center gap-1 cursor-pointer shrink-0 hover:opacity-70">
                    <span className="text-[12px] text-vg-ink-muted whitespace-nowrap">Lot details</span>
                    <span className="text-vg-ink-muted text-base leading-none">▴</span>
                  </button>
                </div>

                {/* Lot Detail Section — Lot Detail Header + section groups + lot rows */}
                <LotDetailHeader />

                {ltLots.length > 0 && (
                  <>
                    <LotSectionHeader label="Long-term holdings" />
                    {ltLots.map(lot => (
                      <NormalLotRow
                        key={lot.lotId}
                        lot={lot}
                        sharesInput={sharesInputs[lot.lotId] ?? '0.000'}
                        onSharesChange={v => handleSharesChange(lot.lotId, v)}
                      />
                    ))}
                  </>
                )}

                {stLots.length > 0 && (
                  <>
                    <LotSectionHeader label="Short-term holdings" />
                    {stLots.map(lot =>
                      lot.waitAndSave ? (
                        <WaitSaveLotRow
                          key={lot.lotId}
                          lot={lot}
                          sharesInput={sharesInputs[lot.lotId] ?? '0.000'}
                          onSharesChange={v => handleSharesChange(lot.lotId, v)}
                          showHint={true}
                          hintsVisible={hintsVisible}
                          onHintClick={() => setOpenMark(prev => prev === 'ws' ? null : 'ws')}
                        />
                      ) : (
                        <NormalLotRow
                          key={lot.lotId}
                          lot={lot}
                          sharesInput={sharesInputs[lot.lotId] ?? '0.000'}
                          onSharesChange={v => handleSharesChange(lot.lotId, v)}
                        />
                      )
                    )}
                  </>
                )}
              </div>

              {/* Coach Mark — Wait & Save (overlay node 716:2921, x=286 y=590)
                  Positioned in the lot table area, arrow pointing up toward W&S row */}
              {openMark === 'ws' && (
                <div className="absolute z-40" style={{ left: 286, top: 560 }}>
                  <CoachMarkBubble
                    text="This lot will qualify for the lower long-term capital gains rate in 166 days. Selling it now costs more in estimated tax than waiting."
                    onDismiss={() => setOpenMark(null)}
                  />
                </div>
              )}

              {/* Other active fund — collapsed (Figma: 388:2534, y=777, 96px) */}
              {COLLAPSED_FUND_DATA[fund === 'VTSAX' ? 'VBTLX' : 'VTSAX'] && (
                <CollapsedActiveFundRow
                  fund={COLLAPSED_FUND_DATA[fund === 'VTSAX' ? 'VBTLX' : 'VTSAX']}
                  onLotDetails={ticker => navigate('/manual-lot', { state: { fund: ticker } })}
                />
              )}

              {/* Inactive fund rows — VTIAX and VBIRX (Figma: 382:1898-1899, 64px each) */}
              <InactiveFundRowLOT ticker="VTIAX" fullName="Vanguard Total Intl Stock Index Fund"  shares="3,600" balance="$139,500.00" />
              <InactiveFundRowLOT ticker="VBIRX" fullName="Vanguard Short-Term Bond Index Fund" shares="8,100" balance="$84,402.00" />

              {/* Traditional IRA — collapsed, expandable */}
              <div className="flex h-16 items-center px-4 bg-[#f8f8f8] border-t border-[#e8e9e9] w-full cursor-pointer" onClick={() => toggleAccount('ira')}>
                <RadioDot selected={false} />
                <div className="w-2 shrink-0" />
                <div className="flex gap-1 items-center flex-wrap">
                  <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">Traditional IRA</span>
                  <span className="text-[12px] text-vg-ink-muted whitespace-nowrap">...2973</span>
                  <div className="w-2 shrink-0" />
                  <div className="flex items-center gap-1 px-2 py-[2px] rounded-full bg-[#e07000]">
                    <span className="text-[9px] font-bold text-white tracking-[0.36px] whitespace-nowrap">Remaining 2026 RMD: $3,668</span>
                  </div>
                </div>
                <div className="flex-1" />
                <span className="text-[12px] text-vg-ink-muted whitespace-nowrap">22% Equity / 78% Bonds / 0% Other</span>
                <div className="w-4 shrink-0" />
                <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">$211,065.00</span>
                <div className="w-4 shrink-0" />
                {iraExpanded ? <ChevronUp size={24} className="text-vg-ink shrink-0" /> : <ChevronDown size={24} className="text-vg-ink shrink-0" />}
              </div>

              {/* Roth IRA — collapsed, expandable */}
              <div className="flex h-16 items-center px-4 bg-[#f8f8f8] border-t border-[#e8e9e9] w-full cursor-pointer" onClick={() => toggleAccount('roth')}>
                <RadioDot selected={false} />
                <div className="w-2 shrink-0" />
                <div className="flex gap-1 items-center">
                  <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">Roth IRA</span>
                  <span className="text-[12px] text-vg-ink-muted whitespace-nowrap">...8148</span>
                </div>
                <div className="flex-1" />
                <span className="text-[12px] text-vg-ink-muted whitespace-nowrap">100% Equity</span>
                <div className="w-4 shrink-0" />
                <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">$131,592.00</span>
                <div className="w-4 shrink-0" />
                {rothExpanded ? <ChevronUp size={24} className="text-vg-ink shrink-0" /> : <ChevronDown size={24} className="text-vg-ink shrink-0" />}
              </div>

            </div>
          </div>

          {/* Footer — same as FS-MAN-2 */}
          <div className="flex gap-3 items-center px-8 w-full">
            <button className="h-[48px] px-7 rounded-full bg-vg-ink text-white text-[14px] font-bold whitespace-nowrap hover:opacity-90">Review order</button>
            <button className="h-[48px] px-7 rounded-full border-[1.5px] border-vg-ink text-vg-ink bg-white text-[14px] font-bold whitespace-nowrap hover:opacity-90">Go to Scenario Analysis</button>
            <button className="text-[14px] text-[#1255cc] underline cursor-pointer whitespace-nowrap hover:opacity-80">
              ↩ Reset to system recommendation
            </button>
          </div>

        </div>
      </div>
    </>
  )
}
