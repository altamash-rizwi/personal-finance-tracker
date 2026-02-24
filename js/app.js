document.addEventListener("DOMContentLoaded", function () {

    const descriptionInput = document.getElementById("description");
    const amountInput = document.getElementById("amount");
    const typeSelect = document.getElementById("type");
    const addBtn = document.getElementById("add-btn");
    const transactionList = document.getElementById("transaction-list");

    const totalIncomeEl = document.getElementById("total-income");
    const totalExpenseEl = document.getElementById("total-expense");
    const balanceEl = document.getElementById("balance");
    const ctx = document.getElementById("financeChart")?.getContext("2d");
let financeChart;

    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    function saveToLocalStorage() {
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }

    function updateUI() {

        if (!transactionList) {
            console.error("transaction-list not found in DOM");
            return;
        }

        transactionList.innerHTML = "";

        let income = 0;
        let expense = 0;

        transactions.forEach((t, index) => {

            if (t.type === "income") income += t.amount;
            else expense += t.amount;

            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";

            li.innerHTML = `
                <span>${t.description}</span>
                <div>
                    <span class="${t.type === "income" ? "text-success" : "text-danger"}">
                        ₹ ${t.amount}
                    </span>
                    <button class="btn btn-sm btn-danger ms-3">X</button>
                </div>
            `;

            li.querySelector("button").addEventListener("click", function () {
                deleteTransaction(index);
            });

            transactionList.appendChild(li);
        });

        totalIncomeEl.textContent = income;
        totalExpenseEl.textContent = expense;
        balanceEl.textContent = income - expense;
        if (!ctx) return;
        if (financeChart) {
            financeChart.destroy();
        }

        financeChart = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: ["Income", "Expense"],
                datasets: [{
                    data: [income, expense],
                    backgroundColor: ["#28a745", "#dc3545"]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "bottom"
                    }
                }
            }
        });
    }

    function addTransaction() {
        const description = descriptionInput.value.trim();
        const amount = parseFloat(amountInput.value);
        const type = typeSelect.value;

        if (!description || isNaN(amount) || amount <= 0) {
            alert("Enter valid details");
            return;
        }

        transactions.push({ description, amount, type });

        saveToLocalStorage();
        updateUI();

        descriptionInput.value = "";
        amountInput.value = "";
    }

    function deleteTransaction(index) {
        transactions.splice(index, 1);
        saveToLocalStorage();
        updateUI();
    }

    addBtn.addEventListener("click", addTransaction);

    updateUI();
});