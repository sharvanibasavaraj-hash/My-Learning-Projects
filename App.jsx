import { useState, useEffect } from "react";

const categories = ["Food", "Travel", "Shopping", "Education", "Entertainment", "Other"];

function App() {
  const [expenses, setExpenses] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("expenses")) || [];
    } catch {
      return [];
    }
  });

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(new Date().toLocaleDateString("en-CA"));
  const [budget, setBudget] = useState(10000);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  function addExpense(e) {
    e.preventDefault();

    if (!name.trim() || Number(amount) <= 0 || !date) {
      alert("Enter valid expense details.");
      return;
    }

    const newExpense = {
      id: Date.now(),
      name: name.trim(),
      amount: Number(amount),
      category,
      date,
    };

    setExpenses((previous) => [newExpense, ...previous]);
    setName("");
    setAmount("");
    setCategory("Food");
    setDate(new Date().toLocaleDateString("en-CA"));
  }

  function deleteExpense(id) {
    setExpenses((previous) =>
      previous.filter((expense) => expense.id !== id)
    );
  }

  const currentMonth = new Date().toISOString().slice(0, 7);

  const monthlyExpenses = expenses.filter(
    (expense) => expense.date.slice(0, 7) === currentMonth
  );

  const total = monthlyExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const remaining = budget - total;

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      filter === "All" || expense.category === filter;

    return matchesSearch && matchesCategory;
  });

  const categoryTotals = categories.map((item) => ({
    name: item,
    amount: monthlyExpenses
      .filter((expense) => expense.category === item)
      .reduce((sum, expense) => sum + expense.amount, 0),
  }));

  const styles = {
    app: {
      minHeight: "100vh",
      background: "#f4f6fb",
      padding: "30px 16px",
      fontFamily: "Arial, sans-serif",
      color: "#202438",
    },
    container: {
      maxWidth: "1000px",
      margin: "auto",
    },
    card: {
      background: "white",
      padding: "22px",
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    },
    input: {
      width: "100%",
      padding: "11px",
      border: "1px solid #d9deea",
      borderRadius: "7px",
      boxSizing: "border-box",
      fontSize: "14px",
    },
    button: {
      padding: "11px 18px",
      background: "#5146e5",
      color: "white",
      border: "none",
      borderRadius: "7px",
      cursor: "pointer",
      fontWeight: "bold",
    },
  };

  return (
    <div style={styles.app}>
      <main style={styles.container}>
        <header style={{ marginBottom: "25px" }}>
          <h1>Student Expense Tracker</h1>
          <p style={{ color: "#777" }}>
            Manage your daily expenses and budget.
          </p>
        </header>

        <section style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
          {[
            ["Monthly Expenses", total],
            ["Remaining Budget", remaining],
            ["Transactions", monthlyExpenses.length],
          ].map(([title, value]) => (
            <div key={title} style={{ ...styles.card, flex: "1 1 200px" }}>
              <p style={{ color: "#777" }}>{title}</p>
              <h2 style={{ color: "#5146e5" }}>
                {title === "Transactions"
                  ? value
                  : `₹${value.toLocaleString("en-IN")}`}
              </h2>
            </div>
          ))}
        </section>

        <section style={{ ...styles.card, marginTop: "20px" }}>
          <h3>Monthly Budget</h3>
          <input
            style={styles.input}
            type="number"
            min="0"
            value={budget}
            onChange={(e) =>
              setBudget(Math.max(0, Number(e.target.value)))
            }
          />

          <div style={{
            height: "10px",
            background: "#eee",
            borderRadius: "10px",
            marginTop: "15px",
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              width: `${budget > 0 ? Math.min((total / budget) * 100, 100) : 0}%`,
              background: total > budget ? "#dc3545" : "#5146e5",
            }} />
          </div>

          <p style={{ color: "#777", fontSize: "13px" }}>
            {budget > 0
              ? `${Math.round((total / budget) * 100)}% of budget used`
              : "Enter a budget to see progress."}
          </p>
        </section>

        <section style={{ ...styles.card, marginTop: "20px" }}>
          <h3>Add New Expense</h3>

          <form onSubmit={addExpense} style={{ display: "grid", gap: "14px" }}>
            <input
              style={styles.input}
              placeholder="Expense name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              style={styles.input}
              type="number"
              min="1"
              placeholder="Amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            <select
              style={styles.input}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>

            <input
              style={styles.input}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            <button style={styles.button} type="submit">
              + Add Expense
            </button>
          </form>
        </section>

        <section style={{ ...styles.card, marginTop: "20px" }}>
          <h3>Spending by Category</h3>

          {categoryTotals.every((item) => item.amount === 0) ? (
            <p style={{ color: "#777" }}>No expenses recorded this month.</p>
          ) : (
            categoryTotals
              .filter((item) => item.amount > 0)
              .map((item) => (
                <div key={item.name} style={{ marginBottom: "15px" }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}>
                    <span>{item.name}</span>
                    <strong>₹{item.amount}</strong>
                  </div>

                  <div style={{
                    height: "8px",
                    background: "#eee",
                    borderRadius: "10px",
                    marginTop: "6px",
                  }}>
                    <div style={{
                      height: "100%",
                      width: `${(item.amount / total) * 100}%`,
                      background: "#5146e5",
                      borderRadius: "10px",
                    }} />
                  </div>
                </div>
              ))
          )}
        </section>

        <section style={{ ...styles.card, marginTop: "20px" }}>
          <h3>Expense History</h3>

          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "15px",
          }}>
            <input
              style={{ ...styles.input, flex: "1 1 180px" }}
              placeholder="Search expenses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              style={{ ...styles.input, flex: "1 1 150px" }}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>

          {filteredExpenses.length === 0 ? (
            <p style={{ color: "#777" }}>No matching expenses found.</p>
          ) : (
            filteredExpenses.map((expense) => (
              <div key={expense.id} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
                padding: "14px 0",
                borderBottom: "1px solid #eee",
              }}>
                <div>
                  <strong>{expense.name}</strong>
                  <p style={{ color: "#777", fontSize: "13px" }}>
                    {expense.category} · {expense.date}
                  </p>
                </div>

                <div style={{ textAlign: "right" }}>
                  <strong>₹{expense.amount.toLocaleString("en-IN")}</strong>
                  <br />
                  <button
                    onClick={() => deleteExpense(expense.id)}
                    style={{
                      border: "none",
                      background: "none",
                      color: "#dc3545",
                      cursor: "pointer",
                      marginTop: "5px",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </section>

        <p style={{ textAlign: "center", color: "#999", marginTop: "25px" }}>
          Student Expense Tracker · Built with React
        </p>
      </main>
    </div>
  );
}

export default App;