import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

export default function withRouter(ClassComponent) {
  return function Wrapper(props) {
    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    return (
      <ClassComponent
        {...props}
        router={{ params, navigate, location }}
      />
    );
  };
}
