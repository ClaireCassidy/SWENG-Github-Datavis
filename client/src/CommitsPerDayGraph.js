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
      const dateCountArray = []; // objs of type {date: ..., count: ...}

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

      console.log(JSON.stringify(dateCountArray));

      // const d1 = new Date('October 1, 2016 12:00:00 GMT+0000');
      // const d2 = new Date('October 2, 2016 14:00:00 GMT+0000');
      // console.log(`1. ${d1}\n2. ${d2}\nAre they the same day?: ${sameDay(d1,d2)}`);
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
  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
    },
  ];

  return (
    <BarChart width={730} height={250} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="pv" fill="#8884d8" />
      <Bar dataKey="uv" fill="#82ca9d" />
    </BarChart>
  );
}
