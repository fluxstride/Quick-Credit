let url = new URL("https://qc-ctdn.onrender.com/");

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

  return fetch(url + linkPath, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
}

export function postRepayment(repayment) {
  return fetch(url + "repayment-history", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(repayment),
  });
}

export function createLoanOffer(offer) {
  return fetch(url + "loan-offers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(offer),
  });
}

export function getLoanOffers() {
  return fetch(url + "loan-offers");
}
export function editLoanOffer(id, data) {
  return fetch(url + "loan-offers/" + id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...data }),
  });
}
export function deleteLoanOffer(id) {
  return fetch(url + "loan-offers/" + id, {
    method: "DELETE",
  });
}
