import React from "react";
import { gql } from "@apollo/client";
import Header from "../components/Header/Header";
import Card from "../components/Card";
import getProductsByCategory from "../utils/getProductsByCategory";

const GET_PRODUCTS = gql`
  query getProductsByCategory($category: String!) {
    productsByCategory(category: $category) {
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
          id
          value
          displayValue
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

class Category extends React.Component {
  render() {
    const { data } = this.props;
    const category = data.productsByCategory[0]?.category || "Category";

    return (
      <>
        <Header activeCategory={category} />

        <section className="w-full">
          <div className="w-full h-40 flex items-center">
            <p className="text-[42px] ml-24 text-[#1D1F22] uppercase">
              {category}
            </p>
          </div>

          <div className="w-full flex justify-center items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-16">
              {data.productsByCategory.map((product, index) => (
                <Card key={product.id || index} data={product} />
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }
}

export default class CategoryWrapper extends React.Component {
  render() {
    const category = window.location.pathname.split("/")[1] || "all";
    const Wrapped = getProductsByCategory(Category, GET_PRODUCTS, category);
    return <Wrapped {...this.props} />;
  }
}
