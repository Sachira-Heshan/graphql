import "./App.css";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useEffect, useState } from "react";
import AddOrder from "./components/AddOrder";

export type Order = {
  id: number;
  description: string;
  totalInCents: number;
};

export type Customer = {
  id: number;
  name: string;
  industry: string;
  orders: Order[];
};

const GET_DATA = gql`
  {
    customers {
      id
      name
      industry
      orders {
        id
        description
        totalInCents
      }
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
    console.log(createCustomerData);
  });

  return (
    <div className="App">
      <h2>Customers</h2>
      {loading ? <p>Loading...</p> : null}
      {error ? <p>Something went wrong!</p> : null}
      {data
        ? data.customers.map((customer: Customer) => {
            return (
              <div key={customer.id}>
                <h4>{customer.name + " -> " + customer.industry}</h4>
                {customer.orders.map((order: Order) => {
                  return (
                    <div key={order.id}>
                      <p>{order.description}</p>
                      <p>
                        Cost: $
                        {(order.totalInCents / 100).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  );
                })}
                <AddOrder customerId={customer.id} />
              </div>
            );
          })
        : null}
      <h3>Add a customer: </h3>
      <form
        id="add"
        onSubmit={(e) => {
          e.preventDefault();
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
