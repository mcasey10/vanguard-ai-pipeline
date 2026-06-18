import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, PenLine } from 'lucide-react'

type Mode = 'automated' | 'manual'

export default function FundSelectionEntry() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('automated')
  const [rawAmount, setRawAmount] = useState('')

  // Format a numeric string as a dollar display value
  function formatDollar(value: string): string {
    const digits = value.replace(/\D/g, '')
    if (!digits) return ''
    const cents = parseInt(digits, 10)
    return (cents / 100).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '')
    setRawAmount(digits)
  }

  const displayAmount = rawAmount ? '$' + formatDollar(rawAmount) : ''
  const hasAmount = rawAmount.length > 0 && parseInt(rawAmount, 10) > 0

  return (
    <div className="flex flex-col items-start w-full">
      {/* Content area — matches Figma Content frame (py-10 = 40px) */}
      <div className="flex flex-col gap-6 py-10 w-full bg-white">

        {/* Row 1 — Page title + mode toggle (Figma: Heading/Page Title with Toggle) */}
        <div className="flex items-center justify-between px-8 h-14">
          <h1 className="text-[30px] font-bold text-vg-ink whitespace-nowrap leading-normal">
            Sell &amp; Rebalance
          </h1>

          {/* Automated / Manual pill toggle
              Figma: Controls/Mode Toggle
              Border 1.5px solid #040505, 100px radius, 36px height
              Active pill: #00bda3 bg, white bold text
              Inactive: transparent, #040505 bold text */}
          <div className="flex items-center border-[1.5px] border-vg-ink rounded-full p-[2px] bg-white">
            <button
              onClick={() => setMode('automated')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[14px] font-bold transition-colors ${
                mode === 'automated'
                  ? 'bg-vg-teal text-white'
                  : 'bg-transparent text-vg-ink'
              }`}
            >
              <Sparkles size={16} className={mode === 'automated' ? 'text-white' : 'text-vg-ink'} />
              Automated
            </button>
            <button
              onClick={() => setMode('manual')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-[4px] text-[14px] font-bold transition-colors ${
                mode === 'manual'
                  ? 'bg-vg-teal text-white'
                  : 'bg-transparent text-vg-ink'
              }`}
            >
              <PenLine size={16} className={mode === 'manual' ? 'text-white' : 'text-vg-ink'} />
              Manual
            </button>
          </div>
        </div>

        {/* Row 2 — Amount input + CTA (Figma: Row 2 — Amount Input)
            Input group: 200px wide, 48px tall
            Button: black pill, 201px wide, 48px tall */}
        <div className="flex items-end gap-3 px-8">
          {/* Input group */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="sale-amount"
              className="text-[12px] text-vg-ink leading-normal whitespace-nowrap"
            >
              How much would you like to sell?
            </label>
            <input
              id="sale-amount"
              type="text"
              inputMode="numeric"
              value={displayAmount}
              onChange={handleAmountChange}
              placeholder="$0.00"
              className="w-[200px] h-[48px] px-3 border border-vg-ink rounded-[4px]
                text-[14px] text-vg-ink text-right placeholder:text-vg-ink-muted
                bg-white focus:outline-none focus:ring-2 focus:ring-vg-ink/20"
            />
          </div>

          {/* Primary CTA button — black pill, "Get recommendation" */}
          <button
            disabled={!hasAmount}
            onClick={() => navigate('/automated', { state: { amount: parseInt(rawAmount, 10) } })}
            className="h-[48px] px-7 rounded-full bg-vg-ink text-white text-[14px] font-bold
              whitespace-nowrap transition-opacity
              disabled:opacity-40 disabled:cursor-not-allowed
              hover:opacity-90 active:opacity-80"
          >
            Get recommendation
          </button>
        </div>

        {/* Explanation text (Figma: Explanation Wrap) */}
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
