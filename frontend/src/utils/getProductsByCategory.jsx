import React, { Component } from "react";
import client from "../apolloClient";

export default function getProductsByCategory(Wrapped, query, category) {
  return class extends Component {
    constructor(props) {
      super(props);

      this.state = {
        data: null,
        loading: true,
        error: null,
      };

      this._isMounted = false;
    }

    async componentDidMount() {
      this._isMounted = true;

      try {
        const response = await client.query({
          query,
          variables: { category },
          fetchPolicy: "no-cache",
        });

        if (this._isMounted) {
          this.setState({
            data: response.data,
            loading: false,
          });
        }
      } catch (err) {
        if (this._isMounted) {
          this.setState({
            error: err,
            loading: false,
          });
        }
      }
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    render() {
      const { loading, error, data } = this.state;

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

      return <Wrapped {...this.props} data={data} />;
    }
  };
}
