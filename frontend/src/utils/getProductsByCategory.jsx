import React from "react";
import client from "../apolloClient";

export default function getProductsByCategory(Component, query, category) {
  return class extends React.Component {
    state = { loading: true, error: null, data: null };

    async componentDidMount() {
      try {
        const { data } = await client.query({
          query,
          variables: { category },
          fetchPolicy: "no-cache",
        });
        this.setState({ data, loading: false });
      } catch (error) {
        this.setState({ error, loading: false });
      }
    }

    render() {
      const { loading, error, data } = this.state;
      const { ...props } = this.props;

      if (loading)
        return (
          <div className="flex justify-center items-center h-screen text-2xl">
            Loading...
          </div>
        );

      if (error)
        return (
          <div className="flex justify-center items-center h-screen text-red-500 text-xl">
            Error: {error.message}
          </div>
        );

      return <Component {...props} data={data} />;
    }
  };
}
