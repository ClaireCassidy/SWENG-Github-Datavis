import React, { useState, useEffect } from "react";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";

export default function CommitGraph({ commitData }) {
    
  const [dayData, setDayData] = useState([]);

  useEffect(() => {
    setDayData(parseDayData(commitData));
  }, [commitData]);

  const parseDayData = (commits) => {
    if (Array.isArray(commits) && commits.length > 0) {
      let dateCountArray = []; // objs of type {date: ..., count: ...}

      const commitDates = []; // ISO strings converted to Date objects

      // convert each ISO string to Date object
      commits.forEach((commit) => {
        commitDates.push(new Date(commit.dateISO));
      });

      // tally unique dates
      commitDates.forEach((date) => {
        // check if date already in dateCountArray
        updateDateCount(date, dateCountArray);
      });

      //finally, stringify each date so it can be displayed
      dateCountArray = dateCountArray.map((obj, index) => {
        return {
            date: obj.date.toDateString(),
            count: obj.count
        }
      })

      console.log(JSON.stringify(dateCountArray));

      return dateCountArray;
    //   setDayData(dateCountArray);
    }
  };

  const updateDateCount = (date, arr) => {
    let dateFound = false;

    for (let i = 0; i < arr.length; i++) {
      if (sameDay(date, arr[i].date)) {
        arr[i].count = arr[i].count + 1; // increment number of occurences
        dateFound = true;
        break;
      }
    }

    if (!dateFound) {
      // add new entry
      arr.push({
        date: date,
        count: 1,
      });
    }
  };

  const sameDay = (d1, d2) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  return (
    <>
      {console.log(dayData)}
      {dayData && dayData.length > 0 && (
        <BarChart width={730} height={250} data={dayData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
          {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
        </BarChart>
      )}
    </>
  );
}
