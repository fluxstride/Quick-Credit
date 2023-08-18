let baseUrl = new URL("https://qc-ctdn.onrender.com/");

export async function fetchTableData() {
  let response = await fetch(baseUrl + "db");
  return response.json();
}

export function confirmAction(user, type) {
  let linkPath;
  let requestBody;
  switch (type) {
    case "verify":
      linkPath = `users/${user.id}`;
      requestBody = { status: "Verified" };
      break;
    case "revert":
      linkPath = `users/${user.id}`;
      requestBody = { status: "Unverified" };
      break;
    case "approve":
      linkPath = `loan-applications/${user.id}`;
      requestBody = { status: "Approved" };
      break;
    case "reject":
      linkPath = `loan-applications/${user.id}`;
      requestBody = { status: "Rejected" };
      break;
    default:
      break;
  }

  return fetch(baseUrl + linkPath, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
}

export function postRepayment(repayment) {
  return fetch(baseUrl + "repayment-history", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(repayment),
  });
}

export function createLoanOffer(offer) {
  return fetch(baseUrl + "loan-offers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(offer),
  });
}

export async function getLoanOffers() {
  let response = await fetch(baseUrl + "loan-offers");
  if (response.ok) return response.json();
  throw new Error("Status code error :" + res.status);
}

export function editLoanOffer(id, data) {
  return fetch(baseUrl + "loan-offers/" + id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...data }),
  });
}

export function deleteLoanOffer(id) {
  return fetch(baseUrl + "loan-offers/" + id, {
    method: "DELETE",
  });
}
