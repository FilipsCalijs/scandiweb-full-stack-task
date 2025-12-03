import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient";

import Home from "./Pages/Home";
import Category from "./Pages/Category";
import PageDetails from "./Pages/PageDetails";

class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:category" element={<Category />} />
            <Route path="/:category/:id" element={<PageDetails />} />
          </Routes>
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
