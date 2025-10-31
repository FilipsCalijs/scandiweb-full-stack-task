import React from "react";
import { gql, useQuery } from "@apollo/client";

import Header from "../components/Header/Header";
import Card from "../components/Сard";

const GET_PRODUCTS = gql`
  query {
    products {
      id
      name
      inStock
      gallery
      category
      attributes {
        id
        name
        type
        items {
          displayValue
          value
          id
        }
      }
      prices {
        amount
        currency {
          symbol
        }
      }
    }
  }
`;

function Home() {
  const { loading, error, data } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "no-cache",
  });

  if (loading) return <p className="text-center mt-20 text-xl">Loading...</p>;
  if (error)
    return (
      <p className="text-center mt-20 text-red-500">
        Error: {error.message}
      </p>
    );

  return (
    <>
      <Header activeCategory="all" />
      <section className="w-full">
        <div className="w-full h-40 flex items-center">
          <p className="text-[42px] ml-24 text-[#1D1F22]">ALL</p>
        </div>

        <div className="w-full flex justify-center items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-16">
            {data.products.map((product, index) => (
              <Card key={index} data={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
