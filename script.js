// Exercise 3 - Expense Tracker
// Write all your code in this file. Read README.md for the full instructions.
// Run the tests with: npm test

// One expense in the array looks like this:
// { id: 1, desc: "Pizza", amount: 42.5, category: "food" }
// Step 1: add an expense on submit (unique id, no reload, validation messages, clear desc + amount, focus desc)
const form = document.querySelector("#expense-form")
const desc = document.querySelector("#desc")
const amount = document.querySelector("#amount")
const category = document.querySelector("#category")
const submit_btn = document.querySelector("#submit")
const form_error = document.querySelector("#form-error")
const rowsContainer = document.querySelector("#rows");

let currentId = 1;
let expenses = [];

form.addEventListener("submit", addExpense)

function addExpense(e) {
    if (e) e.preventDefault();
    const descValue = desc.value.trim();
    const amountValue = amount.value.trim();
    if (descValue == "") {
        form_error.textContent = "Please add a description"
        form_error.hidden = false
    }
    else if (Number(amountValue) <= 0 || amountValue == "") {
        form_error.textContent = "The amount must be larger than 0"
        form_error.hidden = false
    }
    else {
        const obj = { id: currentId++, desc: descValue, amount: Number(amountValue), category: category.value }
        form_error.hidden = true
        expenses.push(obj)
        desc.value = ""
        amount.value = ""
        desc.focus()
        render()
    }

}


const no_rows = document.querySelector("#no-rows")
function render() {
    const filterValue = filter ? filter.value : "all";

    let filteredExpenses = expenses.filter(expense => {
        if (filterValue === "all" || filterValue === "") return true;
        return expense.category === filterValue;
    });
    if (filteredExpenses.length <= 0) {
        no_rows.hidden = false
        rowsContainer.innerHTML = "";
    }
    else {
        no_rows.hidden = true
        rowsContainer.innerHTML = "";

        if (sortB)
        {filteredExpenses = filteredExpenses.toSorted((a,b)=>b.amount - a.amount)}

        filteredExpenses.forEach(obj => {

            const tr = document.createElement("tr");
            tr.dataset.id = obj.id;
            if (above100(obj))
            {tr.classList.add("big")}

            const delete_btn = document.createElement("button");
            delete_btn.textContent = "Delete";
            delete_btn.dataset.id = obj.id;
            delete_btn.classList.add("delete")

            const category = document.createElement("span")
            category.classList.add("badge")
            category.textContent = obj.category;

            tr.innerHTML = `
            <td>${obj.desc}</td>
            <td></td>
            <td>${obj.amount.toFixed(2)}</td>
            <td></td>
            `;
            
            tr.querySelector("td:nth-child(2)").appendChild(category);
            tr.querySelector("td:last-child").appendChild(delete_btn);
            rowsContainer.appendChild(tr);
        });
    }
        let sum = 0;
        filteredExpenses.forEach(expense => {
            sum += expense.amount;
        });
        total.textContent = sum.toFixed(2);
}

// Step 3: delete (one listener on #rows - event delegation, by data-id)
rowsContainer.addEventListener("click", deleteExpense)
function deleteExpense(e) {
    if (!e.target.classList.contains("delete")) return;
    const id = Number(e.target.dataset.id)
    expenses = expenses.filter((expense) => { if (expense.id != id) return true })
    render()
}
// Step 4: total of the expenses that are shown
const total = document.querySelector("#total")
// Step 5: filter by category
const filter = document.querySelector("#filter")

filter.addEventListener("change",render)

// Step 6: sort by amount (toSorted - the original array keeps its order)
const sort_btn = document.querySelector("#sort-btn")
sort_btn.addEventListener("click", sort)
let sortB = false

function sort(e){
if (!sortB) {
  sort_btn.textContent = "Sort by amount: on";
  sortB = true
} else {
  sort_btn.textContent = "Sort by amount: off";
  sortB = false
}   
 render()
}

// Step 7: rows with an amount above 100 get the class "big"
function above100(obj){
    if (obj.amount>100)
    return true
}