/**
 * OrderConfirmation — Stage 3 pre-execution summary screen (OC-1, node 628:26277)
 *
 * REQ-EC-001: Display funds, amounts, method, EST. NET TAX, destination, settlement.
 * REQ-EC-002: Tax advisory notice — normalise, not alarm.
 * REQ-EC-004: No new information introduced at this stage.
 * Decision 11: Two actions only — Submit order (primary) and Cancel (returns to previous screen).
 */

import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { appendTransaction } from '../data/loader'
import type { SavedScenario, Recommendation, TransactionRecord, TransactionFundRecord, AccountingMethod, Portfolio } from '../types'
import { formatCurrency } from '../utils/format'

// ---------------------------------------------------------------------------
// Helpers — derive confirmation data from whatever is in the store
// ---------------------------------------------------------------------------

function r2(n: number) { return Math.round(n * 100) / 100 }

// Shorten fund names for the confirmation table — strip share-class suffixes
function shortFundName(name: string): string {
  return name
    .replace(/^Vanguard\s+/i, '')      // strip "Vanguard " prefix — matches Figma OC-1 display
    .replace(/\s+Admiral Shares$/i, '')
    .replace(/\s+Investor Shares$/i, '')
    .replace(/\s+ETF$/i, '')
    .trim()
}

function fmtRate2(n: number): string {
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + '%'
}

function fmtGainLoss(n: number, period: 'ST' | 'LT' | ''): string {
  const abs = formatCurrency(Math.abs(n))
  const sign = n >= 0 ? '+' : '−'
  return `${sign}${abs}${period ? ' ' + period : ''}`
}

interface ConfirmData {
  accountName: string
  accountMasked: string
  totalSaleAmount: number
  funds: Array<{
    id: string
    name: string
    method: string
    sellAmount: number
    gainLoss: number
    gainLossPeriod: 'ST' | 'LT' | ''
    estTaxGross: number
  }>
  stCapitalGains: number
  ltCapitalGains: number
  lossesHarvested: number
  netTaxableGain: number
  federalTax: number
  estNetTax: number
  effectiveRate: number
  grossProceeds: number
  estFederalTax: number
  estNetProceeds: number
  optimizationMode: 'tax-first' | 'balance-first'
  accountingMethod: AccountingMethod
}

function buildConfirmData(
  scenario: SavedScenario | null,
  rec: Recommendation | null,
  portfolio: Portfolio,
  activeAccountId: string,
  optimizationPriority: 'tax-first' | 'balance-first'
): ConfirmData | null {
  const acct = portfolio.accounts.find((a) => a.account_id === activeAccountId)
    ?? portfolio.accounts.find((a) => a.account_type === 'taxable_brokerage')

  // Resolve fund selections from scenario or recommendation
  let funds: ConfirmData['funds'] = []
  let totalSaleAmount = 0
  let stCapitalGains = 0
  let ltCapitalGains = 0
  let lossesHarvested = 0
  let estNetTax = 0
  let effectiveRate = 0
  let optMode: 'tax-first' | 'balance-first' = optimizationPriority
  let accountingMethod: AccountingMethod = 'MinTax'

  if (scenario) {
    funds = scenario.fund_selections.map(fs => {
      const stg = fs.st_gain_loss ?? 0
      const ltg = fs.lt_gain_loss ?? 0
      const period: 'ST' | 'LT' | '' = stg !== 0 ? 'ST' : ltg !== 0 ? 'LT' : ''
      return {
        id: fs.fund_id,
        name: shortFundName(fs.fund_name ?? fs.fund_id),
        method: fs.accounting_method === 'specific_lot_identification' ? 'Spec ID' : fs.accounting_method,
        sellAmount: fs.sell_amount,
        gainLoss: period === 'ST' ? stg : ltg,
        gainLossPeriod: period,
        estTaxGross: fs.est_tax_gross ?? 0,
      }
    })
    totalSaleAmount = scenario.total_sell_amount
    stCapitalGains = r2(scenario.projected_st_gains)
    ltCapitalGains = r2(scenario.projected_lt_gains)
    lossesHarvested = r2(scenario.losses_harvested)
    estNetTax = r2(scenario.est_net_tax)
    effectiveRate = scenario.total_sell_amount > 0 ? r2((estNetTax / scenario.total_sell_amount) * 100) : 0
    optMode = (scenario.optimization_priority as 'tax-first' | 'balance-first') ?? optimizationPriority
    accountingMethod = (scenario.fund_selections[0]?.accounting_method as AccountingMethod) ?? 'MinTax'
  } else if (rec) {
    funds = rec.fund_results.map(fr => {
      const stg = fr.est_st_gain_loss
      const ltg = fr.est_lt_gain_loss
      const period: 'ST' | 'LT' | '' = stg !== 0 ? 'ST' : ltg !== 0 ? 'LT' : ''
      return {
        id: fr.fund_id,
        name: shortFundName(fr.fund_name),
        method: fr.accounting_method === 'specific_lot_identification' ? 'Spec ID' : fr.accounting_method,
        sellAmount: fr.sell_amount,
        gainLoss: period === 'ST' ? stg : ltg,
        gainLossPeriod: period,
        estTaxGross: fr.est_tax_gross,
      }
    })
    totalSaleAmount = r2(rec.fund_results.reduce((s, f) => s + f.sell_amount, 0))
    stCapitalGains = r2(rec.fund_results.reduce((s, f) => s + Math.max(0, f.est_st_gain_loss), 0))
    ltCapitalGains = r2(rec.fund_results.reduce((s, f) => s + Math.max(0, f.est_lt_gain_loss), 0))
    lossesHarvested = r2(rec.fund_results.reduce((s, f) => s + Math.min(0, f.est_st_gain_loss) + Math.min(0, f.est_lt_gain_loss), 0))
    estNetTax = r2(rec.est_net_tax)
    effectiveRate = totalSaleAmount > 0 ? r2((estNetTax / totalSaleAmount) * 100) : 0
    optMode = rec.optimization_priority ?? optimizationPriority
    accountingMethod = (rec.fund_results[0]?.accounting_method as AccountingMethod) ?? 'MinTax'
  } else {
    return null
  }

  const netTaxableGain = r2(stCapitalGains + ltCapitalGains + lossesHarvested)
  const federalTax = estNetTax
  const grossProceeds = totalSaleAmount
  const estNetProceeds = r2(grossProceeds - estNetTax)

  return {
    accountName: acct?.account_type === 'taxable_brokerage' ? 'Taxable Brokerage' : acct?.account_type ?? 'Taxable Brokerage',
    accountMasked: acct?.masked_number ?? '...4782',
    totalSaleAmount,
    funds,
    stCapitalGains,
    ltCapitalGains,
    lossesHarvested,
    netTaxableGain,
    federalTax,
    estNetTax,
    effectiveRate,
    grossProceeds,
    estFederalTax: estNetTax,
    estNetProceeds,
    optimizationMode: optMode,
    accountingMethod,
  }
}

// ---------------------------------------------------------------------------
// Divider
// ---------------------------------------------------------------------------
function Divider() {
  return <div className="bg-[#e8e9e9] h-px relative shrink-0 w-full" />
}

// ---------------------------------------------------------------------------
// Tax/proceeds row
// ---------------------------------------------------------------------------
function TaxRow({ label, value, labelBold, valueBold, valueLg, muted, valueColor }: {
  label: string
  value: string
  labelBold?: boolean
  valueBold?: boolean
  valueLg?: boolean
  muted?: boolean
  valueColor?: string
}) {
  return (
    <div className="flex h-[26px] items-center justify-between w-full">
      <span className={`text-[13px] ${labelBold ? 'font-semibold' : 'font-normal'} ${muted ? 'text-[#717777]' : 'text-[#040505]'} whitespace-nowrap`}>
        {label}
      </span>
      <span
        className={`${valueLg ? 'text-[14px]' : 'text-[13px]'} ${valueBold ? 'font-bold' : 'font-normal'} ${muted ? 'text-[#717777]' : ''} whitespace-nowrap text-right`}
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function OrderConfirmation() {
  const navigate = useNavigate()
  const {
    portfolio,
    recommendation,
    scenarios,
    activeAccountId,
    optimizationPriority,
    mode,
  } = useAppStore()

  // Resolve the best available data: first scenario, then recommendation
  const scenario = scenarios.length > 0 ? scenarios[0] : null
  const rec = recommendation as Recommendation | null

  const data = buildConfirmData(scenario, rec, portfolio, activeAccountId, optimizationPriority)

  // If no data available, nothing to confirm — redirect back
  if (!data) {
    return (
      <div className="flex flex-col items-start w-full px-8 py-10">
        <p className="text-[16px] text-vg-ink-muted italic">No order to confirm. Return to Fund Selection to build a scenario.</p>
        <button onClick={() => navigate('/')} className="mt-4 h-[48px] px-7 rounded-full border-[1.5px] border-vg-ink text-[14px] font-bold text-vg-ink">
          Return to Fund Selection
        </button>
      </div>
    )
  }

  function handleSubmit() {
    const record: TransactionRecord = {
      transaction_id: `txn-${Date.now()}`,
      committed_timestamp: new Date().toISOString(),
      target_sale_amount: data!.totalSaleAmount,
      actual_sale_proceeds: data!.estNetProceeds,
      funds_sold: data!.funds.map((f): TransactionFundRecord => ({
        fund_id: f.id,
        sell_amount: f.sellAmount,
        accounting_method: data!.accountingMethod,
        lots_sold: [],
      })),
      realized_st_gains: data!.stCapitalGains,
      realized_lt_gains: data!.ltCapitalGains,
      est_tax_at_active_rate: data!.estNetTax,
      cumulative_ytd_st_gains: r2((portfolio.ytd_gains_record?.st_gains_realized_ytd ?? 0) + data!.stCapitalGains),
      cumulative_ytd_lt_gains: r2((portfolio.ytd_gains_record?.lt_gains_realized_ytd ?? 0) + data!.ltCapitalGains),
      optimization_mode: data!.optimizationMode,
      accounting_method: data!.accountingMethod,
      resulting_portfolio_state_version: 1,
    }
    appendTransaction(portfolio, record)
    navigate('/summary')
  }

  function handleCancel() {
    if (scenarios.length > 0) {
      navigate('/scenarios')
    } else if (mode === 'manual') {
      navigate('/manual-2')
    } else {
      navigate('/automated')
    }
  }

  const taxYear = new Date().getFullYear()

  return (
    <div className="flex flex-col items-start w-full">
      <div className="flex flex-col w-full">

        {/* Page title */}
        <div className="bg-white flex items-center px-[32px] h-[56px] w-full">
          <h1 className="text-[30px] font-bold text-vg-ink whitespace-nowrap leading-normal">Review order</h1>
        </div>

        {/* Card wrapper */}
        <div className="flex flex-col items-start overflow-clip px-[32px] py-[24px] w-full">
          <div className="bg-white border border-[#e8e9e9] flex flex-col items-start rounded-[8px] w-full overflow-clip">

            {/* Section 1 — Transaction Summary */}
            <div className="bg-[#f8f8f8] border border-[#e8e9e9] flex items-center justify-between p-[16px] w-full">
              <div className="flex flex-col gap-[4px] items-start">
                <span className="text-[10px] font-semibold text-[#717777] uppercase tracking-wide">ORDER SUMMARY</span>
                <span className="text-[15px] font-bold text-[#040505]">{data.accountName} {data.accountMasked}</span>
              </div>
              <div className="flex flex-col gap-[4px] items-end text-right">
                <span className="text-[10px] font-semibold text-[#717777] uppercase tracking-wide">TOTAL SALE AMOUNT</span>
                <span className="text-[20px] font-bold text-[#040505]">{formatCurrency(data.totalSaleAmount)}</span>
              </div>
            </div>

            {/* Section 2 — Funds to be sold */}
            <div className="border border-[#e8e9e9] flex flex-col items-start p-[16px] w-full">
              <span className="text-[12px] font-semibold text-[#040505]">Funds to be sold</span>
              <div className="h-[8px]" />

              {/* Column headers */}
              <div className="flex items-start border-b border-[#e8e9e9] pb-[6px] w-full">
                <div className="flex flex-1 min-w-0">
                  <span className="text-[10px] font-semibold text-[#717777] uppercase">Fund</span>
                </div>
                <div className="w-[202px] flex justify-end">
                  <span className="text-[10px] font-semibold text-[#717777] uppercase">Method</span>
                </div>
                <div className="w-[269px] flex justify-end">
                  <span className="text-[10px] font-semibold text-[#717777] uppercase">Sell amount</span>
                </div>
                <div className="w-[202px] flex justify-end">
                  <span className="text-[10px] font-semibold text-[#717777] uppercase">Est. gain/loss</span>
                </div>
                <div className="w-[244px] flex justify-end">
                  <span className="text-[10px] font-semibold text-[#717777] uppercase">Est. tax</span>
                </div>
              </div>

              {/* Fund rows */}
              {data.funds.map((f, i) => {
                const gainLossColor = f.gainLoss > 0 ? '#c8102e' : f.gainLoss < 0 ? '#007a00' : '#717777'
                const taxColor = f.estTaxGross > 0 ? '#040505' : '#717777'
                return (
                  <div key={f.id} className={`flex h-[40px] items-start w-full border-b ${i < data.funds.length - 1 ? 'border-[#f0f0f0]' : 'border-[#f0f0f0]'}`}>
                    <div className="flex flex-1 min-w-0 flex-col gap-[2px] h-[40px] justify-center overflow-hidden">
                      <span className="text-[13px] font-bold text-[#1255cc] underline">{f.id}</span>
                      <span className="text-[10px] text-[#717777] truncate">{f.name}</span>
                    </div>
                    <div className="w-[202px] h-[40px] flex items-center justify-end">
                      <span className="text-[12px] font-normal text-[#717777]">{f.method}</span>
                    </div>
                    <div className="w-[269px] h-[40px] flex items-center justify-end">
                      <span className="text-[13px] font-bold text-[#040505]">{formatCurrency(f.sellAmount)}</span>
                    </div>
                    <div className="w-[202px] h-[40px] flex items-center justify-end">
                      <span className="text-[12px] font-bold whitespace-nowrap" style={{ color: gainLossColor }}>
                        {f.gainLoss !== 0
                          ? fmtGainLoss(f.gainLoss, f.gainLossPeriod)
                          : <span className="text-[#717777] font-normal">$0.00</span>
                        }
                      </span>
                    </div>
                    <div className="w-[244px] h-[40px] flex items-center justify-end">
                      <span className="text-[12px] whitespace-nowrap" style={{ color: taxColor, fontWeight: f.estTaxGross > 0 ? 700 : 400 }}>
                        {formatCurrency(f.estTaxGross)}
                      </span>
                    </div>
                  </div>
                )
              })}

              {/* Totals row */}
              <div className="flex h-[36px] items-start bg-[#f8f8f7] px-[8px] w-full">
                <div className="flex flex-1 min-w-0 h-[36px] items-center">
                  <span className="text-[12px] font-semibold text-[#040505]">Total</span>
                </div>
                <div className="w-[202px] h-[36px]" />
                <div className="w-[269px] h-[36px] flex items-center justify-end">
                  <span className="text-[13px] font-bold text-[#040505]">{formatCurrency(data.totalSaleAmount)}</span>
                </div>
                <div className="w-[202px] h-[36px]" />
                <div className="w-[236px] h-[36px]" />
              </div>
            </div>

            {/* Section 3 — Tax Impact */}
            <div className="border border-[#e8e9e9] flex gap-[24px] items-start p-[16px] w-full">
              {/* Tax breakdown (flex-1) */}
              <div className="flex flex-1 flex-col items-start min-w-0">
                <span className="text-[12px] font-semibold text-[#040505]">Estimated tax impact</span>
                <div className="h-[8px]" />
                <TaxRow label="ST Capital Gains" value={data.stCapitalGains !== 0 ? fmtGainLoss(data.stCapitalGains, '') : '$0.00'} valueBold valueColor={data.stCapitalGains > 0 ? '#c8102e' : data.stCapitalGains < 0 ? '#007a00' : '#717777'} />
                <TaxRow label="LT Capital Gains" value={data.ltCapitalGains !== 0 ? fmtGainLoss(data.ltCapitalGains, '') : '$0.00'} muted={data.ltCapitalGains === 0} valueColor={data.ltCapitalGains > 0 ? '#c8102e' : data.ltCapitalGains < 0 ? '#007a00' : undefined} />
                <TaxRow label="Losses Harvested" value={data.lossesHarvested !== 0 ? fmtGainLoss(data.lossesHarvested, '') : '$0.00'} valueBold={data.lossesHarvested !== 0} valueColor={data.lossesHarvested < 0 ? '#007a00' : data.lossesHarvested > 0 ? '#c8102e' : '#717777'} />
                <Divider />
                <TaxRow label="Net Taxable Gain" value={formatCurrency(data.netTaxableGain)} valueBold />
                <TaxRow label="Federal Tax (estimated)" value={formatCurrency(data.federalTax)} />
                <Divider />
                <TaxRow label="EST. NET TAX" value={formatCurrency(data.estNetTax)} labelBold valueBold valueLg />
                <TaxRow label="Effective rate" value={fmtRate2(data.effectiveRate)} muted />
              </div>

              {/* Estimated proceeds (220px) */}
              <div className="flex flex-col items-start w-[220px]">
                <span className="text-[12px] font-semibold text-[#040505]">Estimated proceeds</span>
                <div className="h-[8px]" />
                <TaxRow label="Gross proceeds" value={formatCurrency(data.grossProceeds)} />
                <TaxRow label="Est. federal tax" value={data.estFederalTax > 0 ? '−' + formatCurrency(data.estFederalTax) : formatCurrency(0)} valueColor={data.estFederalTax > 0 ? '#c8102e' : undefined} muted={data.estFederalTax === 0} />
                <Divider />
                <TaxRow label="Est. net proceeds" value={formatCurrency(data.estNetProceeds)} labelBold valueBold valueLg />
              </div>
            </div>

            {/* Section 4 — Settlement Details */}
            <div className="border border-[#e8e9e9] flex gap-[24px] items-start p-[16px] w-full">
              <div className="flex flex-1 flex-col gap-[4px] items-start min-w-0">
                <span className="text-[10px] font-semibold text-[#717777] uppercase">DESTINATION</span>
                <span className="text-[13px] font-normal text-[#040505]">Settlement fund</span>
                <span className="text-[13px] font-bold text-[#040505]">Brokerage {data.accountMasked}</span>
              </div>
              <div className="flex flex-1 flex-col gap-[4px] items-start min-w-0">
                <span className="text-[10px] font-semibold text-[#717777] uppercase">ESTIMATED SETTLEMENT</span>
                <span className="text-[13px] font-bold text-[#040505]">1–2 business days</span>
                <span className="text-[11px] text-[#717777]">Proceeds available in your settlement fund</span>
              </div>
              <div className="flex flex-1 flex-col gap-[4px] items-start min-w-0">
                <span className="text-[10px] font-semibold text-[#717777] uppercase">TAX YEAR</span>
                <span className="text-[13px] font-bold text-[#040505]">{taxYear}</span>
                <span className="text-[11px] text-[#717777]">Gains will be reported on your {taxYear} tax return</span>
              </div>
            </div>

            {/* Section 5 — Advisory Notice */}
            <div className="bg-[#f8f8f7] border border-[#e8e9e9] flex gap-[12px] items-start p-[16px] w-full text-[#717777]">
              <span className="text-[16px] shrink-0">ⓘ</span>
              <div className="flex flex-1 flex-col gap-[4px] items-start text-[12px]">
                <p>All tax figures above are estimates based on federal rates only. State taxes are not included.</p>
                <p>For complex tax situations, a tax professional can help you evaluate these figures before executing.</p>
              </div>
            </div>

            {/* Section 6 — Actions */}
            <div className="flex items-center justify-between p-[16px] w-full">
              <button
                onClick={handleCancel}
                className="h-[48px] w-[160px] rounded-full border-[1.5px] border-vg-ink bg-white text-[14px] font-bold text-vg-ink hover:opacity-90 transition-opacity"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="h-[48px] w-[200px] rounded-full bg-vg-ink text-white text-[14px] font-bold hover:opacity-90 transition-opacity"
              >
                Submit order
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
