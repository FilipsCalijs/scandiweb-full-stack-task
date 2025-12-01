import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient";

import Home from "./pages/Home";
import Category from "./pages/Category";
import PageDetails from "./pages/PageDetails";

function App() {
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

export default App;
