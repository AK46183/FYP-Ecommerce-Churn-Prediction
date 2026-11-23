// Database mein save karne se pehle card / CNIC / OTP jaise number chhupa do.
// Skincare Assistant ki chats aur Help Bot ki complaints dono yahi use karte hain (Privacy Policy ka wada).
// (CNIC pehle: warna 13 digit wala CNIC card number samjha jata hai)
const maskSensitive = (t) => String(t || '')
  .replace(/\b\d{5}-?\d{7}-?\d\b/g, '[hidden CNIC]')
  .replace(/\b(?:\d[ -]?){13,19}\b/g, '[hidden number]')
  .replace(/\b(otp|cvv|pin)\s*[:#-]?\s*\d{3,8}\b/gi, '$1 [hidden]');

module.exports = { maskSensitive };
