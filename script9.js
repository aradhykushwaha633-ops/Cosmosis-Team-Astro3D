/* COSMOSIS site settings. Fill these in before launch; nothing loads until they are set. */
window.COSMOSIS_CONFIG = {
  gaId: '',          // Google Analytics 4 measurement ID, e.g. 'G-ABC123XYZ9'
  turnstileKey: '',  // Cloudflare Turnstile site key (the "Verify you are human" box) for the community post form

  /* THE SIX REVIEW BOXES on the home page. Type each real review between the quotes.
     name = who wrote it, role = e.g. 'Class 9 student' (optional), rating = 1 to 5, text = the review (up to 400 characters).
     A box with an empty text stays as a soft "your review goes here" placeholder. */
  reviews: [
    { name: '', role: '', rating: 5, text: '' },
    { name: '', role: '', rating: 5, text: '' },
    { name: '', role: '', rating: 5, text: '' },
    { name: '', role: '', rating: 5, text: '' },
    { name: '', role: '', rating: 5, text: '' },
    { name: '', role: '', rating: 5, text: '' }
  ]
};
