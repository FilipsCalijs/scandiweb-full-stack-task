import React from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

export default function withRouter(ClassComponent) {
  class RouterWrapper extends React.Component {
    render() {
      return <ClassComponent {...this.props} />;
    }
  }

  
  return function Wrapper(props) {
    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    return (
      <RouterWrapper
        {...props}
        router={{ params, navigate, location }}
      />
    );
  };
}
