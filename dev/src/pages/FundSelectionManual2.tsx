import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, PenLine, ChevronDown, ChevronUp } from 'lucide-react'

// ---------------------------------------------------------------------------
// Shared sub-components
// ---------------------------------------------------------------------------

function RadioDot({ selected }: { selected: boolean }) {
  return (
    <div
      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
        selected ? 'border-vg-ink' : 'border-vg-ink-muted'
      }`}
    >
      {selected && <div className="w-2 h-2 rounded-full bg-vg-ink" />}
    </div>
  )
}

function CoachMarkBubble({ text, onDismiss }: { text: string; onDismiss: () => void }) {
  return (
    <div className="relative" style={{ filter: 'drop-shadow(0px 4px 8px rgba(4,5,5,0.2))' }}>
      {/* Upward-pointing triangle arrow — CSS border trick (equiv. to Figma SVG asset) */}
      <div
        className="absolute"
        style={{ left: 133, top: -8, width: 0, height: 0,
          borderLeft: '7px solid transparent', borderRight: '7px solid transparent',
          borderBottom: '8px solid white' }}
      />
      <div className="bg-white rounded-[4px] w-[280px]">
        <div className="flex items-center justify-end pt-[10px] pb-[4px] px-[12px]">
          <button onClick={onDismiss} className="text-[14px] text-vg-ink-muted cursor-pointer leading-none" aria-label="Dismiss tip">
            ×
          </button>
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
    <button
      onClick={onClick}
      className="w-[14px] h-[14px] border border-vg-ink-muted rounded-full flex items-center justify-center shrink-0 cursor-pointer"
      aria-label="Learn more"
    >
      <span className="text-[9px] text-vg-ink-muted leading-none">?</span>
    </button>
  )
}

// ---------------------------------------------------------------------------
// NF-1 — Reset to system recommendation dialog (572:3190)
// ---------------------------------------------------------------------------

function ResetDialog({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div
        className="bg-white border border-[#d0d0d0] rounded-[4px] flex flex-col items-start justify-between
          overflow-clip pb-[16px] pt-[24px] px-[24px]"
        style={{ width: 480, height: 200 }}
      >
        <div className="flex flex-col gap-3 w-full">
          <p className="text-[16px] font-bold text-vg-ink leading-normal">
            Reset to system recommendation?
          </p>
          <p className="text-[14px] text-vg-ink-muted leading-normal">
            Your manually entered amounts will be cleared and the system recommendation will be restored.
          </p>
        </div>
        <div className="flex items-center justify-between w-full">
          <button
            onClick={onCancel}
            className="h-[48px] px-7 rounded-full border-[1.5px] border-vg-ink bg-white
              text-[14px] font-bold text-vg-ink hover:opacity-90 transition-opacity"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="h-[48px] px-7 rounded-full bg-vg-ink text-white
              text-[14px] font-bold hover:opacity-90 transition-opacity"
          >
            Confirm reset
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Fund row types
// ---------------------------------------------------------------------------

type FundRow = {
  ticker: string
  fullName: string
  shares: string
  balance: string
  assetClass: string
}

type TaxData = {
  estSTGains: string
  estSTColor: string
  estLTGains: string
  estLTColor: string
  estTax: string
  impact: string
  impactColor: string
  rationale: string
  waitAndSave?: string  // dollar amount if Wait & Save applies
}

// ---------------------------------------------------------------------------
// Active fund row — (Figma 393:2377 / 382:1532)
// Main Row: 64px · Details Row: 32px · Total: 96px
// ---------------------------------------------------------------------------

function ActiveFundRow({
  fund,
  taxData,
  initialCents,
  showAllocationHint,
  showHarvestableHint,
  hintsVisible,
  onHintClick,
  onCancel,
}: {
  fund: FundRow
  taxData: TaxData
  initialCents: number
  showAllocationHint: boolean
  showHarvestableHint: boolean
  hintsVisible: boolean
  onHintClick: (mark: string) => void
  onCancel: () => void
}) {
  const [appliedCents, setAppliedCents] = useState(initialCents)
  const [inputCents, setInputCents]   = useState(initialCents)
  const [inputDisplay, setInputDisplay] = useState(formatDollar(initialCents))

  const hasChange = inputCents !== appliedCents

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '')
    const cents  = parseInt(digits || '0', 10)
    setInputCents(cents)
    setInputDisplay(digits === '' ? '' : formatDollar(cents))
  }

  function handleApply() {
    if (!hasChange) return
    setAppliedCents(inputCents)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleApply()
  }

  return (
    <div className="flex flex-col border-b border-[#e8e9e9] w-full bg-white">
      {/* Main Row — 64px */}
      <div className="flex h-16 items-center overflow-hidden px-3 w-full bg-white">

        {/* FUND — 280px */}
        <div className="w-[280px] h-full flex flex-col justify-center gap-[3px] px-2 shrink-0 overflow-hidden">
          <span className="text-[12px] text-vg-ink-muted truncate">{fund.fullName}</span>
          <a className="text-[14px] font-bold text-[#1255cc] underline whitespace-nowrap">{fund.ticker}</a>
        </div>

        {/* POSITION — 140px */}
        <div className="w-[140px] h-full flex flex-col justify-center gap-[3px] px-2 shrink-0 overflow-hidden">
          <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">{fund.shares} shares</span>
          <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">{fund.balance}</span>
        </div>

        {/* SELL AMOUNT — 128px: input + Apply button */}
        <div className="w-[128px] h-full flex flex-col justify-center gap-[2px] px-1 shrink-0 overflow-hidden">
          <input
            type="text"
            inputMode="numeric"
            value={inputDisplay}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="$0.00"
            className="w-[120px] h-[28px] px-3 border border-vg-ink rounded-[4px]
              text-[14px] text-vg-ink text-right placeholder:text-vg-ink-muted
              bg-white focus:outline-none focus:ring-2 focus:ring-vg-ink/20"
          />
          {/* Apply button — disabled when value unchanged (REQ-B3-002) */}
          <button
            onClick={handleApply}
            disabled={!hasChange}
            className="text-[10px] text-[#1255cc] underline text-right self-end pr-0
              disabled:opacity-0 cursor-pointer disabled:cursor-default transition-opacity"
          >
            Apply
          </button>
        </div>

        {/* SELL ALL SHARES — 130px */}
        <div className="w-[130px] h-full flex items-center gap-2 px-2 shrink-0 overflow-hidden">
          <div className="w-4 h-4 border-[1.5px] border-[#767676] rounded-[2px] shrink-0 bg-white" />
          <span className="text-[12px] text-vg-ink whitespace-nowrap">Sell all shares</span>
        </div>

        {/* COST BASIS METHOD — 160px */}
        <div className="w-[160px] h-full flex flex-col justify-center gap-1 px-2 shrink-0 overflow-hidden">
          <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">COST BASIS METHOD</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">MinTax</span>
            <a className="text-[14px] text-[#1255cc] underline cursor-pointer whitespace-nowrap">Edit</a>
          </div>
        </div>

        {/* EST. ST GAINS — 95px */}
        <div className="w-[95px] h-full flex flex-col justify-center gap-[3px] px-2 shrink-0 overflow-hidden">
          <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">EST. ST GAINS</span>
          <span className={`text-[14px] font-bold whitespace-nowrap ${taxData.estSTColor}`}>{taxData.estSTGains}</span>
        </div>

        {/* EST. LT GAINS — 95px */}
        <div className="w-[95px] h-full flex flex-col justify-center gap-[3px] px-2 shrink-0 overflow-hidden">
          <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">EST. LT GAINS</span>
          <span className={`text-[14px] font-bold whitespace-nowrap ${taxData.estLTColor}`}>{taxData.estLTGains}</span>
        </div>

        {/* EST. TAX — 85px */}
        <div className="w-[85px] h-full flex flex-col justify-center gap-[3px] px-2 shrink-0 overflow-hidden">
          <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">EST. TAX</span>
          <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">{taxData.estTax}</span>
        </div>

        {/* IMPACT — 110px; hint indicator for Allocation coach mark */}
        <div className="w-[110px] h-full flex flex-col justify-center gap-[3px] px-2 shrink-0 overflow-hidden">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">IMPACT</span>
            {showAllocationHint && hintsVisible && (
              <HintBadge onClick={() => onHintClick('allocation')} />
            )}
          </div>
          <span className={`text-[12px] font-semibold whitespace-nowrap ${taxData.impactColor}`}>{taxData.impact}</span>
        </div>

        {/* ACTION — flex-1: Cancel button */}
        <div className="flex flex-1 h-full items-center justify-end px-2">
          <button
            onClick={onCancel}
            className="h-[36px] w-[90px] rounded-full border-[1.5px] border-vg-ink bg-white
              text-[14px] font-bold text-vg-ink shrink-0 hover:opacity-90 active:opacity-80 transition-opacity"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Details Row — 32px: rationale + optional Wait & Save badge + Lot details trigger */}
      <div className="flex h-8 items-center justify-between px-4 w-full bg-white">
        <div className="flex items-center gap-[5px]">
          <p className="text-[13px] italic text-vg-ink-muted">{taxData.rationale}</p>
          {taxData.waitAndSave && (
            <span className="flex items-center gap-1 px-2 py-[2px] rounded-full bg-[#e07000]">
              <span className="text-[9px] font-bold text-white tracking-[0.36px] whitespace-nowrap">
                WAIT &amp; SAVE {taxData.waitAndSave}
              </span>
            </span>
          )}
          {/* Harvestable loss hint indicator — anchors to VBTLX's Details Row */}
          {showHarvestableHint && hintsVisible && (
            <HintBadge onClick={() => onHintClick('harvestable')} />
          )}
        </div>
        <div className="flex items-center gap-1 cursor-pointer shrink-0">
          <span className="text-[12px] text-vg-ink-muted whitespace-nowrap">Lot details</span>
          <span className="text-vg-ink-muted text-base leading-none">▾</span>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Inactive fund row — identical to FS-MAN-1
// ---------------------------------------------------------------------------

function InactiveFundRow({ fund, onSell }: { fund: FundRow; onSell: () => void }) {
  return (
    <div className="flex h-16 items-center overflow-hidden px-3 w-full border-b border-[#e8e9e9] bg-[#fafafa]">
      <div className="w-[280px] h-full flex flex-col justify-center gap-[3px] px-2 shrink-0 overflow-hidden">
        <span className="text-[12px] text-vg-ink-muted truncate">{fund.fullName}</span>
        <a className="text-[14px] font-bold text-[#1255cc] underline whitespace-nowrap">{fund.ticker}</a>
      </div>
      <div className="w-[140px] h-full flex flex-col justify-center gap-[3px] px-2 shrink-0 overflow-hidden">
        <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">{fund.shares} shares</span>
        <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">{fund.balance}</span>
      </div>
      <div className="w-[128px] h-full shrink-0" />
      <div className="w-[130px] h-full shrink-0" />
      <div className="w-[160px] h-full shrink-0" />
      <div className="w-[95px] h-full shrink-0" />
      <div className="w-[95px] h-full shrink-0" />
      <div className="w-[85px] h-full shrink-0" />
      <div className="w-[110px] h-full shrink-0" />
      <div className="flex flex-1 h-full items-center justify-end px-2">
        <button
          onClick={onSell}
          className="h-[36px] w-[90px] rounded-full border-[1.5px] border-vg-ink bg-white
            text-[14px] font-bold text-vg-ink shrink-0 hover:opacity-90 active:opacity-80 transition-opacity"
        >
          Sell
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Read-only IRA row (same as FS-MAN-1)
// ---------------------------------------------------------------------------

function ReadOnlyFundRow({ fund }: { fund: FundRow }) {
  return (
    <div className="flex h-14 items-center px-6 border-b border-[#e8e9e9] bg-white w-full">
      <div className="flex flex-col gap-[2px]">
        <span className="text-[12px] text-vg-ink-muted">{fund.fullName}</span>
        <span className="text-[13px] font-bold text-[#1255cc] underline">{fund.ticker}</span>
      </div>
      <div className="flex-1" />
      <span className="text-[12px] text-vg-ink-muted mr-4">{fund.assetClass}</span>
      <span className="text-[13px] font-bold text-vg-ink">{fund.balance}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDollar(cents: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })
    .format(cents / 100)
}

// ---------------------------------------------------------------------------
// Canonical data — from pm/08-sample-dataset.json primary scenario
// ---------------------------------------------------------------------------

const ALL_FUNDS: FundRow[] = [
  { ticker: 'VTSAX', fullName: 'Vanguard Total Stock Market Index Fund', shares: '1,597', balance: '$231,884.40', assetClass: 'Domestic Equity' },
  { ticker: 'VBTLX', fullName: 'Vanguard Total Bond Market Index Fund',  shares: '5,600', balance: '$51,408.00',  assetClass: 'Domestic Bonds' },
  { ticker: 'VTIAX', fullName: 'Vanguard Total Intl Stock Index Fund',   shares: '3,600', balance: '$139,500.00', assetClass: 'International Equity' },
  { ticker: 'VBIRX', fullName: 'Vanguard Short-Term Bond Index Fund',    shares: '8,100', balance: '$84,402.00',  assetClass: 'Short-Term Reserves' },
]

const TAX_DATA: Record<string, TaxData> = {
  VTSAX: {
    estSTGains: '$1,515.85',   estSTColor: 'text-[#007a00]',
    estLTGains: '$0.00',        estLTColor: 'text-vg-ink',
    estTax: '$363.80',
    impact: '-0.8% Equity',    impactColor: 'text-[#007a00]',
    rationale: 'Selling the lowest-gain short-term lot (acquired Nov 2025) reduces domestic equity overweight while limiting estimated gross tax to $364.',
    waitAndSave: '$37.03',
  },
  VBTLX: {
    estSTGains: '$0.00',        estSTColor: 'text-vg-ink',
    estLTGains: '-$1,056.65',  estLTColor: 'text-[#c8102e]',
    estTax: '$0.00',
    impact: '-0.4% Bonds',     impactColor: 'text-[#c8102e]',
    rationale: 'Harvesting a $1,057 long-term bond loss nets against equity gains; combined taxable gain is $459 and estimated net tax is $110.',
  },
}

const IRA_FUNDS: FundRow[] = [
  { ticker: 'VBTLX', fullName: 'Vanguard Total Bond Market Index Fund',         shares: '12,000', balance: '$110,160.00', assetClass: 'Domestic Bonds' },
  { ticker: 'VFITX', fullName: 'Vanguard Intermediate-Term Treasury Index Fund', shares: '9,300',  balance: '$100,905.00', assetClass: 'Domestic Bonds' },
]

const ROTH_FUNDS: FundRow[] = [
  { ticker: 'VFIAX', fullName: 'Vanguard 500 Index Fund Admiral Shares', shares: '240', balance: '$131,592.00', assetClass: 'Domestic Equity' },
]

// ---------------------------------------------------------------------------
// Coach mark text (from FS-MAN-1 overlay reads + FS-MAN-2 overlay)
// ---------------------------------------------------------------------------

const COACH_MARKS = {
  tax: 'This figure updates as you adjust your sell amounts. It reflects your estimated capital gains tax on the shares you\'ve selected, at your current rate assumption.',
  allocation: 'This fund makes up more of your portfolio than your target. Selling from it would bring your allocation closer to balance.',
  harvestable: 'This lot is worth less than you paid for it. Selling it realizes a loss that can offset gains elsewhere in your portfolio, potentially reducing your tax bill.',
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function FundSelectionManual2() {
  const navigate = useNavigate()

  // Coach marks — sequential hint-indicator pattern (per FS-AUTO-1 / FS-MAN-1 precedent)
  const [hintsVisible, setHintsVisible] = useState(true)
  const [openMark, setOpenMark] = useState<'tax' | 'allocation' | 'harvestable' | null>(null)

  function handleHintClick(mark: 'tax' | 'allocation' | 'harvestable') {
    setOpenMark(prev => prev === mark ? null : mark)
  }

  // Active funds: which tickers are in active (sell-amount-entered) state
  // Initial state: VTSAX + VBTLX active per Figma FS-MAN-2 (primary scenario)
  const [activeFunds, setActiveFunds] = useState<Set<string>>(new Set(['VTSAX', 'VBTLX']))

  function handleSell(ticker: string) {
    setActiveFunds(prev => new Set([...prev, ticker]))
  }

  function handleCancel(ticker: string) {
    setActiveFunds(prev => {
      const next = new Set(prev)
      next.delete(ticker)
      return next
    })
  }

  // Inactive account expansion
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set())
  function toggleAccount(id: string) {
    setExpandedAccounts(prev => {
      const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next
    })
  }
  const iraExpanded  = expandedAccounts.has('ira')
  const rothExpanded = expandedAccounts.has('roth')

  // NF-1 dialog
  const [showResetDialog, setShowResetDialog] = useState(false)

  function handleConfirmReset() {
    setShowResetDialog(false)
    setActiveFunds(new Set())
    navigate('/automated')
  }

  return (
    <>
      {/* Show Tips / Hide Tips toggle — Figma: Controls/Show Tips [FS-MAN-2] (716:2906), x=978 y=20 */}
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

      {/* NF-1 — Reset confirmation dialog */}
      {showResetDialog && (
        <ResetDialog
          onCancel={() => setShowResetDialog(false)}
          onConfirm={handleConfirmReset}
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
              <button
                onClick={() => navigate('/automated')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-[4px] text-[14px] font-bold text-vg-ink"
              >
                <Sparkles size={16} className="text-vg-ink" />
                Automated
              </button>
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-vg-teal">
                <PenLine size={16} className="text-white" />
                <span className="text-[14px] font-bold text-white">Manual</span>
              </div>
            </div>
          </div>

          {/* Summary Banner — static values from primary scenario (Verification Table 8).
              TODO (REQ-B3-001/B3-002): Summary Banner recalculation is NOT yet wired.
              Applied amounts in ActiveFundRow are local component state; they are not
              lifted to this parent and do not feed the banner. Wiring requires:
                1. Lifting appliedCents per fund up to FundSelectionManual2 state
                2. Passing onApply(ticker, cents) callback down to each ActiveFundRow
                3. Running the optimization/tax engine against updated amounts
                4. Updating SALE TOTAL, EST. ST/LT GAINS, EST. NET TAX, IMPACT accordingly
              Implement when the engine (REQ-OE-001 through REQ-OE-010) is built. */}
          <div className="flex items-center px-8 w-full relative">
            <div className="flex flex-1 items-start bg-[#e8f5f0] px-6 py-4">

              <div className="flex flex-col gap-1 flex-1 min-w-0 overflow-hidden px-3">
                <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">SALE TOTAL</span>
                <span className="text-[20px] font-bold text-vg-ink whitespace-nowrap">$25,000</span>
                <span className="text-[12px] text-vg-ink-muted whitespace-nowrap">2.9% of portfolio</span>
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
                <span className="text-[16px] font-bold text-[#007a00] whitespace-nowrap">$1,515.85</span>
              </div>
              <div className="self-stretch w-px bg-[#c8d8d4] shrink-0" />

              <div className="flex flex-col gap-1 flex-1 min-w-0 overflow-hidden px-3">
                <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">EST. LT GAINS</span>
                <span className="text-[16px] font-bold text-vg-red whitespace-nowrap">-$1,056.65</span>
              </div>
              <div className="self-stretch w-px bg-[#c8d8d4] shrink-0" />

              {/* EST. NET TAX — hint indicator for Real-time Tax coach mark */}
              <div className="flex flex-col gap-1 flex-1 min-w-0 overflow-hidden px-3">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">EST. NET TAX</span>
                  {hintsVisible && (
                    <HintBadge onClick={() => handleHintClick('tax')} />
                  )}
                </div>
                <span className="text-[16px] font-bold text-vg-ink whitespace-nowrap">$110.21</span>
                <span className="text-[12px] text-vg-ink-muted whitespace-nowrap">0.44% effective rate</span>
              </div>
              <div className="self-stretch w-px bg-[#c8d8d4] shrink-0" />

              <div className="flex flex-col gap-0.5 flex-1 min-w-0 overflow-hidden px-3">
                <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">IMPACT</span>
                <div className="flex gap-1.5 items-center">
                  <span className="text-[12px] text-vg-ink">Equity</span>
                  <span className="text-[12px] text-[#007a00]">−0.8%</span>
                </div>
                <div className="flex gap-1.5 items-center">
                  <span className="text-[12px] text-vg-ink">Bonds</span>
                  <span className="text-[12px] text-vg-red">-0.4%</span>
                </div>
                <a className="text-[10px] text-[#1255cc] underline cursor-pointer whitespace-nowrap">
                  Target allocation
                </a>
              </div>

            </div>

            {/* Real-time Tax coach mark bubble — below EST. NET TAX column */}
            {openMark === 'tax' && (
              <div className="absolute z-40" style={{ left: 959, top: 84 }}>
                <CoachMarkBubble text={COACH_MARKS.tax} onDismiss={() => setOpenMark(null)} />
              </div>
            )}
          </div>

          {/* Fund Table — relative wrapper anchors Allocation + Harvestable Loss marks */}
          <div className="flex flex-col items-start px-8 w-full">
            <div className="flex flex-col items-start w-full border border-[#e8e9e9] relative">

              {/* Taxable Brokerage — active account, expanded */}
              <div className="flex h-16 items-center px-4 bg-[#f8f8f8] border-b border-[#e8e9e9] w-full">
                <RadioDot selected={true} />
                <div className="w-2 shrink-0" />
                <div className="flex gap-1 items-center">
                  <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">Taxable Brokerage</span>
                  <span className="text-[12px] text-vg-ink-muted whitespace-nowrap">...4782</span>
                </div>
                <div className="flex-1" />
                <span className="text-[12px] text-vg-ink-muted whitespace-nowrap">
                  62% Equity / 28% Bonds / 10% Other
                </span>
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

              {/* Fund rows — active or inactive per state */}
              {ALL_FUNDS.map(fund => {
                if (activeFunds.has(fund.ticker)) {
                  return (
                    <ActiveFundRow
                      key={fund.ticker}
                      fund={fund}
                      taxData={TAX_DATA[fund.ticker]}
                      initialCents={fund.ticker === 'VTSAX' ? 1500000 : 1000000}
                      showAllocationHint={fund.ticker === 'VTSAX'}
                      showHarvestableHint={fund.ticker === 'VBTLX'}
                      hintsVisible={hintsVisible}
                      onHintClick={handleHintClick}
                      onCancel={() => handleCancel(fund.ticker)}
                    />
                  )
                }
                return (
                  <InactiveFundRow
                    key={fund.ticker}
                    fund={fund}
                    onSell={() => handleSell(fund.ticker)}
                  />
                )
              })}

              {/* Coach Mark — Allocation (IMPACT column, anchored near VTSAX row) */}
              {openMark === 'allocation' && (
                <div className="absolute z-40" style={{ left: 1145, top: 100 }}>
                  <CoachMarkBubble text={COACH_MARKS.allocation} onDismiss={() => setOpenMark(null)} />
                </div>
              )}

              {/* Coach Mark — Harvestable Loss (VBTLX Details Row rationale area) */}
              {openMark === 'harvestable' && (
                <div className="absolute z-40" style={{ left: 769, top: 196 }}>
                  <CoachMarkBubble text={COACH_MARKS.harvestable} onDismiss={() => setOpenMark(null)} />
                </div>
              )}

              {/* Traditional IRA — collapsed, expandable */}
              <div
                className="flex h-16 items-center px-4 bg-[#f8f8f8] border-t border-[#e8e9e9] w-full cursor-pointer"
                onClick={() => toggleAccount('ira')}
              >
                <RadioDot selected={false} />
                <div className="w-2 shrink-0" />
                <div className="flex gap-1 items-center flex-wrap">
                  <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">Traditional IRA</span>
                  <span className="text-[12px] text-vg-ink-muted whitespace-nowrap">...2973</span>
                  <div className="w-2 shrink-0" />
                  <div className="flex items-center gap-1 px-2 py-[2px] rounded-full bg-[#e07000]">
                    <span className="text-[9px] font-bold text-white tracking-[0.36px] whitespace-nowrap">
                      Remaining 2026 RMD: $3,668
                    </span>
                  </div>
                </div>
                <div className="flex-1" />
                <span className="text-[12px] text-vg-ink-muted whitespace-nowrap">22% Equity / 78% Bonds / 0% Other</span>
                <div className="w-4 shrink-0" />
                <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">$211,065.00</span>
                <div className="w-4 shrink-0" />
                {iraExpanded ? <ChevronUp size={24} className="text-vg-ink shrink-0" /> : <ChevronDown size={24} className="text-vg-ink shrink-0" />}
              </div>
              {iraExpanded && IRA_FUNDS.map(fund => (
                <ReadOnlyFundRow key={fund.ticker + '-ira'} fund={fund} />
              ))}

              {/* Roth IRA — collapsed, expandable */}
              <div
                className="flex h-16 items-center px-4 bg-[#f8f8f8] border-t border-[#e8e9e9] w-full cursor-pointer"
                onClick={() => toggleAccount('roth')}
              >
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
              {rothExpanded && ROTH_FUNDS.map(fund => (
                <ReadOnlyFundRow key={fund.ticker + '-roth'} fund={fund} />
              ))}

            </div>
          </div>

          {/* Footer Bar — Figma 382:1563/1564
              "Review order" (primary) + "Go to Scenario Analysis" (secondary) +
              "↩ Reset to system recommendation" (ghost-link → NF-1 dialog) */}
          <div className="flex gap-3 items-center px-8 w-full">
            <button className="h-[48px] px-7 rounded-full bg-vg-ink text-white text-[14px] font-bold whitespace-nowrap hover:opacity-90">
              Review order
            </button>
            <button className="h-[48px] px-7 rounded-full border-[1.5px] border-vg-ink text-vg-ink bg-white text-[14px] font-bold whitespace-nowrap hover:opacity-90">
              Go to Scenario Analysis
            </button>
            <button
              onClick={() => setShowResetDialog(true)}
              className="text-[14px] text-[#1255cc] underline cursor-pointer whitespace-nowrap hover:opacity-80"
            >
              ↩ Reset to system recommendation
            </button>
          </div>

        </div>
      </div>
    </>
  )
}
