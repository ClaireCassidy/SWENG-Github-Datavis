import React, { useState, useEffect } from "react";
import { RadialBarChart, RadialBar, Legend, Tooltip } from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row } from "react-bootstrap";

export default function LanguagePiechart({ languageInfo }) {
  useEffect(() => {
    console.log(`FROM PIECHART: ${JSON.stringify(languageInfo)}`);
  }, [languageInfo]);

  //     const data = [
  //     {
  //       name: "java",
  //       size: 1443,
  //       fill: "#8884d8",
  //     },
  //     {
  //       name: "python",
  //       size: 2441,
  //       fill: "#83a6ed",
  //     },
  //   ];

  return (
    <Container>
      <Row>
        <RadialBarChart
          width={1000}
          height={350}
          innerRadius="10%"
          outerRadius="80%"
          data={languageInfo}
          startAngle={180}
          endAngle={-165}
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
            iconType="circle"
          />
          <Tooltip />
        </RadialBarChart>
      </Row>
    </Container>
  );
}
