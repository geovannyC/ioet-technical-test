import { format, days } from "./data-time";
//Helper calculate the price betwen 3 ranges stage 1, stage 2, stage 3, for example Monday have 3 ranges 9:00,18:00,0:00
export const choseFormat = (sh, eh, stageDay) => {
  let price = 0;
  let stage1E = parseInt(stageDay.stage1.end);
  let stage2E = parseInt(stageDay.stage2.end);
  let stage1P = stageDay.stage1.price;
  let stage2P = stageDay.stage2.price;
  let stage3P = stageDay.stage3.price;

  for (let index = sh; index < eh; index++) {
    switch (true) {
      case index < stage1E:
        price += stage1P;
        continue;
      case index < stage2E:
        price += stage2P;
        continue;
      case index >= stage2E:
        price += stage3P;
        continue;
      default:
        break;
    }
  }
  return price;
};
//Helper find the correct stage, the stage weekend only have the days of the weekend and the another haver the days MO to FRY
export const payPerHour = (sh, eh, da) => {
  let startH = parseInt(sh);
  let endH = parseInt(eh);
  let stageDay = days.indexOf(da) > 4 ? format.weekend : format.mon_fri;
  const totalCostDay = choseFormat(startH, endH, stageDay);
  return totalCostDay;
};
//Helper find the incomplete word in the array days
export const findDay = (word) => {
  return new Promise((resolve) => {
    resolve(
      days.find((element) => element.toLowerCase().includes(word.toLowerCase()))
    );
  });
};
//Build the format DAY from string. 
export const buildFormat = (arr) => {
  return Promise.all(
    arr.map(async (element) => {
      let paramDay = element.substring(0, 2);
      let dayFinded = await findDay(paramDay);
      let hours = element.split(paramDay);
      let splitHours = hours[1].split("-");
      let sh = splitHours[0];
      let eh = splitHours[1];
      let calCost = payPerHour(sh, eh, dayFinded);
      let format = {
        day: dayFinded,
        start_hour: sh,
        end_hour: eh,
        cost: calCost,
      };
      return format;
    })
  );
};
//Helper calculate the total-cost from a objects in Array
export const calcTotalCost = (array) => {
  let cost = 0;
  for (let index = 0; index < array.length; index++) {
    cost += array[index].cost;
  }
  return cost;
};
//Build the formar EMPLOYEE
export const handleManageDataFile = async (txt) => {
  let splited = txt.split("=");
  let splitedDaysAndHours = splited[1].split(",");
  let fnBuildFormat = await buildFormat(splitedDaysAndHours);
  let fnCalTotalCost = calcTotalCost(fnBuildFormat);
  let newFormat = {
    id: Date.now(),
    name: splited[0],
    arrDaysWorked: fnBuildFormat,
    total_cost: fnCalTotalCost,
  };
  return newFormat;
};
//Build the format EMPLOYEE and DAYS
export const addWorkProgress = (dataEmployee, prevData) => {
  let newArr = [...dataEmployee.arrDaysWorked];
  let newPrevData = { ...prevData };
  let costDay = payPerHour(
    prevData.start_hour,
    prevData.end_hour,
    prevData.day
  );
  newPrevData.cost = costDay;
  newArr.push(newPrevData);
  let schemma = {
    ...dataEmployee,
    arrDaysWorked: newArr,
    id: Date.now(),
    total_cost: dataEmployee.total_cost + costDay,
  };
  return schemma;
};
