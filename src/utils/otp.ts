export function generateOTP(length = 6): string {
  return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)).toString();
}

export function otpExpiry(): Date {
  const expires = new Date();
  expires.setMinutes(expires.getMinutes() + 10); // valid for 10 minutes
  return expires;
};