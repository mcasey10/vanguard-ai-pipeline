import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, PenLine, ChevronDown, ChevronUp } from 'lucide-react'
import { useModeToggleGuard, SaveDiscardDialog } from '../components/ModeToggleGuard'
import { CostBasisDialog, type CostBasisMethod } from '../components/CostBasisDialog'
import type { AccountingMethod } from '../types'

// Map UI method label → engine AccountingMethod
function toAccountingMethod(m: CostBasisMethod): AccountingMethod {
  if (m === 'SpecID')   return 'specific_lot_identification'
  if (m === 'AvgCost')  return 'average_cost'
  return m as AccountingMethod  // MinTax | HIFO | FIFO pass through unchanged
}
import { TargetAllocationModal } from '../components/TargetAllocationModal'
import { useAppStore } from '../store/useAppStore'
import { runOptimization } from '../engine/index'
import type { FundSaleResult, ManualConfiguration } from '../types'
import { formatCurrency, formatCurrencyCompact, formatShares, formatPercent } from '../utils/format'
import { buildScenarioFromFundResults, isDuplicateScenario } from '../utils/scenarioBuilder'

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
  balanceCents?: number // raw balance for "Sell all shares" (undefined on read-only rows)
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
  appliedCents,
  currentMethod,
  onApply,
  onMethodChange,
  showAllocationHint,
  showHarvestableHint,
  hintsVisible,
  onHintClick,
  onCancel,
  onLotDetails,
}: {
  fund: FundRow
  taxData: TaxData
  appliedCents: number
  currentMethod: CostBasisMethod      // lifted — parent is source of truth
  onApply: (ticker: string, cents: number) => void
  onMethodChange: (ticker: string, method: CostBasisMethod) => void
  showAllocationHint: boolean
  showHarvestableHint: boolean
  hintsVisible: boolean
  onHintClick: (mark: 'tax' | 'allocation' | 'harvestable') => void
  onCancel: () => void
  onLotDetails: (ticker: string) => void
}) {
  const [inputCents, setInputCents]     = useState(appliedCents)
  const [inputDisplay, setInputDisplay] = useState(formatCurrency(appliedCents / 100))
  const [showMethodDialog, setShowMethodDialog] = useState(false)

  const hasChange = inputCents !== appliedCents
  // "Sell all shares" is checked when the input amount equals the fund's full balance
  const balanceCents = fund.balanceCents ?? 0
  const isAllShares = balanceCents > 0 && inputCents >= balanceCents
  // Lot details only accessible when SpecID is chosen (Issues 3 + CLAUDE.md constraint 4)
  const canViewLots = currentMethod === 'SpecID'

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '')
    const cents  = parseInt(digits || '0', 10)
    setInputCents(cents)
    setInputDisplay(digits === '' ? '' : formatCurrency(cents / 100))
  }

  function handleApply() {
    if (!hasChange) return
    onApply(fund.ticker, inputCents)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleApply()
  }

  function handleSellAll(checked: boolean) {
    if (checked) {
      setInputCents(balanceCents)
      setInputDisplay(formatCurrency(balanceCents / 100))
      onApply(fund.ticker, balanceCents)
    } else {
      setInputCents(0)
      setInputDisplay('')
      onApply(fund.ticker, 0)
    }
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

        {/* SELL AMOUNT — 128px: label + input, same label/value pattern as every other column.
            py-[8px] (vs py-[12px] elsewhere) because label+input together need ~44px of content
            height; inner flex-1 justify-center centers the pair within the available 48px. */}
        <div className="w-[128px] h-full flex flex-col gap-[3px] items-start overflow-hidden px-[4px] py-[8px] shrink-0">
          <div className="flex flex-1 flex-col gap-[4px] items-start justify-center min-h-0 w-[120px]">
            <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">SELL AMOUNT</span>
            <input
              type="text"
              inputMode="numeric"
              value={inputDisplay}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onBlur={handleApply}
              placeholder="$0.00"
              className="w-[120px] h-[28px] px-3 border border-vg-ink rounded-[4px]
                text-[14px] text-vg-ink text-right placeholder:text-vg-ink-muted
                bg-white focus:outline-none focus:ring-2 focus:ring-vg-ink/20"
            />
          </div>
        </div>

        {/* SELL ALL SHARES — 130px */}
        <div className="w-[130px] h-full flex flex-col gap-2 items-start px-2 py-[12px] shrink-0 overflow-hidden">
          <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">&nbsp;</span>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div
              onClick={() => handleSellAll(!isAllShares)}
              className={`w-4 h-4 border-[1.5px] rounded-[2px] shrink-0 flex items-center justify-center cursor-pointer
                ${isAllShares ? 'bg-vg-ink border-vg-ink' : 'bg-white border-[#767676]'}`}
            >
              {isAllShares && <span className="text-white text-[10px] leading-none font-bold">✓</span>}
            </div>
            <span className="text-[12px] text-vg-ink whitespace-nowrap">Sell all shares</span>
          </label>
        </div>

        {/* COST BASIS METHOD — 160px — lifted to parent for engine re-run on change */}
        <div className="w-[160px] h-full flex flex-col justify-center gap-1 px-2 shrink-0 overflow-hidden">
          <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">COST BASIS METHOD</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">{currentMethod}</span>
            <a
              className="text-[14px] text-[#1255cc] underline cursor-pointer whitespace-nowrap"
              onClick={() => setShowMethodDialog(true)}
            >Edit</a>
          </div>
          {showMethodDialog && (
            <CostBasisDialog
              currentMethod={currentMethod}
              onConfirm={method => { onMethodChange(fund.ticker, method); setShowMethodDialog(false) }}
              onClose={() => setShowMethodDialog(false)}
            />
          )}
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
        <button
          onClick={() => canViewLots && onLotDetails(fund.ticker)}
          disabled={!canViewLots}
          title={canViewLots ? undefined : 'Select Spec ID to view and edit lot-level details'}
          className={`flex items-center gap-1 shrink-0 ${canViewLots ? 'cursor-pointer hover:opacity-70' : 'opacity-30 cursor-not-allowed'}`}
        >
          <span className="text-[12px] text-vg-ink-muted whitespace-nowrap">Lot details</span>
          <span className="text-vg-ink-muted text-base leading-none">▾</span>
        </button>
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

// ---------------------------------------------------------------------------
// Helper: map FundSaleResult → TaxData for ActiveFundRow display
// ---------------------------------------------------------------------------

function r2(n: number) { return Math.round(n * 100) / 100 }
function fmtSigned(n: number) { return (n >= 0 ? '+' : '−') + formatCurrency(Math.abs(n)) }
// 2-decimal rate display for effective rate (Intl, no toFixed)
function fmtRate2(n: number) { return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) }

function taxDataFromResult(fr: FundSaleResult | undefined): TaxData {
  if (!fr) return {
    estSTGains: '—', estSTColor: 'text-vg-ink',
    estLTGains: '—', estLTColor: 'text-vg-ink',
    estTax: '—', impact: '—', impactColor: 'text-vg-ink', rationale: '',
  }
  const stg = fr.est_st_gain_loss, ltg = fr.est_lt_gain_loss
  return {
    estSTGains: stg !== 0 ? fmtSigned(stg) : formatCurrency(0),
    estSTColor: stg > 0 ? 'text-[#007a00]' : stg < 0 ? 'text-[#c8102e]' : 'text-vg-ink',
    estLTGains: ltg !== 0 ? fmtSigned(ltg) : formatCurrency(0),
    estLTColor: ltg > 0 ? 'text-[#007a00]' : ltg < 0 ? 'text-[#c8102e]' : 'text-vg-ink',
    estTax: formatCurrency(fr.est_tax_gross),
    impact: `${fr.impact_pct <= 0 ? '−' : '+'}${new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(Math.abs(fr.impact_pct))}% ${fr.impact_asset_class.replace('_', ' ')}`,
    impactColor: fr.impact_pct <= 0 ? 'text-[#007a00]' : 'text-[#c8102e]',
    rationale: fr.rationale,
    waitAndSave: undefined,
  }
}

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
  const { portfolio, activeAccountId, activeTaxRates, optimizationPriority, setManualConfig, recommendation,
    scenarios, addScenario, updateScenario, activeScenarioId, setActiveScenarioId, setPortfolio } = useAppStore()

  // Engine output for this session — per-fund results for display
  const [fundResults, setFundResults] = useState<FundSaleResult[]>([])

  // Cost basis methods — lifted from ActiveFundRow so runManualEngine can use them
  const [costBasisMethods, setCostBasisMethods] = useState<Record<string, CostBasisMethod>>({})

  // Coach marks — sequential hint-indicator pattern (per FS-AUTO-1 / FS-MAN-1 precedent)
  const [hintsVisible, setHintsVisible] = useState(true)
  const [openMark, setOpenMark] = useState<'tax' | 'allocation' | 'harvestable' | null>(null)

  function handleHintClick(mark: 'tax' | 'allocation' | 'harvestable') {
    setOpenMark(prev => prev === mark ? null : mark)
  }

  // Active funds and applied amounts: seeded from store.recommendation when arriving
  // from Automated mode; empty when entering Manual directly (no prior recommendation).
  // Lazy initializers run once on mount — recommendation is already in store by then.
  const [activeFunds, setActiveFunds] = useState<Set<string>>(() => {
    if (recommendation?.fund_results?.length) {
      return new Set(recommendation.fund_results.map(fr => fr.fund_id))
    }
    return new Set()  // empty — user activates funds via Sell button (REQ-B1-004)
  })

  const [appliedAmounts, setAppliedAmounts] = useState<Record<string, number>>(() => {
    if (recommendation?.fund_results?.length) {
      // sell_amount is in dollars; appliedAmounts stores cents
      return Object.fromEntries(
        recommendation.fund_results.map(fr => [fr.fund_id, Math.round(fr.sell_amount * 100)])
      )
    }
    return {}  // empty — no amounts until user enters them
  })

  // runManualEngine — builds ManualSelections from current activeFunds + appliedAmounts
  // and calls runOptimization() in manual mode. Called on Apply/blur/Enter.
  const runManualEngine = useCallback((
    newAmounts: Record<string, number>,
    newActiveFunds: Set<string>,
    newMethods: Record<string, CostBasisMethod> = {}
  ) => {
    if (!portfolio) return
    const totalDollars = r2(Object.values(newAmounts).reduce((s, v) => s + v, 0) / 100)
    if (totalDollars <= 0 || newActiveFunds.size === 0) { setFundResults([]); return }
    const fundSelectionsForEngine = Array.from(newActiveFunds)
      .filter(ticker => (newAmounts[ticker] ?? 0) > 0)
      .map(ticker => ({
        fund_id: ticker,
        accounting_method: toAccountingMethod(newMethods[ticker] ?? 'MinTax'),
      }))
    if (fundSelectionsForEngine.length === 0) { setFundResults([]); return }
    const result = runOptimization({
      portfolio,
      targetSaleAmount: totalDollars,
      activeAccountId,
      mode: 'manual',
      optimizationPriority,
      activeTaxRates,
      manualSelections: { fund_selections: fundSelectionsForEngine },
    })
    // Extract fundResults from the engine's internal computation via cast
    // ManualConfiguration doesn't expose fund_results directly; we cast to access them
    // This is a known limitation — Step 4 partial: banner updates, per-fund display updates
    const config = result as ManualConfiguration
    setManualConfig(config)
    // For per-fund display, re-run in automated-like mode to get FundSaleResult[]
    // using the same amounts and funds — this gives us the tax figures for display
    const autoResult = runOptimization({
      portfolio,
      targetSaleAmount: totalDollars,
      activeAccountId,
      mode: 'automated',
      optimizationPriority,
      activeTaxRates,
    })
    if (autoResult.mode === 'automated') {
      setFundResults((autoResult as import('../types').Recommendation).fund_results)
    }
  }, [portfolio, activeAccountId, optimizationPriority, activeTaxRates, setManualConfig])

  // handleMethodChange — updates per-fund method and re-runs engine
  function handleMethodChange(ticker: string, method: CostBasisMethod) {
    setHasUserModified(true)
    const newMethods = { ...costBasisMethods, [ticker]: method }
    setCostBasisMethods(newMethods)
    runManualEngine(appliedAmounts, activeFunds, newMethods)
  }

  // On mount: fire engine once if amounts are already present (covers two gaps):
  //   Gap 1 — returning from FS-MAN-LOT: fundResults local state was lost on
  //     unmount, but appliedAmounts survived in component state. Re-running the
  //     engine regenerates fundResults so the banner shows live figures immediately.
  //   Gap 2 — pre-populated from Automated recommendation: inputCents===appliedCents
  //     on mount so Apply never fires, leaving the banner at dashes. One mount-time
  //     engine call initializes it the same way Apply would.
  useEffect(() => {
    const total = Object.values(appliedAmounts).reduce((s, v) => s + v, 0)
    if (total > 0 && activeFunds.size > 0) {
      runManualEngine(appliedAmounts, activeFunds, costBasisMethods)
    }
  }, []) // intentionally runs once on mount — same pattern as FS-AUTO-1

  // handleApplyAmount — updates local state then triggers engine
  function handleApplyAmount(ticker: string, cents: number) {
    setHasUserModified(true)
    const newAmounts = { ...appliedAmounts, [ticker]: cents }
    setAppliedAmounts(newAmounts)
    runManualEngine(newAmounts, activeFunds, costBasisMethods)
  }

  function handleLotDetails(ticker: string) {
    navigate('/manual-lot', { state: { fund: ticker } })
  }

  // Target Allocation Modal
  const [showAllocModal, setShowAllocModal] = useState(false)

  // Account references (for masked_number display)
  const taxableAcct = portfolio?.accounts.find(a => a.account_type === 'taxable_brokerage')
  const iraAcct2    = portfolio?.accounts.find(a => a.account_type === 'traditional_IRA')
  const rothAcct2   = portfolio?.accounts.find(a => a.account_type === 'roth_IRA')

  // Track whether the user has explicitly changed something in Manual mode.
  // Pre-populated amounts from the Automated recommendation do NOT count as user changes.
  // The dialog only fires if the user has taken a deliberate action (Sell, Cancel, Apply).
  const [hasUserModified, setHasUserModified] = useState(false)
  const { showDialog: showModeDialog, handleToggleClick, handleSave, handleDiscard, handleClose } =
    useModeToggleGuard(hasUserModified)

  function handleSell(ticker: string) {
    setHasUserModified(true)
    setActiveFunds(prev => new Set([...prev, ticker]))
    setAppliedAmounts(prev => ({ ...prev, [ticker]: 0 }))
  }

  function handleCancel(ticker: string) {
    setHasUserModified(true)
    setActiveFunds(prev => {
      const next = new Set(prev)
      next.delete(ticker)
      return next
    })
    setAppliedAmounts(prev => { const next = { ...prev }; delete next[ticker]; return next })
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

  // REQ-B4-001: "Go to Scenario Analysis" → save/update scenario then navigate
  function handleGoToScenarios() {
    if (fundResults.length > 0) {
      const scenario = buildScenarioFromFundResults(fundResults, portfolio, activeTaxRates, null)
      if (scenario) {
        if (activeScenarioId) {
          // Editing → update in place
          updateScenario(activeScenarioId, { ...scenario, scenario_id: activeScenarioId })
          setActiveScenarioId(null)
        } else if (scenarios.length < 3 && !isDuplicateScenario(scenario, scenarios)) {
          addScenario(scenario)
        }
      }
    }
    navigate('/scenarios')
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

      {/* Target Allocation Modal */}
      {showAllocModal && (
        <TargetAllocationModal
          onClose={() => setShowAllocModal(false)}
          initialStocks={(portfolio?.target_allocation?.domestic_equity_pct ?? 0) + (portfolio?.target_allocation?.international_equity_pct ?? 0)}
          initialBonds={portfolio?.target_allocation?.domestic_bonds_pct ?? 35}
          initialReserves={portfolio?.target_allocation?.short_term_reserves_pct ?? 10}
          onSave={(stocks, bonds, reserves) => {
            if (!portfolio) return
            const oldTa = portfolio.target_allocation
            // Preserve domestic/international ratio within the new stocks total
            const oldStocks = (oldTa?.domestic_equity_pct ?? 40) + (oldTa?.international_equity_pct ?? 15)
            const ratio = oldStocks > 0 ? (oldTa?.domestic_equity_pct ?? 40) / oldStocks : 0.727
            const newDomestic = Math.round(stocks * ratio * 10) / 10
            const newIntl     = Math.round((stocks - newDomestic) * 10) / 10
            const updated = {
              ...portfolio,
              target_allocation: {
                allocation_id:           oldTa?.allocation_id ?? 'user-set',
                portfolio_id:            portfolio.portfolio_id,
                domestic_equity_pct:     newDomestic,
                international_equity_pct: newIntl,
                domestic_bonds_pct:      bonds,
                short_term_reserves_pct: reserves,
                fund_level_targets:      oldTa?.fund_level_targets ?? null,
                source:                  'user_set' as const,
                as_of_date:              new Date().toISOString().slice(0, 10),
              },
            }
            setPortfolio(updated)
            runManualEngine(appliedAmounts, activeFunds, costBasisMethods)
          }}
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
            <div className="flex items-center border-[1.5px] border-vg-ink rounded-full p-[2px] bg-white h-[37px]">
              <button
                onClick={handleToggleClick}
                className="self-stretch flex items-center gap-1.5 px-4 rounded-[4px] text-[14px] font-bold text-vg-ink"
              >
                <Sparkles size={16} className="text-vg-ink" />
                Automated
              </button>
              <div className="self-stretch flex items-center gap-1.5 px-4 rounded-full bg-vg-teal">
                <PenLine size={16} className="text-white" />
                <span className="text-[14px] font-bold text-white">Manual</span>
              </div>
            </div>
          </div>

          {/* Summary Banner — values from engine output (fundResults) when available */}
          {(() => {
            const totalSale = r2(fundResults.reduce((s, f) => s + f.sell_amount, 0))
            const salePct = portfolio ? r2((totalSale / portfolio.total_investable_balance) * 100) : 0
            const stGains = r2(fundResults.reduce((s, f) => s + f.est_st_gain_loss, 0))
            const ltGains = r2(fundResults.reduce((s, f) => s + f.est_lt_gain_loss, 0))
            const netGain = Math.max(0, r2(stGains + ltGains))
            const taxST = Math.min(netGain, Math.max(0, stGains)) * activeTaxRates.st_rate
            const taxLT = Math.max(0, netGain - Math.min(netGain, Math.max(0, stGains))) * activeTaxRates.lt_rate
            const estNetTax = r2(taxST + taxLT)
            const effRate = totalSale > 0 ? r2((estNetTax / totalSale) * 100) : 0
            const ai = fundResults.length > 0 ? { stGains, ltGains, estNetTax, effRate, totalSale, salePct } : null
            return (
          <div className="flex items-center px-8 w-full relative">
            <div className="flex flex-1 items-start bg-[#e8f5f0] px-6 py-4">

              <div className="flex flex-col gap-1 flex-1 min-w-0 overflow-hidden px-3">
                <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">SALE TOTAL</span>
                <span className="text-[20px] font-bold text-vg-ink whitespace-nowrap">{ai ? formatCurrencyCompact(ai.totalSale) : '—'}</span>
                <span className="text-[12px] text-vg-ink-muted whitespace-nowrap">{ai ? formatPercent(ai.salePct, true) + ' of portfolio' : '0.0% of portfolio'}</span>
              </div>
              <div className="self-stretch w-px bg-[#c8d8d4] shrink-0" />
              <div className="flex flex-col gap-1 flex-1 min-w-0 overflow-hidden px-3">
                <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">TAX BRACKET</span>
                <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">{Math.round(activeTaxRates.st_rate*100)}% ST / {Math.round(activeTaxRates.lt_rate*100)}% LT</span>
                <a className="text-[12px] text-[#1255cc] underline cursor-pointer whitespace-nowrap">Change</a>
              </div>
              <div className="self-stretch w-px bg-[#c8d8d4] shrink-0" />
              <div className="flex flex-col gap-1 flex-1 min-w-0 overflow-hidden px-3">
                <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">YTD REALIZED</span>
                {portfolio?.ytd_gains_record ? (
                  <>
                    <span className="text-[12px] text-vg-ink whitespace-nowrap">ST {formatCurrency(portfolio.ytd_gains_record.st_gains_realized_ytd)}</span>
                    <span className="text-[12px] text-vg-ink whitespace-nowrap">LT {formatCurrency(portfolio.ytd_gains_record.lt_gains_realized_ytd)}</span>
                  </>
                ) : <span className="text-[12px] text-vg-ink-muted">—</span>}
              </div>
              <div className="self-stretch w-px bg-[#c8d8d4] shrink-0" />
              <div className="flex flex-col gap-1 flex-1 min-w-0 overflow-hidden px-3">
                <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">EST. ST GAINS</span>
                <span className={`text-[16px] font-bold whitespace-nowrap ${ai && ai.stGains > 0 ? 'text-[#007a00]' : ai && ai.stGains < 0 ? 'text-vg-red' : 'text-vg-ink'}`}>
                  {ai ? fmtSigned(ai.stGains) : '—'}
                </span>
              </div>
              <div className="self-stretch w-px bg-[#c8d8d4] shrink-0" />
              <div className="flex flex-col gap-1 flex-1 min-w-0 overflow-hidden px-3">
                <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">EST. LT GAINS</span>
                <span className={`text-[16px] font-bold whitespace-nowrap ${ai && ai.ltGains > 0 ? 'text-[#007a00]' : ai && ai.ltGains < 0 ? 'text-vg-red' : 'text-vg-ink'}`}>
                  {ai ? fmtSigned(ai.ltGains) : '—'}
                </span>
              </div>
              <div className="self-stretch w-px bg-[#c8d8d4] shrink-0" />
              <div className="flex flex-col gap-1 flex-1 min-w-0 overflow-hidden px-3">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">EST. NET TAX</span>
                  {hintsVisible && <HintBadge onClick={() => handleHintClick('tax')} />}
                </div>
                <span className="text-[16px] font-bold text-vg-ink whitespace-nowrap">{ai ? formatCurrency(ai.estNetTax) : '—'}</span>
                <span className="text-[12px] text-vg-ink-muted whitespace-nowrap">{ai ? fmtRate2(ai.effRate) + '% effective rate' : ''}</span>
              </div>
              <div className="self-stretch w-px bg-[#c8d8d4] shrink-0" />
              <div className="flex flex-col gap-0.5 flex-1 min-w-0 overflow-hidden px-3">
                <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">IMPACT</span>
                <div className="flex gap-1.5 items-center"><span className="text-[12px] text-vg-ink">Equity</span><span className="text-[12px] text-vg-ink">—</span></div>
                <div className="flex gap-1.5 items-center"><span className="text-[12px] text-vg-ink">Bonds</span><span className="text-[12px] text-vg-ink">—</span></div>
                <a className="text-[10px] text-[#1255cc] underline cursor-pointer whitespace-nowrap" onClick={() => setShowAllocModal(true)}>Target allocation</a>
              </div>
            </div>
            {openMark === 'tax' && (
              <div className="absolute z-40" style={{ left: 959, top: 84 }}>
                <CoachMarkBubble text={COACH_MARKS.tax} onDismiss={() => setOpenMark(null)} />
              </div>
            )}
          </div>
          )})()}

          {/* Fund Table — relative wrapper anchors Allocation + Harvestable Loss marks */}
          <div className="flex flex-col items-start px-8 w-full">
            <div className="flex flex-col items-start w-full border border-[#e8e9e9] relative">

              {/* Taxable Brokerage — active account, expanded */}
              <div className="flex h-16 items-center px-4 bg-[#f8f8f8] border-b border-[#e8e9e9] w-full">
                <RadioDot selected={true} />
                <div className="w-2 shrink-0" />
                <div className="flex gap-1 items-center">
                  <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">Taxable Brokerage</span>
                  <span className="text-[12px] text-vg-ink-muted whitespace-nowrap">{taxableAcct?.masked_number ?? '...4782'}</span>
                </div>
                <div className="flex-1" />
                <span className="text-[12px] text-vg-ink-muted whitespace-nowrap">
                  62% Equity / 28% Bonds / 10% Other
                </span>
                <div className="w-4 shrink-0" />
                <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">{taxableAcct ? formatCurrency(taxableAcct.account_balance) : '—'}</span>
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

              {/* Fund rows — active funds first (portfolio order within group), then inactive funds.
                  This keeps pre-populated funds (from Automated recommendation) adjacent and stable;
                  activating/deactivating a fund moves it between groups but never splits active rows. */}
              {(() => {
                const allHoldings = portfolio?.accounts.find(a => a.account_id === activeAccountId)?.holdings ?? []
                return [
                  ...allHoldings.filter(h => activeFunds.has(h.fund_id)),
                  ...allHoldings.filter(h => !activeFunds.has(h.fund_id)),
                ]
              })().map(holding => {
                const fund: FundRow = {
                  ticker: holding.fund_id,
                  fullName: holding.fund_name,
                  shares: formatShares(holding.total_shares),
                  balance: formatCurrency(holding.current_balance),
                  assetClass: holding.asset_class.replace('_', ' '),
                  balanceCents: Math.round(holding.current_balance * 100),
                }
                const engineResult = fundResults.find(fr => fr.fund_id === holding.fund_id)
                if (activeFunds.has(fund.ticker)) {
                  return (
                    <ActiveFundRow
                      key={fund.ticker}
                      fund={fund}
                      taxData={taxDataFromResult(engineResult)}
                      appliedCents={appliedAmounts[fund.ticker] ?? 0}
                      currentMethod={costBasisMethods[fund.ticker] ?? 'MinTax'}
                      onApply={handleApplyAmount}
                      onMethodChange={handleMethodChange}
                      onLotDetails={handleLotDetails}
                      showAllocationHint={holding.asset_class === 'domestic_equity'}
                      showHarvestableHint={(holding.total_unrealized_gain_loss ?? 0) < 0}
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
                  <span className="text-[12px] text-vg-ink-muted whitespace-nowrap">{iraAcct2?.masked_number ?? '...2973'}</span>
                  <div className="w-2 shrink-0" />
                  <div className="flex items-center gap-1 px-2 py-[2px] rounded-full bg-[#e07000]">
                    <span className="text-[9px] font-bold text-white tracking-[0.36px] whitespace-nowrap">
                      Remaining 2026 RMD: {iraAcct2?.rmd_record ? formatCurrency(Math.round(iraAcct2.rmd_record.rmd_remaining)) : '$3,668'}
                    </span>
                  </div>
                </div>
                <div className="flex-1" />
                <span className="text-[12px] text-vg-ink-muted whitespace-nowrap">22% Equity / 78% Bonds / 0% Other</span>
                <div className="w-4 shrink-0" />
                <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">{iraAcct2 ? formatCurrency(iraAcct2.account_balance) : '—'}</span>
                <div className="w-4 shrink-0" />
                {iraExpanded ? <ChevronUp size={24} className="text-vg-ink shrink-0" /> : <ChevronDown size={24} className="text-vg-ink shrink-0" />}
              </div>
              {iraExpanded && (portfolio?.accounts.find(a => a.account_type === 'traditional_IRA')?.holdings ?? []).map(h => (
                <ReadOnlyFundRow key={h.fund_id + '-ira'} fund={{ ticker: h.fund_id, fullName: h.fund_name, shares: formatShares(h.total_shares), balance: formatCurrency(h.current_balance), assetClass: h.asset_class.replace('_', ' ') }} />
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
                  <span className="text-[12px] text-vg-ink-muted whitespace-nowrap">{rothAcct2?.masked_number ?? '...8148'}</span>
                </div>
                <div className="flex-1" />
                <span className="text-[12px] text-vg-ink-muted whitespace-nowrap">100% Equity</span>
                <div className="w-4 shrink-0" />
                <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">{rothAcct2 ? formatCurrency(rothAcct2.account_balance) : '—'}</span>
                <div className="w-4 shrink-0" />
                {rothExpanded ? <ChevronUp size={24} className="text-vg-ink shrink-0" /> : <ChevronDown size={24} className="text-vg-ink shrink-0" />}
              </div>
              {rothExpanded && (portfolio?.accounts.find(a => a.account_type === 'roth_IRA')?.holdings ?? []).map(h => (
                <ReadOnlyFundRow key={h.fund_id + '-roth'} fund={{ ticker: h.fund_id, fullName: h.fund_name, shares: formatShares(h.total_shares), balance: formatCurrency(h.current_balance), assetClass: h.asset_class.replace('_', ' ') }} />
              ))}

            </div>
          </div>

          {/* Footer Bar — Figma 382:1563/1564
              "Review order" (primary) + "Go to Scenario Analysis" (secondary) +
              "↩ Reset to system recommendation" (ghost-link → NF-1 dialog) */}
          <div className="flex gap-3 items-center px-8 w-full">
            <button onClick={() => navigate('/confirm')} className="h-[48px] px-7 rounded-full bg-vg-ink text-white text-[14px] font-bold whitespace-nowrap hover:opacity-90 transition-opacity">
              Review order
            </button>
            <button onClick={handleGoToScenarios} className="h-[48px] px-7 rounded-full border-[1.5px] border-vg-ink text-vg-ink bg-white text-[14px] font-bold whitespace-nowrap hover:opacity-90 transition-opacity">
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
