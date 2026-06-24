import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, PenLine } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { formatCurrency } from '../utils/format'

export default function FundSelectionEntry() {
  const navigate = useNavigate()
  const { mode: storeMode, setTargetSaleAmount, setMode } = useAppStore()

  const [rawAmount, setRawAmount] = useState('')
  const [mode, setLocalMode] = useState<'automated' | 'manual'>(storeMode)

  function formatDollar(value: string): string {
    const digits = value.replace(/\D/g, '')
    if (!digits) return ''
    return formatCurrency(parseInt(digits, 10) / 100)
  }

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '')
    setRawAmount(digits)
  }

  function handleModeChange(m: 'automated' | 'manual') {
    setLocalMode(m)
  }

  function handleSubmit() {
    const dollars = parseInt(rawAmount, 10) / 100
    setTargetSaleAmount(dollars)
    setMode(mode)
    navigate(mode === 'automated' ? '/automated' : '/manual')
  }

  const displayAmount = rawAmount ? formatDollar(rawAmount) : ''
  const hasAmount = rawAmount.length > 0 && parseInt(rawAmount, 10) > 0

  return (
    <div className="flex flex-col items-start w-full">
      <div className="flex flex-col gap-6 py-10 w-full bg-white">

        {/* Row 1 — Page title + mode toggle */}
        <div className="flex items-center justify-between px-8 h-14">
          <h1 className="text-[30px] font-bold text-vg-ink whitespace-nowrap leading-normal">
            Sell &amp; Rebalance
          </h1>
          <div className="flex items-center border-[1.5px] border-vg-ink rounded-full p-[2px] bg-white h-[37px]">
            <button
              onClick={() => handleModeChange('automated')}
              className={`self-stretch flex items-center gap-1.5 px-4 rounded-full text-[14px] font-bold transition-colors ${
                mode === 'automated' ? 'bg-vg-teal text-white' : 'bg-transparent text-vg-ink'
              }`}
            >
              <Sparkles size={16} className={mode === 'automated' ? 'text-white' : 'text-vg-ink'} />
              Automated
            </button>
            <button
              onClick={() => handleModeChange('manual')}
              className={`self-stretch flex items-center gap-1.5 px-4 rounded-[4px] text-[14px] font-bold transition-colors ${
                mode === 'manual' ? 'bg-vg-teal text-white' : 'bg-transparent text-vg-ink'
              }`}
            >
              <PenLine size={16} className={mode === 'manual' ? 'text-white' : 'text-vg-ink'} />
              Manual
            </button>
          </div>
        </div>

        {/* Row 2 — Amount input + CTA */}
        <div className="flex items-end gap-3 px-8">
          <div className="flex flex-col gap-2">
            <label htmlFor="sale-amount" className="text-[12px] text-vg-ink leading-normal whitespace-nowrap">
              How much would you like to sell?
            </label>
            <input
              id="sale-amount"
              type="text"
              inputMode="numeric"
              value={displayAmount}
              onChange={handleAmountChange}
              onKeyDown={e => e.key === 'Enter' && hasAmount && handleSubmit()}
              placeholder="$0.00"
              className="w-[200px] h-[48px] px-3 border border-vg-ink rounded-[4px]
                text-[14px] text-vg-ink text-right placeholder:text-vg-ink-muted
                bg-white focus:outline-none focus:ring-2 focus:ring-vg-ink/20"
            />
          </div>
          <button
            disabled={!hasAmount}
            onClick={handleSubmit}
            className="h-[48px] px-7 rounded-full bg-vg-ink text-white text-[14px] font-bold
              whitespace-nowrap transition-opacity
              disabled:opacity-40 disabled:cursor-not-allowed
              hover:opacity-90 active:opacity-80"
          >
            Get recommendation
          </button>
        </div>

        {/* Explanation text */}
        <div className="px-8">
          <p className="text-[14px] text-vg-ink-muted leading-normal max-w-[1111px]">
            Enter the amount you&apos;d like to raise from your portfolio. We&apos;ll generate a
            fund sell recommendation that minimizes your tax impact while keeping your portfolio on
            target.
          </p>
        </div>
      </div>
    </div>
  )
}
