import React, { useState } from "react";
import { LineChart, Line } from "recharts";

export default function CommitGraph({ repo }) {
  const data = [
    { name: "Page A", uv: 400, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 600, pv: 2800, amt: 400 },
    { name: "Page C", uv: 1400, pv: 400, amt: 200 },
    { name: "Page D", uv: 2400, pv: 700, amt: 1000 },
  ];

  return (
    <LineChart width={400} height={400} data={data}>
      <Line type="monotone" dataKey="uv" stroke="#8884d8" />
    </LineChart>
  );
}
