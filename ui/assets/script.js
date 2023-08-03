let data;

const password_show_btn = document.querySelector(".password-show");
const password = document.querySelector(".password input");

/**
 *  Password show and hide logic
 */

if (password_show_btn) {
  let show_password = false;

  password_show_btn.addEventListener("click", (e) => {
    e.ta.src = show_password
      ? "./assets/images/eye-on.svg"
      : "./assets/images/eye-off.svg";
    password.type = !show_password ? "text" : "password";
    show_password = !show_password;
  });
}

// Pagination variables
let active_page = 1,
  rows_per_page = 10;

let table_pagination = document.querySelector(".table-pagination");

let rows_per_page_elem, pagination_buttons, prev_button, next_button;

if (table_pagination) {
  rows_per_page_elem = table_pagination.querySelector("select");
  pagination_buttons = table_pagination.querySelectorAll("button");
  prev_button = table_pagination.querySelector("#prev");
  next_button = table_pagination.querySelector("#next");

  rows_per_page_elem.addEventListener(
    "change",
    (e) => (
      (rows_per_page = e.target.value * 1), (active_page = 1), generateTable()
    )
  );

  pagination_buttons.forEach((button) =>
    button.addEventListener(
      "click",
      () => (
        button.id === "next" ? (active_page += 1) : (active_page -= 1),
        generateTable()
      )
    )
  );
}

/**
 * Table tabs switching logic
 */

let table_tabs = document.querySelector(".table-tabs");
let active_tab;

if (table_tabs) {
  let page_table_tabs = {
    loans: ["Active", "Paid"],
  };

  let active_table = document.querySelector(".table-tabs").dataset["tab"];
  active_tab = page_table_tabs[active_table][0];

  let tabs = table_tabs.querySelectorAll(".tab");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      if (tab.className.includes("tab--active")) {
        return;
      }

      tab.classList.add("tab--active"), (active_tab = tab.innerText);

      tabs.forEach(
        (tab) =>
          tab.innerText !== active_tab && tab.classList.remove("tab--active")
      );

      (active_page = 1), (rows_per_page = 10), (rows_per_page_elem.value = 10);
      generateTable();
    });
  });
}

/**
 * Table generation logic
 */
let data_table = document.querySelector(".data");

function generateTable() {
  let count, totalPages, calculatedRows;

  let thead = data_table && data_table.querySelector("table thead");
  let tbody = data_table && data_table.querySelector("table tbody");

  (thead.innerHTML = ""), (tbody.innerHTML = "");

  let table_to_display = data_table.dataset["table"];

  let table_data = data[table_to_display];

  if (table_to_display === "loans") {
    table_data = table_data.filter((data) => data["Status"] === active_tab);
  }

  count = table_data.length;
  totalPages = Math.ceil(count / rows_per_page);
  calculatedRows = table_data.slice(
    (active_page - 1) * rows_per_page,
    active_page * rows_per_page
  );

  let beginning = active_page === 1 ? 1 : rows_per_page * (active_page - 1) + 1;
  let end = active_page === totalPages ? count : beginning + rows_per_page - 1;

  table_pagination.style.visibility = count <= 5 ? "hidden" : "visible";

  if (table_pagination.style.visibility === "visible") {
    prev_button.disabled = active_page === 1;

    next_button.disabled =
      active_page === Math.ceil((totalPages * rows_per_page) / rows_per_page);

    let page = table_pagination.querySelector(".page");
    page.innerText = `${beginning}-${end} of Page ${active_page}`;
  }

  let tr = document.createElement("tr");

  let table_headings = Object.keys(table_data[0]);

  table_headings.forEach((heading) => {
    let th = document.createElement("th");
    th.innerText = heading;
    tr.append(th);
  });

  thead.appendChild(tr);

  calculatedRows.forEach((data) => {
    tr = document.createElement("tr");
    let td;
    let index = 0;

    for (let [, value] of Object.entries(data)) {
      td = document.createElement("td");
      td.innerText = value;
      tr.appendChild(td);

      if (index === Object.keys(data).length - 1) {
        if (table_to_display !== "loans") {
          continue;
        }
        td = document.createElement("td");
        let history_link = document.createElement("a");
        // history_link.setAttribute("href", "#");
        history_link.innerText = "repayment history";
        td.appendChild(history_link);
        td.style.width = "20ch";
        tr.appendChild(td);
      }
      index++;
    }

    tbody.appendChild(tr);
  });
}

async function fetchData() {
  let res = await fetch("./assets/data.json");
  data = await res.json();
  generateTable();
}

data_table && window.addEventListener("load", fetchData);
