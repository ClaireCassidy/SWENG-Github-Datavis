import React, { useState } from "react";
import { RadialBarChart, RadialBar, Legend, Tooltip } from "recharts";

export default function LanguagePiechart({ languageInfo }) {

    console.log(`FROM PIECHART: ${JSON.stringify(languageInfo)}`);
  const data = [
    {
        name: "java",
        size: 1443,
        fill: "#8884d8"
    },
    {
        name: "python",
        size: 2441,
        fill: "#83a6ed"
    }
  ];

  return (

    <RadialBarChart
      width={1000}
      height={350}
      innerRadius="10%"
      outerRadius="90%"
      data={data}
      startAngle={0}
      endAngle={345}
    >
      <RadialBar
        minAngle={15}
        label={{ fill: "black", position: "insideStart" }}
        background
        clockWise={true}
        dataKey="size"
      />
      <Legend
        iconSize={10}
        width={120}
        height={140}
        layout="vertical"
        verticalAlign="middle"
        align="right"
      />
      <Tooltip />
    </RadialBarChart>
  );
}
