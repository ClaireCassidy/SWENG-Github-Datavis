import React, { useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export default function CommitGraph({ commitData }) {
  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 12800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  return (
    <LineChart
      width={730}
      height={250}
      data={commitData}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="timeBetween" stroke="#8884d8" activeDot={{onClick: (index)=> {console.log("CLICKED"+JSON.stringify(index))}}}/>
      {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
    </LineChart>
  );

  //   const data = [
  //     { name: "Page A", uv: 400, pv: 2400, amt: 2400 },
  //     { name: "Page B", uv: 600, pv: 2800, amt: 400 },
  //     { name: "Page C", uv: 1400, pv: 400, amt: 200 },
  //     { name: "Page D", uv: 2400, pv: 700, amt: 1000 },
  //   ];

  //   return (
  //     <LineChart width={400} height={400} data={data}>
  //       <Line type="monotone" dataKey="uv" stroke="#8884d8" />
  //       <Line type="monotone" dataKey="pv" stroke="#8884d8" />
  //       <Line type="monotone" dataKey="amt" stroke="#8884d8" />

  //     </LineChart>
  //   );
}
