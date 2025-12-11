import React from "react";
import Cart from "../Cart/Cart";
import { gql } from "@apollo/client";
import client from "../../apolloClient";
import "./header.css";

const GET_CATEGORIES = gql`
  query {
    categories {
      name
    }
  }
`;

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCartOpen: false,
      isMenuOpen: false,
      categories: [], 
      loading: true,
      error: null,
    };
  }

  toggleCart = () => {
    this.setState(
      (prev) => ({ isCartOpen: !prev.isCartOpen }),
      () => {
        document.body.style.overflow = this.state.isCartOpen ? "hidden" : "";
      }
    );
  };

  toggleMenu = () => {
    this.setState((prev) => ({ isMenuOpen: !prev.isMenuOpen }));
  };

  handleOutsideClick = (event) => {
    if (this.cartRef && !this.cartRef.contains(event.target)) {
      this.closeCart();
    }
  };

  closeCart = () => {
    this.setState({ isCartOpen: false });
    document.body.style.overflow = "";
  };

  componentDidMount() {
    document.addEventListener("click", this.handleOutsideClick);
    this.fetchCategories();

    window.addEventListener("storage", (event) => {
      if (event.key === "openCart" && event.newValue === "true") {
        this.setState({ isCartOpen: true }, () => {
          document.body.style.overflow = "hidden";
        });
        localStorage.removeItem("openCart");
      }
    });
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleOutsideClick);
  }

  fetchCategories = async () => {
    try {
    
      const res = await client.query({ query: GET_CATEGORIES, fetchPolicy: "no-cache" });
    
      this.setState({ categories: res.data.categories, loading: false });
    } catch (err) {
      console.error('❌ Error fetching categories:', err);
      this.setState({ error: err, loading: false });
    }
  };

  render() {
    const { isCartOpen, isMenuOpen, categories, loading, error } = this.state;


    if (error) return <div>Error: {error.message}</div>;

    const currentPath = window.location.pathname.split("/")[1];

    return (
      <header className="w-full h-20 flex items-center justify-between px-6 sm:px-12 bg-white relative z-[1000] header">

        <div className="menu-btn-mobile flex items-center gap-4 md:hidden">
          <button onClick={this.toggleMenu} className="focus:outline-none menu-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-[#1d1f22] menu-icon">
              <path strokeLinecap="round" strokeLinejoin="round" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"} />
            </svg>
          </button>
        </div>

        <ul className={`nav-list ${isMenuOpen ? "nav-open" : ""} absolute md:flex left-0 top-20 w-full bg-white flex-col md:flex-row gap-6 items-center p-6 md:static md:w-auto md:bg-transparent md:p-0 md:gap-10 border-b md:border-none`}>
          {categories.map((cat) => {
            const path = `/${cat.name.toLowerCase()}`;
            const isActive = currentPath === cat.name.toLowerCase();
            return (
              <li key={path} className={isActive ? "active" : ""}>
                <a
                  href={path}
                  data-testid={isActive ? "active-category-link" : "category-link"}
                  onClick={() => this.setState({ isMenuOpen: false })}
                  className="nav-link text-[#1d1f22] text-lg md:text-base no-underline"
                >
                  {cat.name.toUpperCase()}
                </a>
              </li>
            );
          })}
        </ul>

        <a href="/" className="logo-link absolute left-1/2 -translate-x-1/2 md:static">
          <img className="w-9 md:w-auto logo" src="/logo.svg" alt="logo" />
        </a>

        <div className="relative cart-wrapper" ref={(n) => { this.cartRef = n; }}>
          <Cart isCartOpen={isCartOpen} toggleCart={this.toggleCart} closeCart={this.closeCart} />
        </div>

      </header>
    );
  }
}

export default Header;
