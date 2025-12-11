export const goBackOrHome = (navigate: any) => {
  const referrer = document.referrer
  const currentOrigin = window.location.origin

  const isSameSite =
    referrer && referrer.startsWith(currentOrigin)

  if (isSameSite) { // non se è un link aperto dall'esterno
    navigate(-1) // torna indietro
  } else {
    navigate('/') // altrimenti vai alla home
  }
}