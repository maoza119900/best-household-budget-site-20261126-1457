# Maple & Main — Rivera Household Budget

![competition](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)
![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/maoza119900/best-household-budget-site-20261126-1457/rank.svg)
![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/maoza119900/best-household-budget-site-20261126-1457/reward.svg)

A household budget site for one fictional family — the Riveras (Daniel & Priya, kids Leo and Sofia) — that runs entirely offline in a web browser, on a desktop and on a phone, from static files with no network request.

## What it does

- **Dashboard** — November income, spending, leftover money and savings rate; income-vs-spending bars; a spending donut by category; over-budget alerts; the 8 most recent transactions; bills still to pay.
- **Transactions** — add, edit and delete income and spending, filtered by month, category and search, with a running total for the filter.
- **Budgets** — a monthly limit per category with a progress bar (over budget turns red, close turns amber); change any limit in place.
- **Trends** — September to November income vs spending, a category share ranking, average spending, biggest category and the savings-rate trend.
- **Bills** — the fixed monthly bills with due days, mark paid / unpaid, add a custom bill, delete one.
- **Goals** — emergency fund, family trip and car down payment, each with progress, a monthly amount to save, add-savings, edit-target and delete.
- **Data** — export the budget as JSON, import a JSON file, reload the sample data, or clear everything. Data lives in the browser's localStorage only.

## Run it

```sh
node serve.ts
```

Then open <http://localhost:8080>. No build step, no install, no network.

## Build the entry

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library. Two runs over the same files produce byte-identical output: no clock, no randomness, no network.

## Screenshots

Four real renders of the running site live in `screenshots/` (see `shots.json` for the routes and viewports): the dashboard, transactions and budgets on desktop, and trends on a phone-sized viewport. Tested in desktop Chrome and at a 390px phone width.

## License

MIT — see `LICENSE`. The people, payees and figures are fictional sample data.
