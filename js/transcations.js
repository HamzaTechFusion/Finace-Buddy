document.addEventListener("DOMContentLoaded", () => {
    const transactionsTable = document.getElementById("transactionHistory");
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    function renderTransactions() {
        transactionsTable.innerHTML = "";
        if (transactions.length === 0) {
            transactionsTable.innerHTML = "<tr><td colspan='5'>No transactions found.</td></tr>";
            return;
        }

        transactions.forEach((transaction) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${new Date(transaction.date).toLocaleString()}</td>
                <td>${transaction.type}</td>
                <td>${transaction.fromAccount || "-"}</td>
                <td>${transaction.toAccount || "-"}</td>
                <td>$${transaction.amount.toFixed(2)}</td>
            `;
            transactionsTable.appendChild(row);
        });
    }

    renderTransactions();
});
