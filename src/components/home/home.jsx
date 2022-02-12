import React from "react";
import { ContentCard } from "../content-card/contentCard";
import { GlobalState } from "../../context/GlobalState";
import "./home.css";
export const Home = () => {
  const SchemmaHome = () => {
    return (
      <GlobalState>
        <div className="container-back">
          <div className="container-content">
            <ContentCard />
          </div>
        </div>
      </GlobalState>
    );
  };
  return SchemmaHome();
};
