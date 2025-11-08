import React from "react";
import { useQuery } from "@apollo/client";

function withGraphQl(Component, query) {
  return (props) => {
    const variables = props.params?.id
      ? { id: props.params.id }
      : props.variables || {};

    const { loading, error, data } = useQuery(query, {
      variables,
      fetchPolicy: "no-cache",
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return <Component {...props} data={data} />;
  };
}

export default withGraphQl;
