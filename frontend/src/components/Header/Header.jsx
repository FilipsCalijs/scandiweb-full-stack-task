import React from "react";

class Header extends React.Component {
  render() {
    const { activeCategory } = this.props;

    const links = [
      { path: "/all", label: "ALL" },
      { path: "/clothes", label: "CLOTHES" },
      { path: "/tech", label: "TECH" },
    ];

    return (
      <header className="w-full h-20 flex items-center justify-around relative">
        <ul className="flex list-none gap-5">
          {links.map((link) => (
            <li
              key={link.path}
              className={`flex h-20 justify-center items-center  ${
                activeCategory === link.label.toLowerCase() ? "active" : ""
              }`}
            >
              <a
                className="text-[#1d1f22] p-1 no-underline"
                data-testid={
                  activeCategory === link.label.toLowerCase()
                    ? "active-category-link"
                    : "category-link"
                }
                href={link.path}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="/">
          <img className="mr-40" src="/a-logo.svg" alt="logo" />
        </a>
        <div className="cursor-pointer">
          <img src="/cart-icon.svg" alt="cart icon" className="w-6 h-6" />
        </div>
      </header>
    );
  }
}

export default Header;
