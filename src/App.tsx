import "./App.css";
import { useQuery, gql } from "@apollo/client";
import { useEffect } from "react";

export type Customer = {
  id: number;
  name: string;
  industry: string;
};

const GET_DATA = gql`
  {
    customers {
      id
      name
      industry
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(GET_DATA);

  useEffect(() => {
    console.log(loading, error, data);
  });

  return (
    <div className="App">
      {loading ? <p>Loading...</p> : null}
      {error ? <p>Something went wrong!</p> : null}
      {data
        ? data.customers.map((customer: Customer) => {
            return (
              <p key={customer.name}>
                {customer.name + " -> " + customer.industry}
              </p>
            );
          })
        : null}
    </div>
  );
}

export default App;
