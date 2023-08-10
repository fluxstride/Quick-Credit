import data from "../assets/data.json" assert { type: "json" };

// display data count on admin dashboard
let users = document.querySelectorAll(".actions .users p")[1];
users && (users.innerText = data.users.length);

let loan_applications = document.querySelectorAll(
  ".actions .loan-applications p"
)[1];
loan_applications &&
  (loan_applications.innerText = data.loan_applications.length);

let loans = document.querySelectorAll(".actions .loans p")[1];
loans && (loans.innerText = data.loans.length);

let data_table = document.querySelector(".data");
let data_to_display = data_table && data_table.dataset["table"];
let data_role = data_table && data_table.dataset["role"];
let table_data = data[data_to_display];

/**
 *  Password show and hide logic
 */
const password_show_btn = document.querySelector(".password-show");
const password = document.querySelector(".password input");

password_show_btn?.addEventListener("click", (e) => {
  const isHidden = password.type === "password";
  e.target.src = isHidden
    ? "./assets/images/eye-off.svg"
    : "./assets/images/eye-on.svg";
  password.type = isHidden ? "text" : "password";
});

// login logic
let login_form = document.querySelector("form#login");
login_form?.addEventListener("submit", (e) => {
  e.preventDefault();
  let email = e.target.querySelectorAll("input")[0].value;
  let password = e.target.querySelectorAll("input")[1].value;
  if (email === "admin@qc.com" && password === "qcadmin")
    window.location.href = "./admin.html";

  if (email === "user@qc.com" && password === "qcuser")
    window.location.href = "./user.html";
});

// go back button logic
let go_back_btn = document.querySelector(".go-back");
go_back_btn?.addEventListener("click", () => {
  history.back();
});

// Pagination variables
let active_page = 1;
let rows_per_page = 10;

let table_pagination = document.querySelector(".table-pagination");
let rows_per_page_element = table_pagination?.querySelector("select");
let pagination_buttons = table_pagination?.querySelectorAll("button");
let prev_button = table_pagination?.querySelector("#prev");
let next_button = table_pagination?.querySelector("#next");

rows_per_page_element?.addEventListener(
  "change",
  (e) => (
    (rows_per_page = e.target.value * 1),
    (active_page = 1),
    generateTable(table_data)
  )
);

pagination_buttons?.forEach((button) =>
  button.addEventListener(
    "click",
    () => (
      button.id === "next" ? (active_page += 1) : (active_page -= 1),
      generateTable(table_data)
    )
  )
);

// Table search logic
let search_input = document.querySelector(".search input");

search_input?.addEventListener("keyup", ({ target: { value } }) => {
  table_data = data[data_to_display].filter((item) => {
    return (
      item["Email"].toLowerCase().includes(value.toLowerCase()) ||
      item["First Name"].toLowerCase().includes(value.toLowerCase()) ||
      item["Last Name"].toLowerCase().includes(value.toLowerCase())
    );
  });
  active_page = 1;
  generateTable(table_data);
});

search_input?.addEventListener("focus", (e) => {
  search_input.parentElement.style.border = "2px solid var(--lemon-green)";
});

search_input?.addEventListener("focusout", (e) => {
  search_input.parentNode.style.border = "2px solid #bfc8cc";
});

/**
 * Table tabs switching logic
 */

let page_table_tabs = {
  loans: ["Active", "Paid"],
  users: ["All", "Unverified", "Verified"],
  loan_applications: ["Pending", "Approved", "Rejected"],
};
let active_table = document.querySelector(".table-tabs")?.dataset["tab"];
let active_tab = active_table && page_table_tabs[active_table][0];
let table_tabs = document.querySelector(".table-tabs");
let tabs = table_tabs?.querySelectorAll(".tab");

tabs?.forEach((tab) => {
  tab.addEventListener("click", () => {
    if (tab.className.includes("tab--active")) {
      return;
    }

    tab.classList.add("tab--active"), (active_tab = tab.innerText);

    tabs.forEach(
      (tab) =>
        tab.innerText !== active_tab && tab.classList.remove("tab--active")
    );

    active_page = 1;
    rows_per_page = 10;
    rows_per_page_element.value = 10;
    table_data = data[data_to_display];
    search_input && (search_input.value = "");
    generateTable(table_data);
  });
});

/**
 * Table generation logic
 */

function generateTable(table_data) {
  let thead = data_table.querySelector("table thead");
  let tbody = data_table.querySelector("table tbody");

  // clear the existing table data
  (thead.innerHTML = ""), (tbody.innerHTML = "");

  if (active_tab) {
    if (!active_tab === "All") {
      table_data = table_data?.filter((data) => data["Status"] === active_tab);
    }
  }

  let dataCount = table_data.length;
  let totalPages = Math.ceil(dataCount / rows_per_page);
  let calculatedRows = table_data.slice(
    (active_page - 1) * rows_per_page,
    active_page * rows_per_page
  );

  let beginning = active_page === 1 ? 1 : rows_per_page * (active_page - 1) + 1;
  let end =
    active_page === totalPages ? dataCount : beginning + rows_per_page - 1;

  table_pagination.style.visibility = dataCount <= 5 ? "hidden" : "visible";

  if (table_pagination.style.visibility === "visible") {
    prev_button.disabled = active_page === 1;
    prev_button.disabled
      ? (prev_button.style.opacity = ".5")
      : (prev_button.style.opacity = "1");

    next_button.disabled = active_page === totalPages;
    next_button.disabled
      ? (next_button.style.opacity = ".5")
      : (next_button.style.opacity = "1");

    let page = table_pagination.querySelector(".page");
    page.innerText = `${beginning}-${end} of Page ${active_page}`;
  }

  let tr = document.createElement("tr");
  let table_headings = Object.keys(data[data_to_display][0]);
  table_headings.forEach((heading) => {
    let th;
    switch (heading) {
      case "Phone Number":
        th = `<th style="max-width:20ch">${heading}</th>`;
        break;
      case "Home Address":
      case "Work Address":
        th = `<th style="max-width:30ch">${heading}</th>`;
        break;
      default:
        th = `<th>${heading}</th>`;
        break;
    }
    tr.innerHTML += th;
  });

  thead.append(tr);

  if (table_data.length) {
    calculatedRows.forEach((row) => {
      tr = document.createElement("tr");
      let index = 0;

      for (let [key, value] of Object.entries(row)) {
        let td = `<td>${value}</td>`;
        tr.innerHTML += td;

        if (index === Object.keys(row).length - 1) {
          if (data_to_display === "loans") {
            td = `<td style="width:20ch"><a href="./repayment-history.html">repayment history</a></td>`;
            tr.innerHTML += td;
          }

          if (data_to_display === "users") {
            if (active_tab === "All") {
              if (row.Status === "Unverified") {
                td = `
                <td>
                  <div class="admin-actions">
                    <div class="admin-action accept">
                      <span>Verify</span>
                      <img src="./assets/images/check_.svg" alt="" />
                    </div>
                    <div class="admin-action decline">
                      <span>Decline</span>
                      <img src="./assets/images/model_x.svg" alt="" />
                    </div>
                  </div>
                </td>
                `;
              } else if (row.Status === "Verified") {
                td = `
                <td>
                  <div class="admin-actions" >
                    <div class="admin-action decline">
                      <span>Revert</span>
                      <img src="./assets/images/model_x.svg" alt="" />
                    </div>
                  </div>
                </td>
                `;
              }

              tr.innerHTML += td;
              tbody.append(tr);

              return;
            }

            if (active_tab === "Unverified") {
              console.log(value);
              td = ` 
            <td>
              <div class="admin-actions">
                <div class="admin-action accept">
                  <span>Verify</span>
                  <img src="./assets/images/check_.svg" alt="" />
                </div>
                <div class="admin-action decline">
                  <span>Decline</span>
                  <img src="./assets/images/model_x.svg" alt="" />
                </div>
              </div>
            </td>
            `;
            } else {
              td = `
            <td>
              <div class="admin-actions" >
                <div class="admin-action decline" style="margin:0 auto;">
                  <span>Revert</span>
                  <img src="./assets/images/model_x.svg" alt="" />
                </div>
              </div>
            </td>
            `;
            }

            tr.innerHTML += td;
          }

          if (
            data_to_display === "loan_applications" &&
            active_tab === "Pending"
          ) {
            td = ` 
            <td>
              <div class="admin-actions">
                <div class="admin-action accept">
                  <span>Approve</span>
                  <img src="./assets/images/check_.svg" alt="" />
                </div>
                <div class="admin-action decline">
                  <span>Reject</span>
                  <img src="./assets/images/model_x.svg" alt="" />
                </div>
              </div>
            </td>
            `;

            tr.innerHTML += td;
          }

          if (
            data_to_display === "loans" &&
            data_role === "admin" &&
            active_tab === "Active"
          ) {
            td = ` 
            <td>
              <div class="admin-actions">
                <div class="admin-action post-repayment">
                  <span>Post repayment</span>
                  <img src="./assets/images/check_.svg" alt="" />
                </div>
              </div>
            </td>
            `;

            tr.innerHTML += td;
          }
        }
        index++;
      }

      tbody.append(tr);
    });
  }
}

data_table && generateTable(table_data);

// post repayment logic
const modal_backdrop = document.querySelector(".backdrop");
const modal_close = document.querySelector(".backdrop .close");
const post_repayment_btn = document.querySelector(
  ".admin-actions .post-repayment"
);

function showModal() {
  modal_backdrop.style.display = "grid";
}
function closeModal() {
  modal_backdrop.style.display = "none";
}
modal_close?.addEventListener("click", closeModal);

modal_backdrop?.addEventListener("click", function (e) {
  if (e.target === e.currentTarget) {
    closeModal();
  }
});

post_repayment_btn?.addEventListener("click", showModal);

// request loan
let loan_request_form = document.querySelector("#request-loan > form");

loan_request_form?.addEventListener("submit", (e) => {
  e.preventDefault();
  let loan_amount = loan_request_form.querySelectorAll("select")[0];
  let loan_tenor = loan_request_form.querySelectorAll("select")[1];
  let reason = loan_request_form.querySelector("textarea");
  showModal();
  loan_amount.value = "";
  loan_tenor.value = "";
  reason.value = "";
});
