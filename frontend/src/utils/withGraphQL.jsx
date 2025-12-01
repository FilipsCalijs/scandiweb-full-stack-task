import React from "react";
import client from "../apolloClient";

export default function withGraphQl(Component, query, variables = {}) {
  return class WithGraphQl extends React.Component {
    state = {
      loading: true,
      error: null,
      data: null,
    };

    async componentDidMount() {
      try {
        const { data } = await client.query({
          query,
          variables: this.props.variables || variables,
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

      if (loading) {
        return (
          <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        );
      }

      if (error) {
        return (
          <div className="flex justify-center items-center min-h-screen text-red-500 text-xl">
            Error: {error.message}
          </div>
        );
      }

      return <Component {...props} data={data} />;
    }
  };
}
