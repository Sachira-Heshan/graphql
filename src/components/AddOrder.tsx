import { useState, useEffect } from "react";
import { useMutation, gql } from "@apollo/client";

export type AppProps = {
  customerId: number;
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
  mutation MUTATE_DATA(
    $customer: ID!
    $description: String!
    $totalInCents: Int!
  ) {
    createOrder(
      customer: $customer
      description: $description
      totalInCents: $totalInCents
    ) {
      order {
        id
        description
        totalInCents
        customer {
          id
          industry
          name
        }
      }
    }
  }
`;

function AddOrder({ customerId }: AppProps) {
  const [active, setActive] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [cost, setCost] = useState<number>(NaN);
  const [createOrder, { loading, error, data }] = useMutation(MUTATE_DATA, {
    refetchQueries: [{ query: GET_DATA }],
  });

  useEffect(() => {
    if (!data) return;
    console.log(data);
    setDescription("");
    setCost(NaN);
  }, [data]);

  return (
    <>
      {!active ? (
        <button onClick={() => setActive(true)}>+ New Order</button>
      ) : null}
      {active ? (
        <div>
          <form
            id="addOrder"
            onSubmit={(e) => {
              e.preventDefault();
              createOrder({
                variables: {
                  customer: customerId,
                  description: description,
                  totalInCents: cost,
                },
              });
            }}
          >
            <div>
              <label htmlFor="description">Description: </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </div>
            <div>
              <label htmlFor="cost">Cost: </label>
              <input
                type="number"
                id="cost"
                value={isNaN(cost) ? "" : cost}
                onChange={(e) => {
                  setCost(parseFloat(e.target.value));
                }}
              />
            </div>
            <button
              type="submit"
              form="addOrder"
              disabled={loading ? true : false}
            >
              Add Order
            </button>
            {/* {createCustomerError ? <p>Error creating customer!</p> : null} */}
          </form>
          {error ? <p>Something went wrong!</p> : null}
        </div>
      ) : null}
    </>
  );
}

export default AddOrder;
