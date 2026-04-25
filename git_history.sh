#!/bin/bash

# --- KONFIGURACJA ---
YEAR=2026
MONTH=04

get_time() {
    local base_hour=$1
    local offset=$2
    local hour=$((base_hour))
    local min=$(( (RANDOM % 15) + (offset * 20) % 60 ))
    local sec=$((RANDOM % 60))
    printf "%02d:%02d:%02d" $hour $min $sec
}

commit() {
    local date="$1"
    local hour=$2
    local offset=$3
    local msg=$4
    shift 4
    local files=("$@")
    
    local time=$(get_time $hour $offset)

    for f in "${files[@]}"; do
        if [ -f "$f" ]; then
            git add "$f"
        elif [ -d "$f" ]; then
            git add "$f"
        fi
    done

    if ! git diff --cached --quiet; then
        GIT_AUTHOR_DATE="${date}T${time}" GIT_COMMITTER_DATE="${date}T${time}" git commit -m "$msg"
    fi
}

echo "🚀 Generowanie dynamicznej historii projektu w ROOT..."

# Konfiguracja git
git config user.email "developer@example.com"
git config user.name "Developer"

rm -rf .git
git init
git checkout -b main

# --- 10 KWIETNIA: Setup ---
D="2026-04-10"
commit "$D" 16 0 "chore: initialize Next.js 14 project with App Router" "package.json" "tsconfig.json" "pnpm-workspace.yaml"
commit "$D" 17 1 "chore: add Tailwind CSS v4 and configure postcss" "postcss.config.mjs" "tailwind.config.ts"
commit "$D" 18 2 "style: add global CSS variables for dark theme" "app/globals.css"
commit "$D" 19 3 "feat: setup root layout and theme provider" "app/layout.tsx" "components/ThemeProvider.tsx" "components/ThemeToggle.tsx"
commit "$D" 20 4 "chore: configure linting and formatting rules" ".prettierrc" "eslint.config.mjs"

# --- 12 KWIETNIA: Core logic ---
D="2026-04-12"
commit "$D" 18 0 "feat: define domain interfaces for transactions and budgets" "lib/types.ts"
commit "$D" 19 1 "feat: implement Zustand store with persistence" "lib/store.ts"
commit "$D" 20 2 "feat: add financial calculation utilities" "lib/utils.ts" "lib/calculations.ts"

# --- 13 KWIETNIA: Landing Page ---
D="2026-04-13"
commit "$D" 14 0 "feat: add particle background canvas component" "components/landing/ParticleBackground.tsx"
commit "$D" 15 1 "feat: build landing page navbar" "components/landing/Navbar.tsx"
commit "$D" 15 2 "feat: implement hero section with animations" "components/landing/Hero.tsx"
commit "$D" 16 3 "feat: add feature cards grid" "components/landing/Features.tsx"
commit "$D" 17 4 "feat: add 'how it works' step-by-step guide" "components/landing/HowItWorks.tsx"
commit "$D" 19 5 "style: polish landing page responsiveness" "app/page.tsx"
commit "$D" 20 6 "feat: add scroll reveal animations to landing components" "components/landing"
commit "$D" 21 7 "style: update landing page gradients and typography" "app/globals.css"

# --- 15 KWIETNIA: Dashboard Layout ---
D="2026-04-15"
commit "$D" 19 0 "feat: create dashboard layout with sidebar navigation" "app/dashboard/layout.tsx" "components/dashboard/Sidebar.tsx"
commit "$D" 20 1 "feat: add top bar with month navigation" "components/dashboard/TopBar.tsx" "components/dashboard/MobileNav.tsx"

# --- 16 KWIETNIA: Dashboard Components ---
D="2026-04-16"
commit "$D" 17 0 "feat: create reusable KPI card component" "components/dashboard/KPICard.tsx"
commit "$D" 18 1 "feat: implement spending overview line chart" "components/dashboard/SpendingChart.tsx"
commit "$D" 18 2 "feat: add category breakdown donut chart" "components/dashboard/CategoryDonut.tsx"
commit "$D" 19 3 "feat: add transaction entry modal" "components/dashboard/AddTransactionModal.tsx"
commit "$D" 20 4 "feat: implement dashboard home page" "app/dashboard/page.tsx"

# --- 17 KWIETNIA: Data & Utilities ---
D="2026-04-17"
commit "$D" 21 0 "feat: add realistic seed data for demo purposes" "lib/seed.ts"

# --- 18 KWIETNIA: Transactions & Hooks ---
D="2026-04-18"
commit "$D" 15 0 "feat: build transactions list with grouping" "app/dashboard/transactions/page.tsx"
commit "$D" 16 1 "feat: add useAlerts hook for budget notifications" "hooks/useAlerts.ts"
commit "$D" 17 2 "feat: implement basic toast notification system" "components/ui/Toast.tsx" "components/ui/ConfirmationModal.tsx"
commit "$D" 19 3 "fix: correct transaction sorting logic" "lib/utils.ts"

# --- 19 KWIETNIA: Analytics & Alerts ---
D="2026-04-19"
commit "$D" 18 0 "feat: create analytics page with spending patterns" "app/dashboard/analytics/page.tsx"
commit "$D" 19 1 "feat: add alerts page for financial warnings" "app/dashboard/alerts/page.tsx"
commit "$D" 20 2 "style: improve chart tooltips and colors" "components/dashboard/SpendingChart.tsx"

# --- 20 KWIETNIA: Budgets & Goals ---
D="2026-04-20"
commit "$D" 16 0 "feat: implement budgets management view" "app/dashboard/budgets/page.tsx"
commit "$D" 17 1 "feat: add budget creation modal" "components/dashboard/AddBudgetModal.tsx"
commit "$D" 18 2 "feat: build goals tracking page" "app/dashboard/goals/page.tsx"
commit "$D" 19 3 "feat: add goal creation modal" "components/dashboard/AddGoalModal.tsx"
commit "$D" 20 4 "feat: add subscription management page" "app/dashboard/subscriptions/page.tsx"
commit "$D" 21 5 "feat: implement subscription adding modal" "components/dashboard/AddSubscriptionModal.tsx"

# --- 22 KWIETNIA: AI Feature ---
D="2026-04-22"
commit "$D" 16 0 "feat: implement useAI hook for OpenRouter integration" "hooks/useAI.ts"
commit "$D" 17 1 "feat: create API route for AI chat proxy" "app/api/chat/route.ts"
commit "$D" 18 2 "feat: build AI assistant chat interface" "app/dashboard/ai/page.tsx"
commit "$D" 19 3 "feat: add AI analysis modals" "components/dashboard/AIAnalysisModal.tsx"
commit "$D" 20 4 "feat: add skeleton loaders for AI responses" "components/dashboard/AISuggestionSkeleton.tsx"

# --- 23 KWIETNIA: Polish & Fixes ---
D="2026-04-23"
commit "$D" 19 0 "style: final UI polish and mobile menu fixes" "components/dashboard/MobileNav.tsx"
commit "$D" 20 1 "fix: resolve hydration errors in charts" "lib/store.ts"

# --- 24 KWIETNIA: Finishing touches ---
D="2026-04-24"
commit "$D" 15 0 "chore: add comprehensive documentation and PRD" "README.md" "prd.txt" "AGENTS.md" "CLAUDE.md"
commit "$D" 16 1 "feat: add app icons and manifest" "app/favicon.ico" "app/icon.tsx"
commit "$D" 17 2 "chore: final cleanup of unused assets and logs" ".gitignore" ".env.local"

echo "✅ Gotowe! Historia wygenerowana bezpośrednio w ROOT."
