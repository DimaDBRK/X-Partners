export const isValidEmail = (email) => {
  // Define a regular expression pattern for valid email format
  var pattern = /^[\w.-]+@[\w.-]+\.\w+$/;
  return pattern.test(email);
}