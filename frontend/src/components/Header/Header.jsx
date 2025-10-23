import React from "react";
import Cart from "../Cart/Сart";

class Header extends React.Component {
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

  render() {
    const currentPath = this.getCurrentPath();
    const links = this.links;

    return (
      <header className="w-full h-20 flex items-center justify-around relative">
        <ul className="flex list-none gap-10">
          {links.map(({ path, label }) => {
            const key = path;
            const lower = label.toLowerCase();
            const isActive = currentPath === lower;

            return (
              <li key={key} className={isActive ? "active" : ""}>
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

        <a href="/">
          <img className="mr-40" src="/logo.svg" alt="logo" />
        </a>

        <Cart />
      </header>
    );
  }
}

export default Header;
