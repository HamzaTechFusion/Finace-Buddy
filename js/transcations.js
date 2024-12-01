document.addEventListener("DOMContentLoaded", () => {
    function renderTransactions() {
        const transactionsTable = document.getElementById("transactionsTable");
        const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

        // Clear existing rows
        transactionsTable.innerHTML = "";

        // Add header row
        const headerRow = document.createElement("tr");
        headerRow.innerHTML = `
            <th>Date</th>
            <th>Type</th>
            <th>From Account</th>
            <th>To Account</th>
            <th>Amount</th>
        `;
        transactionsTable.appendChild(headerRow);

        // Add transaction rows
        transactions.forEach((transaction) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${new Date(transaction.date).toLocaleString()}</td>
                <td>${transaction.type}</td>
                <td>${transaction.fromAccount}</td>
                <td>${transaction.toAccount}</td>
                <td>$ ${parseFloat(transaction.amount).toFixed(2)}</td>
            `;
            transactionsTable.appendChild(row);
        });
    }

    renderTransactions();
});
