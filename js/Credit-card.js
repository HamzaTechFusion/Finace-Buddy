// Initial balance for the credit card
let cardBalance = 0;

// Function to update the balance in the HTML
function updateBalance() {
  // Update the balance displayed in the HTML
  document.getElementById('cardBalance').textContent = cardBalance.toFixed(2);
}

// Function to add an amount to the card
function addAmount() {
  const amountToAdd = parseFloat(document.getElementById('purchaseAmount').value);

  // Check if the input value is valid (greater than 0 and a number)
  if (isNaN(amountToAdd) || amountToAdd <= 0) {
    alert('Please enter a valid amount to add.');
    return;
  }

  // Add the amount to the card balance
  cardBalance += amountToAdd;

  // Update the balance in the HTML
  updateBalance();

  // Clear the input field
  document.getElementById('purchaseAmount').value = '';
}

// Function to pay off the card
function payOffCard() {
  const amountToPay = parseFloat(document.getElementById('payAmount').value);

  // Check if the input value is valid (greater than 0 and a number)
  if (isNaN(amountToPay) || amountToPay <= 0) {
    alert('Please enter a valid amount to pay off.');
    return;
  }

  // Check if the pay-off amount is greater than the current balance
  if (amountToPay > cardBalance) {
    alert('You cannot pay more than your current balance.');
    return;
  }

  // Subtract the payment from the card balance
  cardBalance -= amountToPay;

  // Update the balance in the HTML
  updateBalance();

  // Clear the input field
  document.getElementById('payAmount').value = '';
}
