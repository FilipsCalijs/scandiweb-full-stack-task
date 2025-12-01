import React from "react";
import Cart from "../Cart/Cart";
import "./header.css";

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isCartOpen: false,
      isMenuOpen: false,
    };
  }

  toggleCart = () => {
    this.setState(
      (prev) => ({ isCartOpen: !prev.isCartOpen }),
      () => {
        if (this.state.isCartOpen) {
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.overflow = "";
        }
      }
    );
  };

  toggleMenu = () => {
    this.setState((prev) => ({ isMenuOpen: !prev.isMenuOpen }));
  };

  getCurrentPath() {
    const match = window.location.pathname.match(/[^/]+/);
    return (match && match[0]) || "all";
  }

  get links() {
    return Object.freeze([
      { path: "/all", label: "ALL" },
      { path: "/clothes", label: "CLOTHES" },
      { path: "/tech", label: "TECH" },
    ]);
  }

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

  render() {
    const { isCartOpen, isMenuOpen } = this.state;
    const currentPath = this.getCurrentPath();

    return (
      <header className="w-full h-20 flex items-center justify-between px-6 sm:px-12 bg-white relative z-[60] header">

        <div className="menu-btn-mobile flex items-center gap-4 md:hidden">
          <button onClick={this.toggleMenu} className="focus:outline-none menu-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7 text-[#1d1f22] menu-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                }
              />
            </svg>
          </button>
        </div>

        <ul
          className={`nav-list ${
            isMenuOpen ? "nav-open" : ""
          } absolute md:flex left-0 top-20 w-full bg-white flex-col md:flex-row gap-6 items-center p-6 md:static md:w-auto md:bg-transparent md:p-0 md:gap-10 border-b md:border-none`}
        >
          {this.links.map(({ path, label }) => {
            const isActive = currentPath === label.toLowerCase();

            return (
              <li key={path} className={isActive ? "active" : ""}>
                <a
                  href={path}
                  data-testid={isActive ? "active-category-link" : "category-link"}
                  onClick={() => {
                    this.setState({ isMenuOpen: false });
                  }}
                  className="nav-link text-[#1d1f22] text-lg md:text-base no-underline"
                >
                  {label}
                </a>
              </li>
            );
          })}
        </ul>

        <a href="/" className="logo-link absolute left-1/2 -translate-x-1/2 md:static">
          <img className="w-9 md:w-auto logo" src="/logo.svg" alt="logo" />
        </a>

        <div className="relative cart-wrapper" ref={(n) => { this.cartRef = n; }}>
          <Cart
            isCartOpen={isCartOpen}
            toggleCart={this.toggleCart}
            closeCart={this.closeCart}
          />
        </div>

      </header>
    );
  }
}

export default Header;
