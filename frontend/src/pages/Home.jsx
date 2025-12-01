import React from "react";
import { gql } from "@apollo/client";
import client from "../apolloClient";

import Header from "../components/Header/Header";
import Card from "../components/Card";

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

class Home extends React.Component {
  state = {
    loading: true,
    error: null,
    data: null,
  };

  async componentDidMount() {
    try {
      const { data } = await client.query({
        query: GET_PRODUCTS,
        fetchPolicy: "no-cache",
      });

      this.setState({ data, loading: false });
    } catch (error) {
      this.setState({ error, loading: false });
    }
  }

  render() {
    const { loading, error, data } = this.state;

    if (loading) {
      return (
        <>
          <Header activeCategory="all" />
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </>
      );
    }

    if (error) {
      return (
        <>
          <Header activeCategory="all" />
          <div className="flex justify-center items-center min-h-[60vh] text-red-500 text-xl">
            Error: {error.message}
          </div>
        </>
      );
    }

    return (
      <>
        <Header activeCategory="all" />

        <section className="w-full">
          <div className="w-full h-40 flex items-center">
            <p className="text-[42px] ml-24 text-[#1D1F22]">ALL</p>
          </div>

          <div className="w-full flex justify-center items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-16">
              {data.products.map((product) => (
                <Card key={product.id} data={product} />
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }
}

export default Home;
