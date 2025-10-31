import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient";

import Header from "./components/Header/Header";
import Home from "./pages/Home";
import Category from "./pages/Category";

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
       
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/all" element={<Home />} />
          <Route path="/clothes" element={<Category />} />
          <Route path="/tech" element={<Category />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
