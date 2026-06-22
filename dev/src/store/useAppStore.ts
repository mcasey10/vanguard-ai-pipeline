/**
 * Zustand store — application-wide state for the Vanguard Sell & Rebalance tool.
 *
 * State slices:
 *   - portfolio          Portfolio loaded from canonical data / localStorage
 *   - Sale session       targetSaleAmount, activeAccountId, mode, optimizationPriority
 *   - Engine outputs     recommendation, manualConfig (null until engine built)
 *   - Scenarios          up to 3 SavedScenario
 *   - Tax rates          activeTaxRates (default 24% ST / 15% LT)
 */

import { create } from 'zustand'
import type {
  Portfolio,
  Recommendation,
  ManualConfiguration,
  SavedScenario,
  TaxAssumptionSet,
} from '../types'
import { loadPortfolio, savePortfolioState } from '../data/loader'

// ---------------------------------------------------------------------------
// Store shape
// ---------------------------------------------------------------------------

interface AppState {
  // ── Portfolio data ────────────────────────────────────────────────────────
  portfolio: Portfolio

  // ── Sale session ──────────────────────────────────────────────────────────
  targetSaleAmount: number | null
  activeAccountId: string
  mode: 'automated' | 'manual'
  optimizationPriority: 'tax-first' | 'balance-first'

  // ── Engine outputs (null until optimization engine is built — REQ-OE-001) ─
  recommendation: Recommendation | null
  manualConfig: ManualConfiguration | null

  // ── Scenarios (max 3, REQ-SC-001) ─────────────────────────────────────────
  scenarios: SavedScenario[]

  // ── Tax rate assumptions (user-adjustable per REQ-G-010) ─────────────────
  activeTaxRates: Pick<TaxAssumptionSet, 'st_rate' | 'lt_rate'>
}

interface AppActions {
  // Portfolio
  setPortfolio: (portfolio: Portfolio) => void
  persistPortfolio: () => void

  // Sale session
  setTargetSaleAmount: (amount: number | null) => void
  setActiveAccountId: (id: string) => void
  setMode: (mode: 'automated' | 'manual') => void
  setOptimizationPriority: (priority: 'tax-first' | 'balance-first') => void

  // Engine outputs
  setRecommendation: (rec: Recommendation | null) => void
  setManualConfig: (config: ManualConfiguration | null) => void

  // Scenarios
  addScenario: (scenario: SavedScenario) => void
  updateScenario: (id: string, scenario: SavedScenario) => void
  deleteScenario: (id: string) => void

  // Tax rates
  setActiveTaxRates: (rates: Pick<TaxAssumptionSet, 'st_rate' | 'lt_rate'>) => void

  // Session reset — clears all sale session state, keeps portfolio
  resetSession: () => void
}

type AppStore = AppState & AppActions

// ---------------------------------------------------------------------------
// Default values
// ---------------------------------------------------------------------------

const DEFAULT_TAX_RATES: Pick<TaxAssumptionSet, 'st_rate' | 'lt_rate'> = {
  st_rate: 0.24,
  lt_rate: 0.15,
}

const DEFAULT_ACTIVE_ACCOUNT = 'ACCT-TAXABLE-001'

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useAppStore = create<AppStore>((set, get) => ({
  // ── Initial state ──────────────────────────────────────────────────────────
  portfolio: loadPortfolio(),

  targetSaleAmount: null,
  activeAccountId: DEFAULT_ACTIVE_ACCOUNT,
  mode: 'automated',
  optimizationPriority: 'tax-first',

  recommendation: null,
  manualConfig: null,

  scenarios: [],

  activeTaxRates: { ...DEFAULT_TAX_RATES },

  // ── Actions ────────────────────────────────────────────────────────────────

  setPortfolio: (portfolio) => set({ portfolio }),

  persistPortfolio: () => {
    savePortfolioState(get().portfolio)
  },

  setTargetSaleAmount: (amount) => set({ targetSaleAmount: amount }),

  setActiveAccountId: (id) => set({ activeAccountId: id }),

  setMode: (mode) => set({ mode }),

  setOptimizationPriority: (priority) => set({ optimizationPriority: priority }),

  setRecommendation: (rec) => set({ recommendation: rec }),

  setManualConfig: (config) => set({ manualConfig: config }),

  addScenario: (scenario) =>
    set((state) => {
      if (state.scenarios.length >= 3) {
        console.warn('[store] Cannot add scenario: maximum of 3 already saved (REQ-SC-001)')
        return state
      }
      return { scenarios: [...state.scenarios, scenario] }
    }),

  updateScenario: (id, scenario) =>
    set((state) => ({
      scenarios: state.scenarios.map((s) => (s.scenario_id === id ? scenario : s)),
    })),

  deleteScenario: (id) =>
    set((state) => ({
      scenarios: state.scenarios.filter((s) => s.scenario_id !== id),
    })),

  setActiveTaxRates: (rates) => set({ activeTaxRates: rates }),

  resetSession: () =>
    set({
      targetSaleAmount: null,
      activeAccountId: DEFAULT_ACTIVE_ACCOUNT,
      mode: 'automated',
      optimizationPriority: 'tax-first',
      recommendation: null,
      manualConfig: null,
      // Scenarios are NOT cleared on session reset — they persist across sessions
    }),
}))
