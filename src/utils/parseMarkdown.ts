import React from 'react'

// return arr di stringhe ed elementi react
export function parseMarkdown(text: string): (string | React.ReactElement)[] {
  const res: (string | React.ReactElement)[] = [] // array finale con gli elementi parsati
  let c = 0

  /*
    alternativa 1: \*\*.*?\*\* se ho due ** consecutivi prendo la seq minima (.*?) dentro **
    alternativa 2: __.*?__ seq minima dentro __ __
    alternativa 3: \[.*?\]\(.*?\) seq minima dentro [] e seq min ()
    alternativa 4: @[a-zA-Z0-9_]+ seq >= 1; classe di caratteri -> 0-9, _, a-zA-Z
    alternativa 5: [^_*@\[]+ seq >= 1 che non comprende *, _, @, [
    alternativa 6: \* singolo * come testo normale
    alternativa 7: _ singolo _ come testo normale
  */
  const regex = /(\*\*.*?\*\*|__.*?__|\[.*?\]\(.*?\)|@[a-zA-Z0-9_]+|[^_*@\[]+|\*|_)/g
  let match

  while ((match = regex.exec(text)) != null) {
    const str = match[0]

    if (str.startsWith('**') && str.endsWith('**')) { //bold
      const content = str.slice(2, -2)

      res.push(React.createElement('strong', { key: c++ }, content))
    }

    else if (str.startsWith('__') && str.endsWith('__')) { //italic
      const content = str.slice(2, -2)

      res.push(React.createElement('em', { key: c++ }, content))
    }

    else if (str.startsWith('[') && str.includes('](') && str.endsWith(')')) {
      const end = str.indexOf('](') //fine del link text
      const link = str.slice(1, end) //link text

      const url = str.slice(end + 2, -1)

      res.push(React.createElement('a', {
        key: c++,
        href: url,
        target: '_blank',
        rel: 'noopener noreferrer',
        className: 'hover:underline'
      }, link))
    }

    else if (str.startsWith('@')) { //mention
      res.push(React.createElement('span', {
        key: c++,
        className: 'text-blue-500'
      }, str))
    }
    else {
      // testo normale
      res.push(str)
    }
  }

  return res
}

// cerco tutti gli @username e restituisco una lista di utenti da notificare
export function extractMentions(text: string): string[] {
  const mentions: string[] = []
  const regex = /@([a-zA-Z0-9_]+)/g //cattura il testo dopo @
  let match

  while ((match = regex.exec(text)) != null) {
    mentions.push(match[1])
  }
  return [...new Set(mentions)] //uso set per rimuovere i duplicati
}