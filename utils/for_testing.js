function palindrome(input) {
  return input.split("").reverse().join("")
}

function sum(input) {
  return input.reduce((a,b) => a + b)
}

function average(input) {
  return input.length === 0 ? 0 : sum(input) / input.length
}


module.exports = {
  palindrome,
  sum,
  average
}