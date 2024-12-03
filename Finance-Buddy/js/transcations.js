document.addEventListener("DOMContentLoaded", () => {
    const transactionsTable = document.getElementById("transactionsTable");
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    function renderTransactions() {
        transactionsTable.innerHTML = `
            <tr>
                <th>Date</th>
                <th>Type</th>
                <th>From Account</th>
                <th>To Account</th>
                <th>Amount</th>
            </tr>
        `;

        transactions.forEach((transaction) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${new Date(transaction.date).toLocaleString()}</td>
                <td>${transaction.type}</td>
                <td>${transaction.fromAccount}</td>
                <td>${transaction.toAccount}</td>
                <td>$${parseFloat(transaction.amount).toFixed(2)}</td>
            `;
            transactionsTable.appendChild(row);
        });
    }

    renderTransactions();
});
