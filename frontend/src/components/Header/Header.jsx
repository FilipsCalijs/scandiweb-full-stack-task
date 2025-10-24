import React from "react";
import Cart from "../Cart/Сart";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isCartOpen: false };
  }

  toggleCart = () => {
    this.setState(prev => ({ isCartOpen: !prev.isCartOpen }));
  };

  getCurrentPath() {
    const m = window.location.pathname.match(/[^/]+/);
    return (m && m[0]) || "all";
  }

  get links() {
    return Object.freeze([
      { path: "/all", label: "ALL" },
      { path: "/clothes", label: "CLOTHES" },
      { path: "/tech", label: "TECH" },
    ]);
  }

  handleOutsideClick = (e) => {
    if (this.cartRef && !this.cartRef.contains(e.target)) {
      this.setState({ isCartOpen: false });
    }
  };

  componentDidMount() {
    document.addEventListener("click", this.handleOutsideClick);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleOutsideClick);
  }

  render() {
    const currentPath = this.getCurrentPath();
    const { isCartOpen } = this.state;

    return (
      <header className="w-full h-20 flex items-center justify-around relative">
        <ul className="flex list-none gap-10">
          {this.links.map(({ path, label }) => {
            const isActive = currentPath === label.toLowerCase();
            return (
              <li key={path} className={isActive ? "active" : ""}>
                <a
                  className="text-[#1d1f22] p-1 no-underline"
                  data-testid={isActive ? "active-category-link" : "category-link"}
                  href={path}
                >
                  {label}
                </a>
              </li>
            );
          })}
        </ul>

        <a href="/"><img className="mr-40" src="/logo.svg" alt="logo" /></a>

        <div className="relative" ref={(n) => (this.cartRef = n)}>
          <Cart isCartOpen={isCartOpen} toggleCart={this.toggleCart} />
        </div>
      </header>
    );
  }
}

export default Header;
