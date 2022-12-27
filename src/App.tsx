import "./App.css";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useEffect, useState } from "react";

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

const MUTATE_DATA = gql`
  mutation MUTATE_DATA($name: String!, $industry: String!) {
    createCustomer(name: $name, industry: $industry) {
      customer {
        id
        name
        industry
      }
    }
  }
`;

function App() {
  const [name, setName] = useState<string>("");
  const [industry, setIndustry] = useState<string>("");
  const { loading, error, data } = useQuery(GET_DATA);
  const [
    createCustomer,
    {
      loading: createCustomerLoading,
      error: createCustomerError,
      data: createCustomerData,
    },
  ] = useMutation(MUTATE_DATA, {
    refetchQueries: [{ query: GET_DATA }],
  });

  useEffect(() => {
    console.log(loading, error, data);
    console.log(
      createCustomer,
      createCustomerLoading,
      createCustomerError,
      createCustomerData
    );
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
      <form
        id="add"
        onSubmit={(e) => {
          e.preventDefault();
          console.log(name, industry, "submitting...");
          createCustomer({ variables: { name: name, industry: industry } });
          if (!error) {
            setName("");
            setIndustry("");
          }
        }}
      >
        <div>
          <label htmlFor="name">Name: </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div>
          <label htmlFor="industry">Industry: </label>
          <input
            type="text"
            id="industry"
            value={industry}
            onChange={(e) => {
              setIndustry(e.target.value);
            }}
          />
        </div>
        <button
          type="submit"
          form="add"
          disabled={createCustomerLoading ? true : false}
        >
          Add
        </button>
        {createCustomerError ? <p>Error creating customer!</p> : null}
      </form>
    </div>
  );
}

export default App;
