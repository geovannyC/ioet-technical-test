import React, { useState } from "react";
import "./style.css";
import { CustomSelected } from "./customSelect";
import DataContext from "../../context/context";
import { hours, days } from "./data-time";
import {
  handleManageDataFile,
  addWorkProgress,
} from "./modules";
import upload from "../../addons/upload.png";
//Component container data 
export function ContentCard() {
  const [dataEmployee, setDataEmployee] = useState({
      id: false,
      name: false,
      arrDaysWorked: [],
      total_cost: 0,
    }),
    [prevData, setPrevData] = useState({
      start_hour: "00:00",
      end_hour: "00:00",
      day: "Monday",
      cost: false,
    });
    //verify value and type from the custom select component
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const handleChangueTime = (e, type) => {
    switch (type) {
      case "start-time":
        return setPrevData({ ...prevData, start_hour: e });
      case "end-time":
        return setPrevData({ ...prevData, end_hour: e });
      case "day":
        return setPrevData({ ...prevData, day: e });
      default:
        break;
    }
  };
  const handleChangueName = (e) => {
    let value = e.target.value;
    setDataEmployee({ ...dataEmployee, name: value });
  };
  //Verify the states and return false if the states are no valids
  const statusHandleChangueHour = () => {
    let start_hour = parseInt(prevData.start_hour);
    let end_hour = parseInt(prevData.end_hour);
    let { name } = dataEmployee;
    if (start_hour < end_hour && name) {
      return true;
    } else {
      return false;
    }
  };
  //Handle veryfy the state for the disable state on the btn send
  const statusHandleCheckData = () => {
    let stat = dataEmployee.arrDaysWorked.length > 0;
    if (stat) {
      return true;
    } else {
      return false;
    }
  };
  //Call the context addEmployee and set the current data
  const sendData = (context) => {
    let prevDataEmployee = { ...dataEmployee };
    setDataEmployee({
      id: false,
      name: false,
      arrDaysWorked: [],
      total_cost: 0,
    });
    context.addEmployee(prevDataEmployee);
  };
  //Read the txt File uploaded
  const showFile = async (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      handleChangueStateDataEmploye(text);
    };
    reader.readAsText(e.target.files[0]);
  };
  //Changue the state DataEmployee with the helper handleManageDataFile
  const handleChangueStateDataEmploye = async (txt) => {
    let resultSchemma = await handleManageDataFile(txt);
    setDataEmployee(resultSchemma);
  };
  //Changue the state DataEmployee woth the helper addWorkProgress
  const handleChangueStatePrevData = async () => {
    let resultSchemma = await addWorkProgress(dataEmployee, prevData);
    setDataEmployee(resultSchemma);
  };
  //Draw the current value of the days generated 
  const ShemmaArrEmployees = () => {
    let { arrDaysWorked } = dataEmployee;
    if (dataEmployee.arrDaysWorked.length > 0) {
      return (
        <div className="content-day">
          {arrDaysWorked.map((day) => {
            return (
              <small
                key={day}
              >{`${day.day} ${day.start_hour}-${day.end_hour}. $${day.cost}`}</small>
            );
          })}
        </div>
      );
    } else {
      return null;
    }
  };
  //Draw the data of the employees generated from context data 
  const ShemmaArrDataEmployees = (context) => {
    let paramData = context.data;
    if (paramData.length > 0) {
      return (
        <div className="content-all-data">
          {paramData.map((data) => {
            return (
              <div className="content-data" key={data.id}>
                <div className="column1">
                  <div>
                    {data.arrDaysWorked.map((day) => (
                      <small key={day}>{`${day.day[0] + day.day[1]}: $${
                        day.cost
                      }`}</small>
                    ))}
                  </div>
                  <small>{`The amount to pay ${data.name} is: ${data.total_cost}  USD`}</small>
                </div>
                <div className="column2">
                  <button onClick={() => context.removeEmployee(data.id)}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      );
    } else {
      return null;
    }
  };
  //Draw the general Card
  const Shemma = () => {
    let hoursArr = hours()
    return (
      <DataContext.Consumer>
        {(context) => (
          <React.Fragment>
            <div className="card">
              <div className="container-corner">
                <input
                  type="file"
                  id="file-upload"
                  onChange={showFile}
                  className="input-file"
                />
                <label className="file" htmlFor="file-upload">
                  <img className="img-upload" src={upload} alt="" />
                </label>
              </div>
              <h2>Hours Worked Selector</h2>
              <div className="container-selectors">
                <div className="row-selector delete-responsive">
                  <div className="column">
                    <h3>Name</h3>
                  </div>
                  <div className="column">
                    <h3>Start Time</h3>
                  </div>
                  <div className="column">
                    <h3>End Time</h3>
                  </div>
                  <div className="column">
                    <h3>Day</h3>
                  </div>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="row-selector">
                    <div className="column">
                      <input
                        disabled={
                          typeof dataEmployee.arrDaysWorked[0] === "object"
                        }
                        id="input-txt"
                        type="text"
                        value={dataEmployee.name ? dataEmployee.name : ""}
                        onChange={(e) => handleChangueName(e)}
                      />
                    </div>
                    <div className="column" id="entrance-hour">
                      <CustomSelected
                        handleChangueTime={handleChangueTime}
                        type="start-time"
                        defaultText={hoursArr[0]}
                        optionsList={hoursArr}
                      />
                    </div>
                    <div className="column">
                      <CustomSelected
                        handleChangueTime={handleChangueTime}
                        defaultText={hoursArr[0]}
                        type="end-time"
                        optionsList={hoursArr}
                      />
                    </div>
                    <div className="column">
                      <CustomSelected
                        type="day"
                        defaultText={days[0]}
                        optionsList={days}
                        handleChangueTime={handleChangueTime}
                      />
                    </div>
                    <div className="column ">
                      <div className="two-columns">
                        <button
                          disabled={!statusHandleChangueHour()}
                          onClick={handleChangueStatePrevData}
                        >
                          Add Day
                        </button>{" "}
                        <button
                          disabled={!statusHandleCheckData()}
                          onClick={() => sendData(context)}
                        >
                          Send
                        </button>{" "}
                      </div>
                    </div>
                  </div>
                  <div className="row-content">{ShemmaArrEmployees()}</div>
                </form>

                <div className="row-content">
                  {ShemmaArrDataEmployees(context)}
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
      </DataContext.Consumer>
    );
  };
  return Shemma();
}
