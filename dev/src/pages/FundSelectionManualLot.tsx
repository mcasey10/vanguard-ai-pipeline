import { useState, useCallback, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Sparkles, PenLine, ChevronDown, ChevronUp } from 'lucide-react'
import { useModeToggleGuard, SaveDiscardDialog } from '../components/ModeToggleGuard'
import { CostBasisDialog, type CostBasisMethod } from '../components/CostBasisDialog'
import { TargetAllocationModal } from '../components/TargetAllocationModal'
import { useAppStore } from '../store/useAppStore'
import { runOptimization } from '../engine/index'
import type { Lot as CanonicalLot } from '../types'

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

/** Convert canonical Lot (from store) to local display Lot type */
function toDisplayLot(l: CanonicalLot): Lot {
  const [y, m, d] = l.acquisition_date.split('-')
  const acqDisplay = `${m}/${d}/${y}`
  const gainPerShare = l.current_nav - l.cost_basis_per_share
  return {
    lotId: l.lot_id,
    acquisitionDate: acqDisplay,
    shares: l.shares,
    costPerShare: l.cost_basis_per_share,
    totalCost: l.total_cost_basis,
    currentValue: l.current_value,
    gainLoss: l.unrealized_gain_loss,
    gainLossPerShare: Math.round(gainPerShare * 100) / 100,
    holdingPeriod: l.holding_period,
    waitAndSave: l.wait_and_save_flag && l.wait_and_save_detail ? {
      daysUntilLT: l.wait_and_save_detail.days_until_lt,
      ltConversionDate: l.wait_and_save_detail.lt_conversion_date,
      savingsAmount: '$' + l.wait_and_save_detail.estimated_tax_savings_by_waiting.toFixed(2),
      noticeText: `Your estimated federal tax will be reduced by $${l.wait_and_save_detail.estimated_tax_savings_by_waiting.toFixed(2)}, if you wait until this lot converts to a long-term holding. This lot converts to a long-term holding in ${l.wait_and_save_detail.days_until_lt} days.`,
    } : undefined,
  }
}

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

function NormalLotRow({ lot, sharesInput, onSharesChange, onSharesCommit }:
  { lot: Lot; sharesInput: string; onSharesChange: (v: string) => void; onSharesCommit: (v: string) => void }) {
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
          onBlur={e => onSharesCommit(e.target.value.replace(/[^\d.]/g, ''))}
          onKeyDown={e => e.key === 'Enter' && onSharesCommit((e.target as HTMLInputElement).value.replace(/[^\d.]/g, ''))}
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

function WaitSaveLotRow({ lot, sharesInput, onSharesChange, onSharesCommit, showHint, hintsVisible, onHintClick }:
  { lot: Lot; sharesInput: string; onSharesChange: (v: string) => void; onSharesCommit: (v: string) => void
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
              onBlur={e => onSharesCommit(e.target.value.replace(/[^\d.]/g, ''))}
              onKeyDown={e => e.key === 'Enter' && onSharesCommit((e.target as HTMLInputElement).value.replace(/[^\d.]/g, ''))}
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

function CollapsedActiveFundRow({ fund, onLotDetails, displayMethod, onEditClick }: {
  fund: CollapsedActiveFundData
  onLotDetails: (ticker: string) => void
  displayMethod: CostBasisMethod
  onEditClick: () => void
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
            <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">{displayMethod}</span>
            <a className="text-[14px] text-[#1255cc] underline cursor-pointer whitespace-nowrap" onClick={onEditClick}>Edit</a>
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
// Helpers
// ---------------------------------------------------------------------------

function r2(n: number) { return Math.round(n * 100) / 100 }
function fmtSigned(n: number) { return (n >= 0 ? '+' : '−') + '$' + Math.abs(n).toFixed(2) }

interface LotBannerData {
  totalSale: number
  salePct: number
  stGainLoss: number
  ltGainLoss: number
  estNetTax: number
  effRate: number
  // Totals row fields
  totalShares: number
  totalCost: number
  pricePerShare: number
  priceDate: string
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function FundSelectionManualLot() {
  const navigate = useNavigate()
  const location = useLocation()
  const { portfolio, activeAccountId, activeTaxRates, optimizationPriority, setManualConfig } = useAppStore()
  const fund = (location.state as { fund?: string })?.fund ?? 'VTSAX'
  const [bannerData, setBannerData] = useState<LotBannerData | null>(null)

  // Derive lots from store portfolio (single source of truth — no hardcoded arrays)
  const taxableAcct = portfolio?.accounts.find(a => a.account_id === activeAccountId)
  const iraAcct     = portfolio?.accounts.find(a => a.account_type === 'traditional_IRA')
  const rothAcct    = portfolio?.accounts.find(a => a.account_type === 'roth_IRA')
  const holding = taxableAcct?.holdings.find(h => h.fund_id === fund)
  const lots: Lot[] = (holding?.lots ?? []).map(toDisplayLot)

  // Mode toggle guard — hasAmounts always true on this screen (only reachable from FS-MAN-2
  // which requires active fund rows with applied amounts)
  const { showDialog: showModeDialog, handleToggleClick, handleSave, handleDiscard, handleClose } =
    useModeToggleGuard(true)

  // Coach mark — Wait & Save (single mark on this screen)
  // Sequential hint-indicator pattern per dev/CLAUDE.md
  const [hintsVisible, setHintsVisible]   = useState(true)
  const [openMark, setOpenMark]           = useState<'ws' | null>(null)

  // Modal state
  const [showAllocModal,  setShowAllocModal]  = useState(false)
  // Cost basis for expanded fund row (local display only — same scope as ActiveFundRow in FS-MAN-2)
  const [expandedMethod,  setExpandedMethod]  = useState<CostBasisMethod>(fund === 'VTSAX' ? 'SpecID' : 'MinTax')
  const [showExpandedCBD, setShowExpandedCBD] = useState(false)
  // Cost basis for the collapsed other-fund row
  const [collapsedMethod, setCollapsedMethod] = useState<CostBasisMethod>(fund === 'VTSAX' ? 'MinTax' : 'SpecID')
  const [showCollapsedCBD, setShowCollapsedCBD] = useState(false)

  // Per-lot shares input state
  // Initial values: T-VTSAX-09 pre-populated with primary scenario SpecID amount
  const [sharesInputs, setSharesInputs] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    for (const lot of lots) {
      init[lot.lotId] = lot.lotId === 'T-VTSAX-09' ? '103.306' : '0.000'
    }
    return init
  })

  // runLotEngine — called on blur/Enter on any lot share input.
  // Builds SpecID selections from sharesInputs and calls runOptimization().
  const runLotEngine = useCallback((inputs: Record<string, string>) => {
    if (!portfolio) return
    const lotOverrides = Object.entries(inputs)
      .filter(([, v]) => parseFloat(v) > 0)
      .map(([lotId, v]) => ({ lot_id: lotId, shares: parseFloat(v) }))
    if (lotOverrides.length === 0) { setBannerData(null); return }

    // Compute banner + totals row values directly from lot selections (SpecID — exact lots known)
    let stGainLoss = 0, ltGainLoss = 0, totalSale = 0, totalShares = 0, totalCost = 0
    let pricePerShare = 0, priceDate = ''
    for (const o of lotOverrides) {
      const lot = holding?.lots.find(l => l.lot_id === o.lot_id)
      if (!lot) continue
      const proceeds = o.shares * lot.current_nav
      const partialCost = (o.shares / lot.shares) * lot.total_cost_basis
      const gainLoss = r2(proceeds - partialCost)
      if (lot.holding_period === 'ST') stGainLoss = r2(stGainLoss + gainLoss)
      else ltGainLoss = r2(ltGainLoss + gainLoss)
      totalSale = r2(totalSale + proceeds)
      totalShares = r2(totalShares + o.shares)
      totalCost = r2(totalCost + partialCost)
      pricePerShare = lot.current_nav
    }
    priceDate = '05/27/2026' // canonical portfolio reference date
    const netGain = Math.max(0, r2(stGainLoss + ltGainLoss))
    const taxST = Math.min(netGain, Math.max(0, stGainLoss)) * activeTaxRates.st_rate
    const taxLT = Math.max(0, netGain - Math.min(netGain, Math.max(0, stGainLoss))) * activeTaxRates.lt_rate
    const estNetTax = r2(taxST + taxLT)
    const effRate = totalSale > 0 ? r2((estNetTax / totalSale) * 100) : 0
    const salePct = r2((totalSale / portfolio.total_investable_balance) * 100)
    setBannerData({ totalSale, salePct, stGainLoss, ltGainLoss, estNetTax, effRate, totalShares, totalCost, pricePerShare, priceDate })

    const result = runOptimization({
      portfolio,
      targetSaleAmount: Math.round(totalSale * 100) / 100,
      activeAccountId,
      mode: 'manual',
      optimizationPriority,
      activeTaxRates,
      manualSelections: { fund_selections: [{ fund_id: fund, accounting_method: 'specific_lot_identification', lot_overrides: lotOverrides }] },
    })
    setManualConfig(result as import('../types').ManualConfiguration)
  }, [portfolio, holding, fund, activeAccountId, optimizationPriority, activeTaxRates, setManualConfig])

  function handleSharesChange(lotId: string, value: string) {
    setSharesInputs(prev => ({ ...prev, [lotId]: value }))
  }

  function handleSharesCommit(lotId: string, value: string) {
    const newInputs = { ...sharesInputs, [lotId]: value }
    setSharesInputs(newInputs)
    runLotEngine(newInputs)
  }

  // Auto-fire engine on mount when inputs are already pre-populated
  // (mirrors FS-MAN-2 mount-time call so banner shows live figures on arrival)
  useEffect(() => {
    const hasSelections = Object.values(sharesInputs).some(v => parseFloat(v) > 0)
    if (hasSelections) runLotEngine(sharesInputs)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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

      {/* Target Allocation Modal */}
      {showAllocModal && <TargetAllocationModal onClose={() => setShowAllocModal(false)} />}

      {/* Cost Basis Dialog — expanded fund row */}
      {showExpandedCBD && (
        <CostBasisDialog
          currentMethod={expandedMethod}
          onConfirm={m => { setExpandedMethod(m); setShowExpandedCBD(false) }}
          onClose={() => setShowExpandedCBD(false)}
        />
      )}

      {/* Cost Basis Dialog — collapsed other-fund row */}
      {showCollapsedCBD && (
        <CostBasisDialog
          currentMethod={collapsedMethod}
          onConfirm={m => { setCollapsedMethod(m); setShowCollapsedCBD(false) }}
          onClose={() => setShowCollapsedCBD(false)}
        />
      )}

      {/* FS-INT-SAVEDISCARD — Mode switch save/discard dialog */}
      {showModeDialog && (
        <SaveDiscardDialog
          onSave={handleSave}
          onDiscard={handleDiscard}
          onClose={handleClose}
        />
      )}

      <div className="flex flex-col items-start w-full">
        <div className="flex flex-col gap-6 py-10 w-full">

          {/* Row 1 — Page title + mode toggle */}
          <div className="flex items-center justify-between px-8 h-14">
            <h1 className="text-[30px] font-bold text-vg-ink whitespace-nowrap leading-normal">
              Sell &amp; Rebalance
            </h1>
            <div className="flex items-center border-[1.5px] border-vg-ink rounded-full p-[2px] bg-white">
              <button onClick={handleToggleClick} className="flex items-center gap-1.5 px-4 py-2 rounded-[4px] text-[14px] font-bold text-vg-ink">
                <Sparkles size={16} className="text-vg-ink" />Automated
              </button>
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-vg-teal">
                <PenLine size={16} className="text-white" />
                <span className="text-[14px] font-bold text-white">Manual</span>
              </div>
            </div>
          </div>

          {/* Summary Banner — reactive from bannerData (computed in runLotEngine) */}
          <div className="flex items-center px-8 w-full">
            <div className="flex flex-1 items-start bg-[#e8f5f0] px-6 py-4">
              <div className="flex flex-col gap-1 flex-1 min-w-0 overflow-hidden px-3">
                <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">SALE TOTAL</span>
                <span className="text-[20px] font-bold text-vg-ink whitespace-nowrap">{bannerData ? '$' + bannerData.totalSale.toFixed(2) : '—'}</span>
                <span className="text-[12px] text-vg-ink-muted whitespace-nowrap">{bannerData ? bannerData.salePct.toFixed(1) + '% of portfolio' : '0.0% of portfolio'}</span>
              </div>
              <div className="self-stretch w-px bg-[#c8d8d4] shrink-0" />
              <div className="flex flex-col gap-1 flex-1 min-w-0 overflow-hidden px-3">
                <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">TAX BRACKET</span>
                <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">{Math.round(activeTaxRates.st_rate * 100)}% ST / {Math.round(activeTaxRates.lt_rate * 100)}% LT</span>
                <a className="text-[12px] text-[#1255cc] underline cursor-pointer whitespace-nowrap">Change</a>
              </div>
              <div className="self-stretch w-px bg-[#c8d8d4] shrink-0" />
              <div className="flex flex-col gap-1 flex-1 min-w-0 overflow-hidden px-3">
                <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">YTD REALIZED</span>
                {portfolio?.ytd_gains_record ? (
                  <>
                    <span className="text-[12px] text-vg-ink whitespace-nowrap">ST ${portfolio.ytd_gains_record.st_gains_realized_ytd.toFixed(2)}</span>
                    <span className="text-[12px] text-vg-ink whitespace-nowrap">LT ${portfolio.ytd_gains_record.lt_gains_realized_ytd.toFixed(2)}</span>
                  </>
                ) : <span className="text-[12px] text-vg-ink-muted">—</span>}
              </div>
              <div className="self-stretch w-px bg-[#c8d8d4] shrink-0" />
              <div className="flex flex-col gap-1 flex-1 min-w-0 overflow-hidden px-3">
                <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">EST. ST GAINS</span>
                <span className={`text-[16px] font-bold whitespace-nowrap ${bannerData && bannerData.stGainLoss > 0 ? 'text-[#007a00]' : bannerData && bannerData.stGainLoss < 0 ? 'text-vg-red' : 'text-vg-ink'}`}>
                  {bannerData ? fmtSigned(bannerData.stGainLoss) : '—'}
                </span>
              </div>
              <div className="self-stretch w-px bg-[#c8d8d4] shrink-0" />
              <div className="flex flex-col gap-1 flex-1 min-w-0 overflow-hidden px-3">
                <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">EST. LT GAINS</span>
                <span className={`text-[16px] font-bold whitespace-nowrap ${bannerData && bannerData.ltGainLoss > 0 ? 'text-[#007a00]' : bannerData && bannerData.ltGainLoss < 0 ? 'text-vg-red' : 'text-vg-ink'}`}>
                  {bannerData ? fmtSigned(bannerData.ltGainLoss) : '—'}
                </span>
              </div>
              <div className="self-stretch w-px bg-[#c8d8d4] shrink-0" />
              <div className="flex flex-col gap-1 flex-1 min-w-0 overflow-hidden px-3">
                <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">EST. NET TAX</span>
                <span className="text-[16px] font-bold text-vg-ink whitespace-nowrap">{bannerData ? '$' + bannerData.estNetTax.toFixed(2) : '—'}</span>
                <span className="text-[12px] text-vg-ink-muted whitespace-nowrap">{bannerData ? bannerData.effRate.toFixed(2) + '% effective rate' : ''}</span>
              </div>
              <div className="self-stretch w-px bg-[#c8d8d4] shrink-0" />
              <div className="flex flex-col gap-0.5 flex-1 min-w-0 overflow-hidden px-3">
                <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">IMPACT</span>
                <div className="flex gap-1.5 items-center"><span className="text-[12px] text-vg-ink">Equity</span><span className="text-[12px] text-vg-ink">—</span></div>
                <div className="flex gap-1.5 items-center"><span className="text-[12px] text-vg-ink">Bonds</span><span className="text-[12px] text-vg-ink">—</span></div>
                <a className="text-[10px] text-[#1255cc] underline cursor-pointer whitespace-nowrap" onClick={() => setShowAllocModal(true)}>Target allocation</a>
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
                  <span className="text-[12px] text-vg-ink-muted whitespace-nowrap">{taxableAcct?.masked_number ?? '...4782'}</span>
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
                      <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">{expandedMethod}</span>
                      <a className="text-[14px] text-[#1255cc] underline cursor-pointer whitespace-nowrap" onClick={() => setShowExpandedCBD(true)}>Edit</a>
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
                        onSharesCommit={v => handleSharesCommit(lot.lotId, v)}
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
                          onSharesCommit={v => handleSharesCommit(lot.lotId, v)}
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
                          onSharesCommit={v => handleSharesCommit(lot.lotId, v)}
                        />
                      )
                    )}
                  </>
                )}

                {/* Lot Detail Totals — Figma: I388:2116;455:754;569:6624
                    36px section header + 40px totals row, shown once engine has fired */}
                {bannerData && (
                  <>
                    {/* Section header: "Total impact of selected shares to sell" (36px) */}
                    <div className="flex h-9 items-center justify-between overflow-clip px-3 w-full bg-[#f8f8f8] border-t border-[#e8e9e9] shrink-0">
                      <span className="text-[13px] font-semibold text-vg-ink whitespace-nowrap">Total impact of selected shares to sell</span>
                    </div>
                    {/* Totals row (40px) — columns aligned to lot table */}
                    <div className="flex h-10 items-center overflow-clip px-3 w-[1375px] bg-white border-t border-[#e8e9e9] shrink-0">
                      {/* t1 — Total selected shares to sell (220px) */}
                      <div className="w-[220px] flex flex-col items-start justify-center h-full shrink-0 overflow-clip">
                        <span className="text-[11px] text-vg-ink-muted">Total selected shares to sell</span>
                        <span className="text-[12px] font-semibold text-vg-ink whitespace-nowrap">{bannerData.totalShares.toFixed(3)}</span>
                      </div>
                      <div className="flex-1 min-w-px" />
                      {/* t2 — empty (Shares owned column) */}
                      <div className="w-[100px] h-full shrink-0" />
                      <div className="flex-1 min-w-px" />
                      {/* t3 — Total Cost (120px, right-aligned) */}
                      <div className="w-[120px] flex flex-col items-end justify-center h-full shrink-0 overflow-clip">
                        <span className="text-[11px] text-vg-ink-muted">Total Cost</span>
                        <span className="text-[12px] font-bold text-vg-ink whitespace-nowrap">${bannerData.totalCost.toFixed(2)}</span>
                      </div>
                      <div className="flex-1 min-w-px" />
                      {/* t4 — Total estimated gain/loss (160px, right-aligned) */}
                      <div className="w-[160px] flex flex-col items-end justify-center gap-[2px] h-full shrink-0 overflow-clip py-1">
                        <span className="text-[11px] text-vg-ink-muted text-right">Total estimated gain/loss</span>
                        <span className={`text-[12px] font-bold whitespace-nowrap ${(bannerData.stGainLoss + bannerData.ltGainLoss) >= 0 ? 'text-[#007a00]' : 'text-[#c8102e]'}`}>
                          {fmtSigned(r2(bannerData.stGainLoss + bannerData.ltGainLoss))}
                        </span>
                      </div>
                      <div className="flex-1 min-w-px" />
                      {/* t5 — Total estimated proceeds (150px, right-aligned) */}
                      <div className="w-[150px] flex flex-col items-end justify-center gap-[2px] h-full shrink-0 overflow-clip py-1 whitespace-nowrap">
                        <span className="text-[11px] text-vg-ink-muted">Total estimated proceeds</span>
                        <span className="text-[12px] font-bold text-vg-ink">${bannerData.totalSale.toFixed(2)}</span>
                      </div>
                      <div className="flex-1 min-w-px" />
                      {/* t6 — Price per share + date (120px) — aligns with Date acquired column */}
                      <div className="w-[120px] flex flex-col items-start justify-center h-full shrink-0 overflow-clip whitespace-nowrap">
                        <span className="text-[11px] text-vg-ink-muted">Price as of {bannerData.priceDate}</span>
                        <span className="text-[12px] text-vg-ink">${bannerData.pricePerShare.toFixed(2)} per share</span>
                      </div>
                    </div>
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
                  displayMethod={collapsedMethod}
                  onEditClick={() => setShowCollapsedCBD(true)}
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
                  <span className="text-[12px] text-vg-ink-muted whitespace-nowrap">{iraAcct?.masked_number ?? '...2973'}</span>
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
                  <span className="text-[12px] text-vg-ink-muted whitespace-nowrap">{rothAcct?.masked_number ?? '...8148'}</span>
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
