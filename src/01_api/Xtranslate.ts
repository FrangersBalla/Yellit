import { franc } from 'franc'

const iso3to1: Record<string, string> = {
  afr: 'af',
  alb: 'sq', sqi: 'sq',
  amh: 'am',
  ara: 'ar',
  asm: 'as',
  aze: 'az',
  ben: 'bn',
  ber: 'ber',
  bho: 'bho',
  bos: 'bs',
  bul: 'bg',
  cat: 'ca',
  ceb: 'ceb',
  chi: 'zh', zho: 'zh',
  ckb: 'ku',
  dan: 'da',
  deu: 'de', ger: 'deu',
  eng: 'en',
  est: 'et',
  eus: 'eu', baq: 'eu',
  fas: 'fa', per: 'fa',
  fin: 'fi',
  fra: 'fr', fre: 'fr',
  gle: 'ga', irish: 'ga', gla: 'gd',
  guj: 'gu',
  hat: 'ht',
  hin: 'hi',
  hrv: 'hr',
  hun: 'hu',
  ind: 'id', inos: 'id',
  ita: 'it',
  jav: 'jv',
  jpn: 'ja',
  kan: 'kn',
  kaz: 'kk',
  khm: 'km',
  kir: 'ky',
  kor: 'ko',
  lao: 'lo',
  lat: 'la',
  lav: 'lv',
  lit: 'lt',
  mlt: 'mt',
  mkd: 'mk',
  mal: 'ml',
  mar: 'mr',
  mya: 'my', bur: 'my',
  nez: 'ne', nep: 'ne',
  nld: 'nl', dut: 'nl',
  nor: 'no',
  oci: 'oc',
  pan: 'pa', pus: 'ps',
  pol: 'pl',
  por: 'pt',
  roh: 'rm',
  ron: 'ro', rum: 'ro',
  rus: 'ru',
  slv: 'sl',
  som: 'so',
  spa: 'es',
  srp: 'sr',
  swa: 'sw',
  swe: 'sv',
  tha: 'th',
  tur: 'tr',
  uig: 'ug',
  ukr: 'uk',
  urd: 'ur',
  vie: 'vi',
  yue: 'yue',
  zul: 'zu',
}

const convertLangCode = (code3: string) => iso3to1[code3] || 'en'

const detectLanguage = (text: string) => {
  const langCode = franc(text)
  if (langCode === 'und') return 'eng'
  return langCode
}

async function LingvaTranslateWithDetect(input: string): Promise<string> {
  if (!input) return ''

  const sourceLang3 = detectLanguage(input)
  const sourceLang = convertLangCode(sourceLang3)
  const targetLang = 'en'

  try {
    const response = await fetch(`https://lingva.ml/api/v1/${sourceLang}/${targetLang}/${encodeURIComponent(input)}`)
    if (!response.ok) throw new Error('Translation API error')
    const data = await response.json()
    return data.translation
  } catch {
    return input
  }
}

export default LingvaTranslateWithDetect
