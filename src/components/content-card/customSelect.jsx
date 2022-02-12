import React, { useEffect, useState } from "react";
//Selector Days and Hours
export const CustomSelected = ({ defaultText, optionsList, handleChangueTime, type }) => {
  const [data, setData] = useState({
    defaultSelectText: "",
    showOptionList: false,
    optionsList: [],
  });
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    setData({ ...data, defaultSelectText: defaultText });
    document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleClickOutside = (e) => {
    if (
      !e.target.classList.contains("custom-select-option") &&
      !e.target.classList.contains("selected-text")
    ) {
      setData({
        ...data,
        showOptionList: false,
      });
    }
  };
  //Handle Open List
  const handleListDisplay = () => {
    setData({ ...data, showOptionList: data.showOptionList ? false : true });
  };
  //Set data to the parent component
  const handleOptionClick = (e) => {
      let value = e.target.getAttribute("data-name")
      let type = e.target.getAttribute("data-type")

      handleChangueTime(value,type)
    setData({
      ...data,
      defaultSelectText: value,
      showOptionList: false,
    });
  };
  const Schemma = () => {
    return (
      <div className="custom-select-container">
        <div
          className={
            //Listener open list
            data.showOptionList ? "selected-text active" : "selected-text"
          }
          data-testid="btn-selected"
          onClick={handleListDisplay}
        >
          {data.defaultSelectText}
        </div>
        {data.showOptionList && (
        //Listener open List
          <ul className="select-options">
            {optionsList.map((option) => {
            //Draw the list hours or days
              return (
                <li
                  className="custom-select-option"
                  data-testid={`btn-hour-${option}`}
                  data-name={option}
                  data-type={type}
                  key={option}
                  onClick={handleOptionClick}
                >
                  {option}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  };
  return Schemma();
};
