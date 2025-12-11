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
  if (langCode == 'und') return 'eng'
  return langCode
}

async function translatePlainText(input: string, targetLang: string, sourceLang?: string): Promise<string> {
  if (!input) return ''

  try {
    const response = await fetch(`https://lingva.ml/api/v1/${sourceLang}/${targetLang}/${encodeURIComponent(input)}`)
    if (!response.ok) throw new Error('Translation API error')
    const data = await response.json()
    return data.translation
  } catch {
    return input
  }
}

async function LingvaTranslateWithDetect(input: string, targetLang:string = 'en', sourceLang?: string): Promise<[string, string]> {
  if (!input) return ['', '']

  const sourceLang3 = detectLanguage(input)
  const s = convertLangCode(sourceLang3)
  sourceLang = sourceLang ?? s

  const parts: string[] = []
  const regex = /(\*\*.*?\*\*|__.*?__|\[.*?\]\(.*?\)|@[a-zA-Z0-9_]+|[^_*@\[]+|\*|_)/g
  let match
  while ((match = regex.exec(input)) != null) {
    parts.push(match[0])
  }

  const translatedParts = await Promise.all(parts.map(async (part) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const content = part.slice(2, -2)
      const translated = await translatePlainText(content, targetLang, sourceLang)
      return `**${translated}**`
    }
    else if (part.startsWith('__') && part.endsWith('__')) {
      const content = part.slice(2, -2)
      const translated = await translatePlainText(content, targetLang, sourceLang)
      return `__${translated}__`
    }
    else if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
      const end = part.indexOf('](')
      const linkText = part.slice(1, end)
      const url = part.slice(end + 2, -1)
      const translatedText = await translatePlainText(linkText, targetLang, sourceLang)
      return `[${translatedText}](${url})`
    }
    else if (part.startsWith('@')) {
      return part
    }
    else if (/[^_*@\[]+/.test(part)) {
      const translated = await translatePlainText(part, targetLang, sourceLang)
      return translated
    }
    else {
      return part
    }
  }))

  const translatedText = translatedParts.join('')
  return [translatedText, sourceLang]
}

export default LingvaTranslateWithDetect