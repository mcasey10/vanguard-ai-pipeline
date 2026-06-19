import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, PenLine, ChevronDown, ChevronUp } from 'lucide-react'

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

type FundRow = {
  ticker: string
  fullName: string
  shares: string
  balance: string
  assetClass: string
}

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
      {/* Reserved column widths — empty in inactive state per Figma 374:1746 */}
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
            text-[14px] font-bold text-vg-ink shrink-0
            hover:opacity-90 active:opacity-80 transition-opacity"
        >
          Sell
        </button>
      </div>
    </div>
  )
}

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

const TAXABLE_FUNDS: FundRow[] = [
  { ticker: 'VTSAX', fullName: 'Vanguard Total Stock Market Index Fund', shares: '1,597', balance: '$231,884.40', assetClass: 'Domestic Equity' },
  { ticker: 'VBTLX', fullName: 'Vanguard Total Bond Market Index Fund',  shares: '5,600', balance: '$51,408.00',  assetClass: 'Domestic Bonds' },
  { ticker: 'VTIAX', fullName: 'Vanguard Total Intl Stock Index Fund',   shares: '3,600', balance: '$139,500.00', assetClass: 'International Equity' },
  { ticker: 'VBIRX', fullName: 'Vanguard Short-Term Bond Index Fund',    shares: '8,100', balance: '$84,402.00',  assetClass: 'Short-Term Reserves' },
]

const IRA_FUNDS: FundRow[] = [
  { ticker: 'VBTLX', fullName: 'Vanguard Total Bond Market Index Fund',         shares: '12,000', balance: '$110,160.00', assetClass: 'Domestic Bonds' },
  { ticker: 'VFITX', fullName: 'Vanguard Intermediate-Term Treasury Index Fund', shares: '9,300',  balance: '$100,905.00', assetClass: 'Domestic Bonds' },
]

const ROTH_FUNDS: FundRow[] = [
  { ticker: 'VFIAX', fullName: 'Vanguard 500 Index Fund Admiral Shares', shares: '240', balance: '$131,592.00', assetClass: 'Domestic Equity' },
]

export default function FundSelectionManual() {
  const navigate = useNavigate()

  // hintsVisible: Show Tips / Hide Tips toggle for hint indicators.
  // No coach marks implemented on FS-MAN-1 — both Allocation and Harvestable Loss
  // marks were confirmed to belong on FS-MAN-2 (indicators don't render on inactive rows).
  // Toggle is present per Figma (Controls/Show Tips [FS-MAN-1] node 716:2888) and
  // will gain function when coach marks are added in FS-MAN-2.
  const [hintsVisible, setHintsVisible] = useState(true)

  // expandedAccounts: tracks which inactive account sections are open
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set())

  function toggleAccount(id: string) {
    setExpandedAccounts(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const iraExpanded  = expandedAccounts.has('ira')
  const rothExpanded = expandedAccounts.has('roth')

  return (
    <>
      {/* Show Tips / Hide Tips — toggles hint indicator visibility.
          Figma: Controls/Show Tips [FS-MAN-1] (716:2888), x=978 y=20 */}
      <button
        onClick={() => setHintsVisible(v => !v)}
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

          {/* Summary Banner — all dashes (no amounts entered in FS-MAN-1)
              relative wrapper reserved for FS-MAN-2 coach mark anchors */}
          <div className="flex items-center px-8 w-full relative">
            <div className="flex flex-1 items-start bg-[#e8f5f0] px-6 py-4">

              <div className="flex flex-col gap-1 flex-1 min-w-0 overflow-hidden px-3">
                <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">SALE TOTAL</span>
                <span className="text-[20px] font-bold text-vg-ink whitespace-nowrap">—</span>
                <span className="text-[12px] text-vg-ink-muted whitespace-nowrap">0.0% of portfolio</span>
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
                <span className="text-[16px] font-bold text-vg-ink whitespace-nowrap">—</span>
              </div>
              <div className="self-stretch w-px bg-[#c8d8d4] shrink-0" />

              <div className="flex flex-col gap-1 flex-1 min-w-0 overflow-hidden px-3">
                <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">EST. LT GAINS</span>
                <span className="text-[16px] font-bold text-vg-ink whitespace-nowrap">—</span>
              </div>
              <div className="self-stretch w-px bg-[#c8d8d4] shrink-0" />

              <div className="flex flex-col gap-1 flex-1 min-w-0 overflow-hidden px-3">
                <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">EST. NET TAX</span>
                <span className="text-[16px] font-bold text-vg-ink whitespace-nowrap">—</span>
                <span className="text-[12px] text-vg-ink-muted whitespace-nowrap">0.00% effective rate</span>
              </div>
              <div className="self-stretch w-px bg-[#c8d8d4] shrink-0" />

              <div className="flex flex-col gap-0.5 flex-1 min-w-0 overflow-hidden px-3">
                <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">IMPACT</span>
                <div className="flex gap-1.5 items-center">
                  <span className="text-[12px] text-vg-ink">Equity</span>
                  <span className="text-[12px] text-vg-ink">—</span>
                </div>
                <div className="flex gap-1.5 items-center">
                  <span className="text-[12px] text-vg-ink">Bonds</span>
                  <span className="text-[12px] text-vg-ink">—</span>
                </div>
                <a className="text-[10px] text-[#1255cc] underline cursor-pointer whitespace-nowrap">
                  Target allocation
                </a>
              </div>

            </div>
          </div>

          {/* Fund Table */}
          <div className="flex flex-col items-start px-8 w-full">
            <div className="flex flex-col items-start w-full border border-[#e8e9e9]">

              {/* Taxable Brokerage — active account, always expanded */}
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

              {/* Fund rows — all inactive in FS-MAN-1 (no amounts entered) */}
              {TAXABLE_FUNDS.map(fund => (
                <InactiveFundRow
                  key={fund.ticker}
                  fund={fund}
                  onSell={() => {
                    // TODO: activating a row transitions to FS-MAN-2 state.
                    // Navigate to /manual/active once FS-MAN-2 is built.
                  }}
                />
              ))}

              {/* Traditional IRA — inactive, collapsed, expandable (REQ-B1-001) */}
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
                <span className="text-[12px] text-vg-ink-muted whitespace-nowrap">
                  22% Equity / 78% Bonds / 0% Other
                </span>
                <div className="w-4 shrink-0" />
                <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">$211,065.00</span>
                <div className="w-4 shrink-0" />
                {iraExpanded
                  ? <ChevronUp size={24} className="text-vg-ink shrink-0" />
                  : <ChevronDown size={24} className="text-vg-ink shrink-0" />
                }
              </div>

              {/* Traditional IRA expanded — read-only fund data, no interactive controls */}
              {iraExpanded && IRA_FUNDS.map(fund => (
                <ReadOnlyFundRow key={fund.ticker + '-ira'} fund={fund} />
              ))}

              {/* Roth IRA — inactive, collapsed, expandable (REQ-B1-001) */}
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
                {rothExpanded
                  ? <ChevronUp size={24} className="text-vg-ink shrink-0" />
                  : <ChevronDown size={24} className="text-vg-ink shrink-0" />
                }
              </div>

              {/* Roth IRA expanded — read-only fund data, no interactive controls */}
              {rothExpanded && ROTH_FUNDS.map(fund => (
                <ReadOnlyFundRow key={fund.ticker + '-roth'} fund={fund} />
              ))}

            </div>
          </div>

          {/* Footer — no buttons in FS-MAN-1 state.
              All three footer buttons (Review order, Go to Scenario Analysis,
              Return to system recommendation) are hidden per Figma 250:611.
              Buttons appear once sell amounts are entered (FS-MAN-2). */}

        </div>
      </div>
    </>
  )
}
