# ADR 0003: Rewards are a redeemable Points balance, not auto-credited wallet money; multi-currency wallets deferred

**Status:** Accepted
**Date:** 2026-10-04

## Decision

Affiliate rewards (referral commissions, event-ticket-sale commissions) accrue in their own
ledger account (`LedgerAccountType::Affiliate`) and stay there until the user explicitly redeems
them. Redemption converts points to wallet money at a rate looked up from a new
`points_redemption_rates` table (one row per currency, admin-editable), via a dedicated
`RedeemRewardPoints` action — not an automatic sweep on earn.

The redemption-rate table is keyed by currency from day one, but only one row (`NGN`,
`rate_minor_per_point = 100`, i.e. 100 points = ₦100) is seeded or reachable today. Adding
EUR/GBP/USD wallets — the admin's original ask — is explicitly **out of scope** for this change
and deferred to a Phase 2 that has not been scheduled.

## Context and rationale

Two earlier passes in this same work landed, then were reversed:

1. First pass made rewards reachable by `RequestWithdrawal` at all — they were being credited to
   the `Affiliate` ledger account but that account was never read by anything, so reward money
   was earned but structurally unwithdrawable. Fixed by sweeping `Affiliate` → `UserWallet`
   immediately on earn (`LedgerService::creditAffiliateReward()`), the same pattern already used
   for `EventOrganizer`→`UserWallet` and `TribeOwner`→`UserWallet`.
2. The user then asked for something bigger: a genuine separate "Points" balance ("100 Rewards
   Points = ₦100") that a user redeems deliberately, not money that's already spendable the
   instant it's earned. This is a deliberate reversal of (1) — the sweep was removed, and
   `Affiliate` balance now means "unredeemed points," read directly by `GetAllEarnings` as
   `points_balance`.

The user's request grew mid-conversation into "full multi-currency wallets" (admin adds EUR, GBP,
USD; each gets its own redemption rate). Two parallel investigations before building anything
found this is a much larger initiative than the Points feature itself, and genuinely blocked on
one external fact, not a code decision:

- **Paystack — this platform's only payment/payout provider — does not support EUR or GBP at
  all**, for either collection or transfer. Its transfer API covers NGN, GHS, KES, ZAR, and USD
  only, and USD payout is restricted to Nigeria/Kenya-based merchant accounts. There is no
  confirmed way for this platform to actually pay a user out in EUR or GBP today.
- `Money`'s `currency` defaults to `'NGN'` at **68 call sites** across the backend, none of which
  thread a real currency through. `wallets.balance` has no currency column and is written to
  directly in three places, bypassing the ledger entirely — a pre-existing consistency bug,
  independent of currency. `DisburseWithdrawal.php` hardcodes `'currency' => 'NGN'` in the literal
  Paystack payload. `tickets.price` and `events.commission` carry no currency field. The frontend
  has 30+ call sites rendering a hardcoded `₦` glyph and 7+ with a literal `"N"` prefix; the one
  currency-aware formatter in `packages/domain` is an unused `TODO(Phase 5)` stub. No
  exchange-rate mechanism exists anywhere in the codebase.

Given the Paystack finding, the user chose to stop at NGN rather than build wallet infrastructure
for currencies this platform cannot actually pay out. The redemption-rate table still being keyed
by currency means adding a currency later is a data addition, not a migration — but no further
code toward multi-currency should be written until Paystack support (or a second gateway) is
confirmed for the currency in question.

## Consequences

- Reward money is no longer spendable the instant it's earned. A user must call
  `redeem-points` (idempotency-key-protected, server-computed amount, no optimistic UI — per
  CLAUDE.md's money-mutation rules) to move points into their wallet balance.
- `GetAllEarnings` exposes `points_balance` (current, unredeemed, in points) separately from
  `wallet_balance` (spendable, already-redeemed money) and `rewards_earned` (lifetime total ever
  earned, unaffected by redemption state).
- An admin-only `points-rates` endpoint pair (list, update-by-currency) lets the rate change
  without a deploy — currently exercised for NGN only, on the existing Wallet Management admin
  screen.
- EUR, GBP, and USD wallets are **not implemented**. Any future work toward them should start by
  re-confirming Paystack's (or a replacement gateway's) actual payout capability for that specific
  currency and this merchant account, before writing any `Money`/ledger/UI code — the finding
  above should not be re-derived from scratch.
- See `docs/ARCHITECTURE.md` §22 ("Alternatives considered and rejected") for the multi-currency
  decision recorded in that document's own format.
