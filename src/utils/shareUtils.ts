import Swal from "sweetalert2"
// WHATSAPP
export const shareOnWhatsApp = (title: string, url: string) => {
  const message = `*${title}*\nShout it out! Read more...\n${url}`
  const encoded = encodeURIComponent(message)
  window.open(`https://wa.me/?text=${encoded}`, '_blank')
}

// TELEGRAM
export const shareOnTelegram = (title: string, url: string) => {
  const text = `${title}\nShout it out! Read more...\n${url}`
  const encodedText = encodeURIComponent(text)
  const encodedUrl = encodeURIComponent(url)
  window.open(
    `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    '_blank'
  )
}

// REDDIT
export const shareOnReddit = (title: string, url: string) => {
  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(url)
  window.open(
    `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    '_blank'
  )
}

// SMS / MESSAGGI
export const shareOnSMS = (title: string, url: string) => {
  const message = `${title}\nShout it out! Read more...\n${url}`
  const encoded = encodeURIComponent(message)
  window.open(`sms:?body=${encoded}`, '_self')
}

// COPY LINK
export const copyLink = async (url: string) => {
  try {
    await navigator.clipboard.writeText(url)
    Swal.fire({
      theme: 'dark',
      text:'Copied to clipboard!',
      customClass: {
        popup: 'my-popup',
        confirmButton: 'my-button'
      }
    })
  } catch (err) {
    Swal.fire({
      theme: 'dark',
      text:'Failed to copy link',
      customClass: {
        popup: 'my-popup',
        confirmButton: 'my-button'
      }
    })
  }
}