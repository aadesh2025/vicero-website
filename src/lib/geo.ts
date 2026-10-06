import type { FixedCurrency } from "./pricing";

/** ISO 3166 country -> the currency people there actually use (ISO 4217). */
const COUNTRY_CURRENCY = Object.fromEntries(
  `AD:EUR AE:AED AF:AFN AG:XCD AL:ALL AM:AMD AO:AOA AR:ARS AT:EUR AU:AUD AZ:AZN BA:BAM BB:BBD BD:BDT BE:EUR BF:XOF BG:EUR BH:BHD BI:BIF BJ:XOF BN:BND BO:BOB BR:BRL BS:BSD BT:BTN BW:BWP BY:BYN BZ:BZD CA:CAD CD:CDF CF:XAF CG:XAF CH:CHF CI:XOF CL:CLP CM:XAF CN:CNY CO:COP CR:CRC CU:CUP CV:CVE CY:EUR CZ:CZK DE:EUR DJ:DJF DK:DKK DM:XCD DO:DOP DZ:DZD EC:USD EE:EUR EG:EGP ER:ERN ES:EUR ET:ETB FI:EUR FJ:FJD FR:EUR GA:XAF GB:GBP GD:XCD GE:GEL GH:GHS GM:GMD GN:GNF GQ:XAF GR:EUR GT:GTQ GW:XOF GY:GYD HK:HKD HN:HNL HR:EUR HT:HTG HU:HUF ID:IDR IE:EUR IL:ILS IN:INR IQ:IQD IR:IRR IS:ISK IT:EUR JM:JMD JO:JOD JP:JPY KE:KES KG:KGS KH:KHR KM:KMF KN:XCD KR:KRW KW:KWD KZ:KZT LA:LAK LB:LBP LC:XCD LI:CHF LK:LKR LR:LRD LS:LSL LT:EUR LU:EUR LV:EUR LY:LYD MA:MAD MC:EUR MD:MDL ME:EUR MG:MGA MK:MKD ML:XOF MM:MMK MN:MNT MO:MOP MR:MRU MT:EUR MU:MUR MV:MVR MW:MWK MX:MXN MY:MYR MZ:MZN NA:NAD NE:XOF NG:NGN NI:NIO NL:EUR NO:NOK NP:NPR NZ:NZD OM:OMR PA:USD PE:PEN PG:PGK PH:PHP PK:PKR PL:PLN PT:EUR PY:PYG QA:QAR RO:RON RS:RSD RU:RUB RW:RWF SA:SAR SB:SBD SC:SCR SD:SDG SE:SEK SG:SGD SI:EUR SK:EUR SL:SLE SM:EUR SN:XOF SO:SOS SR:SRD SS:SSP ST:STN SV:USD SY:SYP SZ:SZL TD:XAF TG:XOF TH:THB TJ:TJS TL:USD TM:TMT TN:TND TO:TOP TR:TRY TT:TTD TW:TWD TZ:TZS UA:UAH UG:UGX US:USD UY:UYU UZ:UZS VA:EUR VC:XCD VE:VES VN:VND VU:VUV WS:WST XK:EUR YE:YER ZA:ZAR ZM:ZMW ZW:USD PR:USD GU:USD VI:USD AS:USD`
    .split(" ")
    .map((p) => p.split(":")),
) as Record<string, string>;

/** Which of our three fixed price lists is "nearest" to a country. Only matters when its own currency isn't one of them. */
const SOUTH_ASIA = new Set(["IN", "NP", "BD", "LK", "BT", "MV", "PK", "AF"]);
const EUROPE_NEAR = new Set(
  "AL AD AT BA BE BG BY CH CY CZ DE DK EE ES FI FR GB GE GR HR HU IE IS IT LI LT LU LV MC MD ME MK MT NL NO PL PT RO RS RU SE SI SK SM TR UA VA XK AM AZ MA DZ TN".split(" "),
);

export function localCurrency(country: string | null): string | null {
  return country ? (COUNTRY_CURRENCY[country.toUpperCase()] ?? null) : null;
}

/** The fixed list a visitor from this country is shown (or converted from). Defaults to USD. */
export function nearestFixed(country: string | null): FixedCurrency {
  const c = country?.toUpperCase() ?? "";
  if (SOUTH_ASIA.has(c)) return "INR";
  if (EUROPE_NEAR.has(c)) return "EUR";
  return "USD";
}
