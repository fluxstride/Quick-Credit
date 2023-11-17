const createLoanOffersTable = `
  CREATE TABLE IF NOT EXISTS loan_offers (
    offer_id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    amount INT NOT NULL,
    interest_rate INT NOT NULL,
    tenor INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL
  )
`;

const dropLoanOffersTable = `
  DROP TABLE IF EXIST user;
`;

export { createLoanOffersTable, dropLoanOffersTable };
