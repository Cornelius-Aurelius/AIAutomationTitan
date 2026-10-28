# Titan AI Automation — Enterprise Command Centre

Original project and website by **Cornelius Aurelius** — [official creator website](https://corneliusaurelius.com/).

A standalone static enterprise automation service overview and in-browser workflow planning tool. Works with GitHub Pages (main branch, root). No backend, accounts, tracking, API keys or dependencies.

## What is functional
- Responsive pages for four service concepts, deployment process and original three price tiers.
- Workflow Lab: validate inputs, calculate an **assumption-based** yearly time scenario (`weekly team hours × 52 × user-supplied assumed reduction`), optionally multiply by an assumed hourly cost, show contextual risk controls, copy and download a human-readable text brief.
- Menu and all buttons/links. Data entered in the Workflow Lab is not submitted or stored automatically.

## What is NOT offered by the static site
The site does not run live automations, generate independent market data, produce AI predictions, send project enquiries, measure productivity, guarantee returns or verify an agency client roster. It has no confirmed sales email address; no fictitious contact details were added.

## Existing content preservation
The original homepage included Foundation £12,500, Enterprise £48,000 and Titan Suite £185,000+ packages. These values are reproduced exactly, clearly marked indicative. Original code had **no existing publication or updated timestamp**, and none has been fabricated. No original source-code links are exposed publicly.

## SEO
Canonical: https://cornelius-aurelius.github.io/AIAutomationTitan/ . Includes crawlable text, a static JSON-LD Person / Organization / WebPage / WebApplication graph, creator and author references, robots, sitemap, llms, favicon and social artwork. Third-party indexing and AI attribution cannot be guaranteed.

## QA
Run `node --test tests/core.test.cjs tests/site.test.cjs`; use `python tests/browser_qa.py` if Playwright Chromium is installed. Verify a published GitHub Pages deployment and manually test a real phone/Chromebook before promoting the link to corneliusaurelius.com.
