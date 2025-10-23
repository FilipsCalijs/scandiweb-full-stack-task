import React from "react";
import Header from "../components/Header/Header";
import Card from "../components/Card";

class Category extends React.Component {
  render() {
    //import data from graphl (later)
    const mockProducts = [
      {
        id: 1,
        name: "T-Shirt",
        inStock: true,
        gallery: ["/product1.jpg"],
        category: "clothes",
        price: "$20",
      },
      {
        id: 2,
        name: "Laptop",
        inStock: false,
        gallery: ["/product2.jpg"],
        category: "tech",
        price: "$999",
      },
      {
        id: 3,
        name: "Headphones",
        inStock: true,
        gallery: ["/product3.jpg"],
        category: "tech",
        price: "$59",
      },
    ];


    const currentPath = window.location.pathname.replace("/", "") || "all";

 
    const filteredProducts =
      currentPath === "all"
        ? mockProducts
        : mockProducts.filter((p) => p.category === currentPath);

    return (
      <>
        <Header activeCategory={currentPath} />

        <section className="w-full">
          <div className="w-full h-40 flex items-center">
            <p className="text-[42px] ml-24 text-[#1D1F22] uppercase">
              {currentPath}
            </p>
          </div>

          <div className="w-full flex justify-center items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-16">
              {filteredProducts.map((product) => (
                <Card key={product.id} data={product} />
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }
}

export default Category;
