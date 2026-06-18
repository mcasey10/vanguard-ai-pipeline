import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Sparkles, PenLine } from 'lucide-react'

function centsToDollars(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(cents / 100)
}

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

export default function FundSelectionAutomated() {
  const location = useLocation()
  const navigate = useNavigate()

  const initialCents = (location.state as { amount?: number })?.amount ?? 2500000

  const [appliedCents, setAppliedCents] = useState(initialCents)
  const [inputCents, setInputCents] = useState(initialCents)
  const [inputDisplay, setInputDisplay] = useState(centsToDollars(initialCents))

  const canRecalculate = inputCents !== appliedCents && inputCents > 0

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '')
    const cents = parseInt(digits || '0', 10)
    setInputCents(cents)
    setInputDisplay(digits === '' ? '' : centsToDollars(cents))
  }

  function handleRecalculate() {
    if (!canRecalculate) return
    setAppliedCents(inputCents)
  }

  return (
    <div className="flex flex-col items-start w-full">
      <div className="flex flex-col gap-6 py-10 w-full">

        {/* Row 1 — Page title + mode toggle */}
        <div className="flex items-center justify-between px-8 h-14">
          <h1 className="text-[30px] font-bold text-vg-ink whitespace-nowrap leading-normal">
            Sell &amp; Rebalance
          </h1>
          <div className="flex items-center border-[1.5px] border-vg-ink rounded-full p-[2px] bg-white">
            {/* Automated — active */}
            <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-vg-teal">
              <Sparkles size={16} className="text-white" />
              <span className="text-[14px] font-bold text-white">Automated</span>
            </div>
            {/* Manual — inactive */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-[4px] text-[14px] font-bold text-vg-ink"
            >
              <PenLine size={16} className="text-vg-ink" />
              Manual
            </button>
          </div>
        </div>

        {/* Row 2 — Amount input + Recalculate */}
        <div className="flex items-end gap-3 px-8">
          <div className="flex flex-col gap-2">
            <label className="text-[12px] text-vg-ink-muted whitespace-nowrap">
              Total sell amount
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={inputDisplay}
              onChange={handleAmountChange}
              className="w-[200px] h-[48px] px-3 border border-vg-ink rounded-[4px]
                text-[14px] text-vg-ink text-right bg-white focus:outline-none
                focus:ring-2 focus:ring-vg-ink/20"
            />
          </div>
          <button
            onClick={handleRecalculate}
            disabled={!canRecalculate}
            className="h-[48px] px-7 rounded-full border-[1.5px] border-vg-ink
              text-[14px] font-bold text-vg-ink bg-white
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Recalculate
          </button>
        </div>

        {/* Summary Banner */}
        <div className="flex items-center px-8 w-full">
          <div className="flex flex-1 items-start bg-[#e8f5f0] px-6 py-4">

            <div className="flex flex-col gap-1 flex-1 min-w-0 overflow-hidden px-3">
              <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">SALE TOTAL</span>
              <span className="text-[20px] font-bold text-vg-ink whitespace-nowrap">$25,000</span>
              <span className="text-[12px] text-vg-ink-muted whitespace-nowrap">1.5% of portfolio</span>
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

            <div className="flex flex-col gap-1 flex-1 min-w-0 overflow-hidden px-3">
              <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">EST. NET TAX</span>
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
        </div>

        {/* Fund Table */}
        <div className="flex flex-col items-start px-8 w-full">
          <div className="flex flex-col items-start w-full border border-[#e8e9e9]">

            {/* Account: Taxable Brokerage (selected) */}
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
            </div>

            {/* Column header row — only FUND + POSITION per Figma (265:654) */}
            <div className="flex h-9 items-center px-3 bg-[#f8f8f8] border border-[#e0e0e0] w-full shrink-0">
              <div className="w-[280px] px-2 flex items-center h-full shrink-0">
                <span className="text-[12px] font-semibold text-vg-ink">FUND</span>
              </div>
              <div className="w-[140px] px-2 flex items-center h-full shrink-0">
                <span className="text-[12px] font-semibold text-vg-ink">POSITION</span>
              </div>
              <div className="flex-1" />
            </div>

            {/* VTSAX row */}
            <div className="flex flex-col border-b border-[#e8e9e9] w-full bg-white">
              <div className="flex h-16 items-center overflow-hidden px-3 w-full">
                <div className="w-[280px] h-full flex flex-col justify-center gap-[3px] px-2 shrink-0 overflow-hidden">
                  <span className="text-[13px] text-vg-ink-muted truncate">
                    Vanguard Total Stock Market Index Fund
                  </span>
                  <a className="text-[14px] font-bold text-[#1255cc] underline whitespace-nowrap">VTSAX</a>
                </div>
                <div className="w-[140px] h-full flex flex-col justify-center gap-[3px] px-2 shrink-0 overflow-hidden">
                  <span className="text-[11px] text-vg-ink-muted whitespace-nowrap">1,597 shares</span>
                  <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">$231,884.40</span>
                </div>
                <div className="w-[128px] h-full flex flex-col justify-center gap-[3px] px-1 shrink-0 overflow-hidden">
                  <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">SELL AMOUNT</span>
                  <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">$15,000.00</span>
                </div>
                <div className="w-[130px] h-full shrink-0" />
                <div className="w-[160px] h-full flex flex-col justify-center gap-[3px] px-2 shrink-0 overflow-hidden text-vg-ink-muted">
                  <span className="text-[12px] whitespace-nowrap">Cost Basis Method</span>
                  <span className="text-[14px] font-bold whitespace-nowrap">MinTax</span>
                </div>
                <div className="w-[95px] h-full flex flex-col justify-center gap-[3px] px-2 shrink-0 overflow-hidden">
                  <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">EST. ST GAINS</span>
                  <span className="text-[14px] font-bold text-[#007a00] whitespace-nowrap">$1,515.85</span>
                </div>
                <div className="w-[95px] h-full flex flex-col justify-center gap-[3px] px-2 shrink-0 overflow-hidden">
                  <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">EST. LT GAINS</span>
                  <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">$0.00</span>
                </div>
                <div className="w-[85px] h-full flex flex-col justify-center gap-[3px] px-2 shrink-0 overflow-hidden">
                  <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">EST. TAX</span>
                  <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">$363.80</span>
                </div>
                <div className="w-[110px] h-full flex flex-col justify-center gap-[3px] px-2 shrink-0 overflow-hidden">
                  <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">IMPACT</span>
                  <span className="text-[12px] font-semibold text-[#007a00] whitespace-nowrap">-0.8% Equity</span>
                </div>
                <div className="flex-1 h-full" />
              </div>
              <div className="flex h-8 items-center px-4 w-full bg-white">
                <p className="text-[13px] italic text-vg-ink-muted whitespace-nowrap">
                  Largest LT gain pool - overweight domestic equity
                </p>
              </div>
            </div>

            {/* VBTLX row */}
            <div className="flex flex-col border-b border-[#e8e9e9] w-full bg-white">
              <div className="flex h-16 items-center overflow-hidden px-3 w-full">
                <div className="w-[280px] h-full flex flex-col justify-center gap-[3px] px-2 shrink-0 overflow-hidden">
                  <span className="text-[12px] text-vg-ink-muted truncate">
                    Vanguard Total Bond Market Index Fund
                  </span>
                  <a className="text-[14px] font-bold text-[#1255cc] underline whitespace-nowrap">VBTLX</a>
                </div>
                <div className="w-[140px] h-full flex flex-col justify-center gap-[3px] px-2 shrink-0 overflow-hidden">
                  <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">5,600 shares</span>
                  <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">$51,408.00</span>
                </div>
                <div className="w-[128px] h-full flex flex-col justify-center gap-[3px] px-1 shrink-0 overflow-hidden">
                  <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">SELL AMOUNT</span>
                  <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">$10,000.00</span>
                </div>
                <div className="w-[130px] h-full shrink-0" />
                <div className="w-[160px] h-full flex flex-col justify-center gap-[3px] px-2 shrink-0 overflow-hidden text-vg-ink-muted">
                  <span className="text-[10px] whitespace-nowrap">&nbsp;</span>
                  <span className="text-[14px] font-bold whitespace-nowrap">MinTax</span>
                </div>
                <div className="w-[95px] h-full flex flex-col justify-center gap-[3px] px-2 shrink-0 overflow-hidden">
                  <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">EST. ST GAINS</span>
                  <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">$0.00</span>
                </div>
                <div className="w-[95px] h-full flex flex-col justify-center gap-[3px] px-2 shrink-0 overflow-hidden">
                  <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">EST. LT GAINS</span>
                  <span className="text-[14px] font-bold text-vg-red whitespace-nowrap">-$1,056.65</span>
                </div>
                <div className="w-[85px] h-full flex flex-col justify-center gap-[3px] px-2 shrink-0 overflow-hidden">
                  <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">EST. TAX</span>
                  <span className="text-[14px] font-bold text-vg-ink whitespace-nowrap">$0.00</span>
                </div>
                <div className="w-[110px] h-full flex flex-col justify-center gap-[3px] px-2 shrink-0 overflow-hidden">
                  <span className="text-[10px] text-vg-ink-muted whitespace-nowrap">IMPACT</span>
                  <span className="text-[14px] font-semibold text-vg-ink whitespace-nowrap">-0.4% Bonds</span>
                </div>
                <div className="flex-1 h-full" />
              </div>
              <div className="flex h-8 items-center px-4 w-full bg-white">
                <p className="text-[13px] italic text-vg-ink-muted whitespace-nowrap">
                  Harvests bond losses — reduces equity overweight
                </p>
              </div>
            </div>

            {/* Account: Traditional IRA (unselected) */}
            <div className="flex h-16 items-center px-4 bg-[#f8f8f8] border-b border-[#e8e9e9] w-full">
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
            </div>

            {/* Account: Roth IRA (unselected) */}
            <div className="flex h-16 items-center px-4 bg-[#f8f8f8] border-b border-[#e8e9e9] w-full">
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
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 items-center justify-end px-8 w-full">
          <button className="h-[48px] px-7 rounded-full bg-vg-ink text-white text-[14px] font-bold whitespace-nowrap">
            Review order
          </button>
          <button className="h-[48px] px-7 rounded-full border-[1.5px] border-vg-ink text-vg-ink bg-white text-[14px] font-bold whitespace-nowrap">
            Go to Scenario Analysis
          </button>
        </div>

      </div>
    </div>
  )
}
