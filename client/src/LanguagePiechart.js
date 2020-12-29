import React, { useState, useEffect } from "react";
import { RadialBarChart, RadialBar, Legend, Tooltip } from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spinner } from "react-bootstrap";

export default function LanguagePiechart({ languageInfo, loading }) {
  const [noData, setNoData] = useState(true);

  useEffect(() => {
    console.log(`FROM PIECHART: ${JSON.stringify(languageInfo)}`);

    // check if received empty object or null object for language data
    setNoData(
      (Object.keys(languageInfo).length === 0 &&
        languageInfo.constructor === Object) ||
        languageInfo === null
    );
  }, [languageInfo]);

  return (
    <>
      {loading && (
        <Spinner animation="border" role="status" variant="info">
          <span className="sr-only">Loading...</span>
        </Spinner>
      )}
      {!loading && noData && <p>[Didn't detect any programming languages]</p>}

      {!noData && (
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
            label={{ fill: "black", position: "insideStart",  }}
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
          <Tooltip labelFormatter={(index) => languageInfo[index].name} />
        </RadialBarChart>
      )}
    </>
  );
  
}
