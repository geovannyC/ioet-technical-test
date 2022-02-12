/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable testing-library/no-container */
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import {
  createEvent,
  fireEvent,
  render,
} from "@testing-library/react";
import { ContentCard } from "../components/content-card/contentCard";
import { CustomSelected } from "../components/content-card/customSelect";
import { hours, format } from "../components/content-card/data-time";
import {
  handleManageDataFile,
  addWorkProgress,
  choseFormat,
  payPerHour,
  findDay,
  buildFormat,
  calcTotalCost,
} from "../components/content-card/modules";
import file from "../addons/file.txt";
// eslint-disable-next-line testing-library/prefer-screen-queries
// test('should to print anything', () => {
//     render(<Home/>)
//     expect(screen.getByText("Hi")).toHaveTextContent("Hi")
// });
test("should to print Hours Worked Selector", () => {
  const { getByText, getByLabelText } = render(<ContentCard />);
  getByText("Hours Worked Selector");
});
describe("Testing Inputs ContentCard ", () => {
  test("handleChangueName shoult to changue dataEmployye and returns true", () => {
    let expected = "example_name";
    const { container } = render(<ContentCard />);
    const inputText = container.querySelector(`[id=input-txt]`);
    const inputFile = container.querySelector(`[id=file-upload]`);
    const eventfile = fireEvent(
      inputFile,
      createEvent("input", inputFile, {
        target: { files: file },
      })
    );
    let event = fireEvent.change(inputText, { target: { value: expected } });
    expect(eventfile).toBeTruthy();
    expect(event).toBeTruthy();
  });
});
//Testing for events in the CustomSelected Component
describe("testing CustomSelect Component", () => {
  test("should to changue the values when foreEvents are exected ", () => {
    // Create a fun for recived the handleChangueTime event
    const handleChangueTime = (x, y) => {
      day.hour = x;
      day.day = y;
    };
    //Set a schemma for changue the values from the Custom Component
    let day = { hour: false, day: false };
    //Get the array from the hours module
    let getHours = hours();
    //Param for the setup the changue
    let hourToTest = "12:00";
    //Set the events for the component
    const { getByText, getByTestId } = render(
      <CustomSelected
        handleChangueTime={handleChangueTime}
        // set type, the component could recive two types "start-time" and "end-time"
        type="start-time"
        defaultText="00:00"
        optionsList={getHours}
      />
    );
    //Get the target with the btn-selected id
    const button = getByTestId("btn-selected");
    //Clicked and exec the function handleListDisplay on the component
    fireEvent.click(button);
    //The component must show a list and we can get any  element, in this case "23:00"
    expect(getByText("23:00")).toBeInTheDocument();
    //With the list deployment, get the item with the id btn-hour-12:00
    const buttonHour = getByTestId("btn-hour-12:00");
    //Clicked in that item
    fireEvent.click(buttonHour);
    //Default value changue and show the "12:00" from hourToTest
    expect(getByText(hourToTest)).toBeInTheDocument();
    //The event handleChangueTime changue the hour
    expect(day.hour).toBe(hourToTest);
    //The event handleChangueTime changue the day
    expect(day.day).toBe("start-time");
  });
});
describe("Teting for the function in the modules.js", () => {
  //testing for choseFormat function
  test("should to print 270 the hour: 0-12 and the stage mon_fri", () => {
    let sh = 0;
    let eh = 12;
    let day = format.mon_fri;
    const getPrice = choseFormat(sh, eh, day);
    let expected = 270;
    expect(getPrice).toBe(expected);
  });
  test("should to print 0 the hour: 0-0 and the stage mon_fri", () => {
    let sh = 0;
    let eh = 0;
    let day = format.mon_fri;
    const getPrice = choseFormat(sh, eh, day);
    let expected = 0;
    expect(getPrice).toBe(expected);
  });
  test("should to print 0 the hour: 0--1 and the stage mon_fri", () => {
    let sh = 0;
    let eh = -1;
    let day = format.mon_fri;
    const getPrice = choseFormat(sh, eh, day);
    let expected = 0;
    expect(getPrice).toBe(expected);
  });
  test("should to print 330 the hour: 0-12 and the stage weekend", () => {
    let sh = 0;
    let eh = 12;
    let day = format.weekend;
    const getPrice = choseFormat(sh, eh, day);
    let expected = 330;
    expect(getPrice).toBe(expected);
  });
  test("should to print 0 the hour: 0-0 and the stage weekend", () => {
    let sh = 0;
    let eh = 0;
    let day = format.weekend;
    const getPrice = choseFormat(sh, eh, day);
    let expected = 0;
    expect(getPrice).toBe(expected);
  });
  test("should to print 0 the hour: 0--0 and the stage weekend", () => {
    let sh = 0;
    let eh = -1;
    let day = format.weekend;
    const getPrice = choseFormat(sh, eh, day);
    let expected = 0;
    expect(getPrice).toBe(expected);
  });
  //testing for payPerHour function
  test('should to print 125 set the hour "04:00" to "09:00" and the day set on Tuesday ', () => {
    let sh = "04:00";
    let eh = "09:00";
    let day = "Tuesday";
    const getPayPerHour = payPerHour(sh, eh, day);
    let expected = 125;
    expect(getPayPerHour).toBe(expected);
  });
  test('should to print 150 set the hour "04:00" to "09:00" and the day set on Saturday ', () => {
    let sh = "04:00";
    let eh = "09:00";
    let day = "Saturday";
    const getPayPerHour = payPerHour(sh, eh, day);
    let expected = 150;
    expect(getPayPerHour).toBe(expected);
  });
  //Testing for findDay Function
  test("should to find the day with a part of a word in the days Array, set MoN must be Monday and Su must be Sunday", async () => {
    let day = "MoN";
    let day2 = "Su";
    let expected = "Monday";
    let expected2 = "Sunday";
    const getDayMonday = await findDay(day);
    const getDaySunday = await findDay(day2);
    expect(getDayMonday).toBe(expected);
    expect(getDaySunday).toBe(expected2);
  });
  //Testing for buildFormat function
  test('should to print a object with cost, day, end and start hour, passing a array with the next format ["MO10:00-12:00", "SA10:00-14:00"]', async () => {
    let arrDays = ["MO10:00-12:00", "SA10:00-14:00"];
    let expected = [
      {
        cost: 30,
        day: "Monday",
        end_hour: "12:00",
        start_hour: "10:00",
      },
      {
        cost: 80,
        day: "Saturday",
        end_hour: "14:00",
        start_hour: "10:00",
      },
    ];
    const getFormat = await buildFormat(arrDays);
    expect(getFormat).toStrictEqual(expected);
  });
  //Testing for calcTotalCost function
  test("Should to calc the total cost from objects array and return 110", async () => {
    let arr = [
      {
        cost: 30,
        day: "Monday",
        end_hour: "12:00",
        start_hour: "10:00",
      },
      {
        cost: 80,
        day: "Saturday",
        end_hour: "14:00",
        start_hour: "10:00",
      },
    ];
    let expected = 110;
    const fnCalTotalCost = await calcTotalCost(arr);
    expect(fnCalTotalCost).toStrictEqual(expected);
  });
  //test for handleManageDataFile function
  test("should to returns a object format with the next entrance JEORGE=SA13:00-12:00,SU12:00-14:00,SU20:00-21:00", async () => {
    let txt = "JEORGE=SA13:00-12:00,SU12:00-14:00,SU20:00-21:00";
    let expected = {
      arrDaysWorked: [
        { cost: 0, day: "Saturday", end_hour: "12:00", start_hour: "13:00" },
        {
          cost: 40,
          day: "Sunday",
          end_hour: "14:00",
          start_hour: "12:00",
        },
        {
          cost: 25,
          day: "Sunday",
          end_hour: "21:00",
          start_hour: "20:00",
        },
      ],
      name: "JEORGE",
      total_cost: 65,
    };
    const fnHandleMngDF = await handleManageDataFile(txt);
    expect(fnHandleMngDF.arrDaysWorked).toStrictEqual(expected.arrDaysWorked);
  });
  test("should to add and abjects to the arrDaysWorked ", async () => {
    let schemma = {
      arrDaysWorked: [],
      id: 123456,
      name: "example_test",
      total_cost: 0,
    };
    let schemma2 = {
      cost: false,
      day: "Saturday",
      end_hour: "14:00",
      start_hour: "2:00",
    };
    let expected = {
      arrDaysWorked: [
        { cost: 310, day: "Saturday", end_hour: "14:00", start_hour: "2:00" },
      ],
      id: 123456,
      name: "example_test",
      total_cost: 310,
    };
    const fnaddWorkProgress = await addWorkProgress(schemma, schemma2);
    expect(fnaddWorkProgress.total_cost).toStrictEqual(expected.total_cost);
    expect(fnaddWorkProgress.arrDaysWorked).toHaveLength(1);
  });
});
test("should to print a last element from list with the hours", () => {});
