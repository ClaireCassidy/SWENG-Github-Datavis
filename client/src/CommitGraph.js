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

  return (
    <LineChart
      width={730}
      height={250}
      data={commitData}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis dataKey="timeBetween"/>
      <Tooltip labelFormatter={() => "Click datapoint to see more"}/>
      <Legend />
      <Line type="monotone" dataKey="timeBetween" stroke="#8884d8" activeDot={{onClick: (index)=> {console.log("CLICKED"+JSON.stringify(index))}}}/>
    </LineChart>
  );

  

}
