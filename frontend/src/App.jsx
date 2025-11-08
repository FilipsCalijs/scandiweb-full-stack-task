import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient";


import Home from "./pages/Home";
import Category from "./pages/Category";
import PageDetails from "./pages/Page-details"; 

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/all" element={<Home />} />
          <Route path="/clothes" element={<Category />} />
          <Route path="/tech" element={<Category />} />
          <Route path="/clothes/:id" element={<PageDetails />} />
          <Route path="/tech/:id" element={<PageDetails />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
