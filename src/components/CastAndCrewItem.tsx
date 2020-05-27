import React from "react";
import "./CastAndCrewItem.css";

const CastAndCrewItem: React.FunctionComponent<{
  name: string;
  role: string;
  profile_path: string | null;
}> = (props) => {
  const cleanStr = (str: string) => {
    if (str.includes("/")) return str.substring(0, str.indexOf("/"));
    return str;
  };

  return (
    <div className="CastCrewItemContainer">
      {props.profile_path ? (
        <img
          src={`https://image.tmdb.org/t/p/w500${props.profile_path}`}
          alt="Cast and Crew item"
        ></img>
      ) : (
        EmptyProfilePic(props.name)
      )}
      <div className="CastCrewName">{props.name}</div>
      <div className="CastCrewRole"> {cleanStr(props.role)}</div>
    </div>
  );
};

const EmptyProfilePic = (name: string) => {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .reduce((prev, curr) => `${prev}${curr[0]}`, "");
  return <div className="EmptyProfilePic">{initials}</div>;
};

export default CastAndCrewItem;
