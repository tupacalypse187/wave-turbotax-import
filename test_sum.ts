
import { normalizeTransactions, calculateFinancialSummary } from './src/lib/financialUtils';
import Papa from 'papaparse';

const csvData = `Transaction ID,Transaction Date,Account Name,Transaction Description,Transaction Line Description,Amount (One column), ,Debit Amount (Two Column Approach),Credit Amount (Two Column Approach),Other Accounts for this Transaction,Customer,Vendor,Invoice Number,Bill Number,Notes / Memo,Amount Before Sales Tax,Sales Tax Amount,Sales Tax Name,Transaction Date Added,Transaction Date Last Modified,Account Group,Account Type,Account ID
2403037444485185830,2025-10-24,Owner Investment / Drawings,Netcup pnode2 server,,6.68,,,6.68,Computer – Hosting,,,,,Netcup pnode2 server,6.68,,,2025-11-17,2025-12-22,Equity,Business Owner Contribution and Drawing,
2403037444485185830,2025-10-24,Computer – Hosting,Netcup pnode2 server,,6.68,,6.68,,Owner Investment / Drawings,,Netcup,,,Netcup pnode2 server,6.68,,,2025-11-17,2025-12-22,Expense,Operating Expense,
2400180417090060948,2025-10-26,Education & Training,Innovating with AI - AI Training,Bill payment to Innovating with AI,2997.00,,2997.00,,Owner Investment / Drawings,,Innovating with AI,,,,2997.00,,,2025-11-13,2025-11-13,Expense,Operating Expense,
2400180417090060948,2025-10-26,Owner Investment / Drawings,Innovating with AI - AI Training,Bill payment to Innovating with AI,2997.00,,,2997.00,Education & Training,,,,,,2997.00,,,2025-11-13,2025-11-13,Equity,Business Owner Contribution and Drawing,
2403036648817328328,2025-10-28,Owner Investment / Drawings,Contabo n8n Server,,71.52,,,71.52,Computer – Hosting,,,,,Contabo n8n Server,71.52,,,2025-11-17,2025-12-22,Equity,Business Owner Contribution and Drawing,
2403036648817328328,2025-10-28,Computer – Hosting,Contabo n8n Server,,71.52,,71.52,,Owner Investment / Drawings,,Contabo,,,Contabo n8n Server,71.52,,,2025-11-17,2025-12-22,Expense,Operating Expense,
2403035821876740271,2025-11-08,Owner Investment / Drawings,OpenAI API Credits,,10.18,,,10.18,Dues & Subscriptions,,,,,OpenAI API credits.,10.18,,,2025-11-17,2025-12-30,Equity,Business Owner Contribution and Drawing,
2403035821876740271,2025-11-08,Dues & Subscriptions,OpenAI API Credits,,10.18,,10.18,,Owner Investment / Drawings,,OpenAI,,,OpenAI API credits.,10.18,,,2025-11-17,2025-12-30,Expense,Operating Expense,
2400392325634228273,2025-11-09,Owner Investment / Drawings,Domain Registration 1-Year (neuralsecadvisory.com),,0.99,,,0.99,Computer – Hosting,,,,,Google Workspaces subscription. 14-day trial, $.99 domain registration for the year.\\nnueralsecadvisory.com,0.99,,,2025-11-13,2025-11-13,Equity,Business Owner Contribution and Drawing,
2400392325634228273,2025-11-09,Computer – Hosting,Domain Registration 1-Year (neuralsecadvisory.com),,0.99,,0.99,,Owner Investment / Drawings,,Google,,,Google Workspaces subscription. 14-day trial, $.99 domain registration for the year.\\nnueralsecadvisory.com,0.99,,,2025-11-13,2025-11-13,Expense,Operating Expense,
2428516292186112458,2025-11-09,Owner Investment / Drawings,CT Business Taxes Registration,,100.00,,,100.00,Connecticut,,,,,REG-1, Business Taxes Registration Application - State of Connecticut Department of Revenue Services,100.00,,,2025-12-22,2025-12-22,Equity,Business Owner Contribution and Drawing,
2428516292186112458,2025-11-09,Connecticut,CT Business Taxes Registration,,-100.00,,100.00,,Owner Investment / Drawings,,,,,REG-1, Business Taxes Registration Application - State of Connecticut Department of Revenue Services,-100.00,,,2025-12-22,2025-12-22,Liability,Sales Tax on Sales and Purchases,
2428517337037570895,2025-11-09,Owner Investment / Drawings,Secretary of the State of Connecticut Acceptance Notice,,120.00,,,120.00,Connecticut,,,,,NeuralSec Advisory LLC - Secretary of the State of Connecticut Acceptance Notice,120.00,,,2025-12-22,2025-12-22,Equity,Business Owner Contribution and Drawing,
2428517337037570895,2025-11-09,Connecticut,Secretary of the State of Connecticut Acceptance Notice,,-120.00,,120.00,,Owner Investment / Drawings,,,,,NeuralSec Advisory LLC - Secretary of the State of Connecticut Acceptance Notice,-120.00,,,2025-12-22,2025-12-22,Liability,Sales Tax on Sales and Purchases,
2400866301070311481,2025-11-13,Owner Investment / Drawings,Domain Name Registration neuralsec.party,,44.45,,,44.45,Computer – Hosting,,,,,Registering neuralsec.party for 10-years with Cloudflare,44.45,,,2025-11-14,2025-12-22,Equity,Business Owner Contribution and Drawing,
2400866301070311481,2025-11-13,Computer – Hosting,Domain Name Registration neuralsec.party,,44.45,,44.45,,Owner Investment / Drawings,,Clouflare,,,Registering neuralsec.party for 10-years with Cloudflare,44.45,,,2025-11-14,2025-12-22,Expense,Operating Expense,
2400867228808413325,2025-11-13,Owner Investment / Drawings,warp.dev November 2025,,20.00,,,20.00,Computer – Software,,,,,warp.dev pro monthly fee,20.00,,,2025-11-14,2025-12-22,Equity,Business Owner Contribution and Drawing,
2400867228808413325,2025-11-13,Computer – Software,warp.dev November 2025,,20.00,,20.00,,Owner Investment / Drawings,,,,,warp.dev pro monthly fee,20.00,,,2025-11-14,2025-12-22,Expense,Operating Expense,
2400974231945905054,2025-11-14,Owner Investment / Drawings,Lovable Monthly November 2025,,12.63,,,12.63,Computer – Internet,,,,,Lovable Monthly November 2025,12.63,,,2025-11-14,2025-11-14,Equity,Business Owner Contribution and Drawing,
2400974231945905054,2025-11-14,Computer – Internet,Lovable Monthly November 2025,,12.63,,12.63,,Owner Investment / Drawings,,,,,Lovable Monthly November 2025,12.63,,,2025-11-14,2025-11-14,Expense,Operating Expense,
2403352073279144696,2025-11-17,Owner Investment / Drawings,HubSpot 1-year Starter Seat,,109.08,,,109.08,Connecticut, Dues & Subscriptions,,,,,HubSpot 1-year Starter for 1 user.,109.08,,,2025-11-17,2025-12-30,Equity,Business Owner Contribution and Drawing,
2403352073279144696,2025-11-17,Dues & Subscriptions,HubSpot 1-year Starter Seat,,108.00,,108.00,,Connecticut, Owner Investment / Drawings,,HubSpot,,,HubSpot 1-year Starter for 1 user.,108.00,1.08,Connecticut,2025-11-17,2025-12-30,Expense,Operating Expense,
2403352073279144696,2025-11-17,Connecticut,HubSpot 1-year Starter Seat,,-1.08,,1.08,,Dues & Subscriptions, Owner Investment / Drawings,,HubSpot,,,HubSpot 1-year Starter for 1 user.,1.08,,,2025-11-17,2025-12-30,Liability,Sales Tax on Sales and Purchases,
2406639545291407478,2025-11-22,Owner Investment / Drawings,Register neuralsec.co,,27.65,,,27.65,Computer – Hosting, Connecticut,,,,,Registering neuralsec.co for 1-year through Cloudflare,27.65,,,2025-11-22,2025-11-23,Equity,Business Owner Contribution and Drawing,
2406639545291407478,2025-11-22,Computer – Hosting,Register neuralsec.co,,26.00,,26.00,,Connecticut, Owner Investment / Drawings,,Clouflare,,,Registering neuralsec.co for 1-year through Cloudflare,26.00,1.65,Connecticut,2025-11-22,2025-11-23,Expense,Operating Expense,
2406639545291407478,2025-11-22,Connecticut,Register neuralsec.co,,-1.65,,1.65,,Computer – Hosting, Owner Investment / Drawings,,Clouflare,,,Registering neuralsec.co for 1-year through Cloudflare,1.65,,,2025-11-22,2025-11-23,Liability,Sales Tax on Sales and Purchases,
2408131940780638799,2025-11-24,Owner Investment / Drawings,Netcup pnode2 server - November,,6.64,,,6.64,Computer – Hosting,,,,,Netcup pnode2 server - November 2025,6.64,,,2025-11-24,2025-11-24,Equity,Business Owner Contribution and Drawing,
2408131940780638799,2025-11-24,Computer – Hosting,Netcup pnode2 server - November,,6.64,,6.64,,Owner Investment / Drawings,,Netcup,,,Netcup pnode2 server - November 2025,6.64,,,2025-11-24,2025-11-24,Expense,Operating Expense,
2408133278956552776,2025-11-24,Owner Investment / Drawings,Google Workspaces November 2025,,2.78,,,2.78,Dues & Subscriptions,,,,,Google Workspaces November 2025,2.78,,,2025-11-24,2025-12-30,Equity,Business Owner Contribution and Drawing,
2408133278956552776,2025-11-24,Dues & Subscriptions,Google Workspaces November 2025,,2.78,,2.78,,Owner Investment / Drawings,,Google,,,Google Workspaces November 2025,2.78,,,2025-11-24,2025-12-30,Expense,Operating Expense,
2408279158988767257,2025-11-24,Owner Investment / Drawings,Ultra Mobile Prepaid Phone Plan,,95.15,,,95.15,Telephone – Wireless,,,,,Purchasing a phone number and phone plan from Ultra Mobile for 1-year.,95.15,,,2025-11-24,2025-11-24,Equity,Business Owner Contribution and Drawing,
2408279158988767257,2025-11-24,Telephone – Wireless,Ultra Mobile Prepaid Phone Plan,,95.15,,95.15,,Owner Investment / Drawings,,Ultra Mobile,,,Purchasing a phone number and phone plan from Ultra Mobile for 1-year.,95.15,,,2025-11-24,2025-11-24,Expense,Operating Expense,
2409696193102774640,2025-11-26,Owner Investment / Drawings,2 Contabo Servers,,89.04,,,89.04,Computer – Hosting,,,,,2 Contabo Cloud VPS 10 for 12-months,89.04,,,2025-11-26,2025-11-26,Equity,Business Owner Contribution and Drawing,
2409696193102774640,2025-11-26,Computer – Hosting,2 Contabo Servers,,89.04,,89.04,,Owner Investment / Drawings,,Contabo,,,2 Contabo Cloud VPS 10 for 12-months,89.04,,,2025-11-26,2025-11-26,Expense,Operating Expense,
2410413644681610175,2025-11-27,Owner Investment / Drawings,Google Workspaces $35 charge,,35.00,,,35.00,Dues & Subscriptions,,,,,Google Workspaces $35 charge to get full storage access for a new account.,35.00,,,2025-11-27,2025-12-30,Equity,Business Owner Contribution and Drawing,
2410413644681610175,2025-11-27,Dues & Subscriptions,Google Workspaces $35 charge,,35.00,,35.00,,Owner Investment / Drawings,,Google,,,Google Workspaces $35 charge to get full storage access for a new account.,35.00,,,2025-11-27,2025-12-30,Expense,Operating Expense,
2411270467336831586,2025-11-28,Owner Investment / Drawings,Skool - Build Room Subscription,,479.00,,,479.00,Dues & Subscriptions,,,,,Skool - Build Room Subscription 1-year.,479.00,,,2025-11-28,2025-11-28,Equity,Business Owner Contribution and Drawing,
2411270467336831586,2025-11-28,Dues & Subscriptions,Skool - Build Room Subscription,,479.00,,479.00,,Owner Investment / Drawings,,,,,Skool - Build Room Subscription 1-year.,479.00,,,2025-11-28,2025-11-28,Expense,Operating Expense,
2413204090101203558,2025-12-01,Owner Investment / Drawings,December servers.com XAND1,,75.00,,,75.00,Computer – Hardware,,,,,December servers.com XAND1,75.00,,,2025-12-01,2025-12-01,Equity,Business Owner Contribution and Drawing,
2413204090101203558,2025-12-01,Computer – Hardware,December servers.com XAND1,,75.00,,75.00,,Owner Investment / Drawings,,servers.com,,,December servers.com XAND1,75.00,,,2025-12-01,2025-12-01,Expense,Operating Expense,
2413548506322075849,2025-12-01,Owner Investment / Drawings,Contabo VPS-30 1-Year,,129.60,,,129.60,Computer – Hardware,,,,,Contabo VPS-30 1-Year,129.60,,,2025-12-01,2025-12-01,Equity,Business Owner Contribution and Drawing,
2413548506322075849,2025-12-01,Computer – Hardware,Contabo VPS-30 1-Year,,129.60,,129.60,,Owner Investment / Drawings,,Contabo,,,Contabo VPS-30 1-Year,129.60,,,2025-12-01,2025-12-01,Expense,Operating Expense,
2413549108364083520,2025-12-01,Owner Investment / Drawings,Contabo VPS-20 1-Year,,68.76,,,68.76,Computer – Hardware,,,,,Contabo VPS-20 1-Year,68.76,,,2025-12-01,2025-12-01,Equity,Business Owner Contribution and Drawing,
2413549108364083520,2025-12-01,Computer – Hardware,Contabo VPS-20 1-Year,,68.76,,68.76,,Owner Investment / Drawings,,Contabo,,,Contabo VPS-20 1-Year,68.76,,,2025-12-01,2025-12-01,Expense,Operating Expense,
2416895299969647586,2025-12-06,Owner Investment / Drawings,Claude API Credits - Anthropic,,5.05,,,5.05,Dues & Subscriptions,,,,,Claude API Credits,5.05,,,2025-12-06,2025-12-30,Equity,Business Owner Contribution and Drawing,
2416895299969647586,2025-12-06,Dues & Subscriptions,Claude API Credits - Anthropic,,5.05,,5.05,,Owner Investment / Drawings,,,,,Claude API Credits,5.05,,,2025-12-06,2025-12-30,Expense,Operating Expense,
2423333069030195265,2025-12-14,Owner Investment / Drawings,Lovable Monthly December 2025,,13.29,,,13.29,Computer – Internet,,,,,Lovable Monthly December 2025,13.29,,,2025-12-15,2025-12-15,Equity,Business Owner Contribution and Drawing,
2423333069030195265,2025-12-14,Computer – Internet,Lovable Monthly December 2025,,13.29,,13.29,,Owner Investment / Drawings,,,,,Lovable Monthly December 2025,13.29,,,2025-12-15,2025-12-15,Expense,Operating Expense,
2429914775455564566,2025-12-24,Owner Investment / Drawings,Netcup VPS December 2025,,6.79,,,6.79,Computer – Hosting,,,,,Netcup VPS December 2025,6.79,,,2025-12-24,2025-12-24,Equity,Business Owner Contribution and Drawing,
2429914775455564566,2025-12-24,Computer – Hosting,Netcup VPS December 2025,,6.79,,6.79,,Owner Investment / Drawings,,Netcup,,,Netcup VPS December 2025,6.79,,,2025-12-24,2025-12-24,Expense,Operating Expense,
2432770818430763417,2025-12-26,Owner Investment / Drawings,Google Ads Threshold,,10.00,,,10.00,Advertising & Promotion,,,,,Google Ads - Clicks Threshold Payment,10.00,,,2025-12-28,2025-12-28,Equity,Business Owner Contribution and Drawing,
2432770818430763417,2025-12-26,Advertising & Promotion,Google Ads Threshold,,10.00,,10.00,,Owner Investment / Drawings,,Google,,,Google Ads - Clicks Threshold Payment,10.00,,,2025-12-28,2025-12-28,Expense,Operating Expense,
2434181325788316539,2025-12-30,Owner Investment / Drawings,Salesforce Starter Suite Annual Subscription,,121.20,,,121.20,Dues & Subscriptions,,,,,Salesforce Starter Suite Annual Subscription - Promotion pricing.,121.20,,,2025-12-30,2025-12-30,Equity,Business Owner Contribution and Drawing,
2434181325788316539,2025-12-30,Dues & Subscriptions,Salesforce Starter Suite Annual Subscription,,121.20,,121.20,,Owner Investment / Drawings,,,,,Salesforce Starter Suite Annual Subscription - Promotion pricing.,121.20,,,2025-12-30,2025-12-30,Expense,Operating Expense,
2434223054935588880,2025-12-30,Owner Investment / Drawings,Opencode API Credits,,21.23,,,21.23,Dues & Subscriptions,,,,,Opencode API Credits,21.23,,,2025-12-30,2025-12-30,Equity,Business Owner Contribution and Drawing,
2434223054935588880,2025-12-30,Dues & Subscriptions,Opencode API Credits,,21.23,,21.23,,Owner Investment / Drawings,,,,,Opencode API Credits,21.23,,,2025-12-30,2025-12-30,Expense,Operating Expense,
2434226772615660523,2025-12-30,Owner Investment / Drawings,OpenRouter API Credits,,52.75,,,52.75,Dues & Subscriptions,,,,,OpenRouter API Credits,52.75,,,2025-12-30,2025-12-30,Equity,Business Owner Contribution and Drawing,
2434226772615660523,2025-12-30,Dues & Subscriptions,OpenRouter API Credits,,52.75,,52.75,,Owner Investment / Drawings,,,,,OpenRouter API Credits,52.75,,,2025-12-30,2025-12-30,Expense,Operating Expense,`

const parseData = (csv: string) => {
    return Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
    }).data;
}

const runTest = () => {
    const transactions: any[] = parseData(csvData);
    const normalized = normalizeTransactions(transactions);
    const summary = calculateFinancialSummary(normalized);

    console.log('Total Expenses:', summary.totalExpenses);
}

runTest();
