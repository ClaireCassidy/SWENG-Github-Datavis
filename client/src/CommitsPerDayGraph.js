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
import { Container, Row, Col, Accordion, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CommitGraph({ commitData }) {
  const [dayData, setDayData] = useState([]);

  //const [detailedInfoActive, setDetailedInfoActive] = useState(false);
  const [barSelected, setBarSelected] = useState(false);
  const [activeBarIndex, setActiveBarIndex] = useState(0);

  useEffect(() => {
    // console.log("COMMIT DATA CHANGED");
    // console.log(JSON.stringify(commitData));
    setBarSelected(false);
    setActiveBarIndex(0);
    setDayData(parseDayData(commitData));
  }, [commitData]);

  const parseDayData = (commits) => {
    if (Array.isArray(commits) && commits.length > 0) {
      let dateCountArray = []; // objs of type {date: ..., count: ..., indices: ...}

      const commitDates = []; // ISO strings converted to Date objects

      // convert each ISO string to Date object
      commits.forEach((commit) => {
        commitDates.push(new Date(commit.dateISO));
      });

      // tally unique dates
      commitDates.forEach((date, index) => {
        // check if date already in dateCountArray
        updateDateCount(date, dateCountArray, index);
      });

      //finally, stringify each date so it can be displayed
      dateCountArray = dateCountArray.map((obj, index) => {
        return {
          date: obj.date.toDateString(),
          count: obj.count,
          indices: obj.indices.slice(),
        };
      });

    //   console.log(JSON.stringify(dateCountArray));

      return dateCountArray;
    }
  };

  const updateDateCount = (date, arr, index) => {
    let dateFound = false;

    for (let i = 0; i < arr.length; i++) {
      if (sameDay(date, arr[i].date)) {
        arr[i].count = arr[i].count + 1; // increment number of occurences
        arr[i].indices.push(index); // track the index
        dateFound = true;
        break;
      }
    }

    if (!dateFound) {
      // add new entry
      arr.push({
        date: date,
        count: 1,
        indices: [index],
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

  const handleBarClick = (data, index) => {
    // console.log(`Data: ${JSON.stringify(data)}\nIndex: ${index}`);
    setBarSelected(true);
    setActiveBarIndex(index);
  };

  return (
    <>
      {dayData && dayData.length > 0 && (
        <>
          <Container>
            <BarChart width={730} height={250} data={dayData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" onClick={handleBarClick} />
            </BarChart>
            <Accordion defaultActiveKey="0">
              <Card>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey="0">
                  <div>More Details</div>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                  <>
                    {/* Bar Selected */}
                    {barSelected && activeBarIndex >= 0 && (
                      <Card.Body>
                        {dayData[activeBarIndex].indices.map((i, index) => {
                          const curCommit = commitData[i];

                          if (curCommit) {
                              
                        //   console.log(
                        //     `Cur Commit: ${JSON.stringify(
                        //       curCommit
                        //     )}\ni: ${i}\nindex: ${index}`
                        //   );
                          return (
                            <div
                              key={index}
                              style={{
                                borderBottom: "1px solid #d9e2ef",
                                margin: "2px",
                                paddingTop: "10px",
                                backgroundColor: "#f1f4f8",
                                borderRadius: "3px"
                              }}
                            >
                              <Container fluid>
                                <Row>
                                  <Col>
                                    <a href={curCommit.authorAccountUrl}>
                                      <img
                                        src={curCommit.authorAvatarUrl}
                                        style={{
                                          width: "32px",
                                          height: "32px",
                                        }}
                                      />
                                    </a>
                                  </Col>
                                  <Col>
                                    <a href={curCommit.authorAccountUrl}>
                                      <h5>{curCommit.authorName}</h5>
                                    </a>
                                  </Col>
                                  <Col><a href={curCommit.commitUrl}>Go to commit {'>'}</a></Col>
                                </Row>
                                <Row style={{paddingTop: "10px", backgroundColor: "white", margin: "5px 10px 10px 10px"}}>
                                  <Col>
                                    <p>{curCommit.message}</p>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col>
                                    <p>
                                      Comment Count: {curCommit.commentCount}
                                    </p>
                                  </Col>
                                  <Col>
                                    <p>
                                      Date:{" "}
                                      {new Date(curCommit.dateISO).toString()}
                                    </p>
                                  </Col>
                                </Row>
                              </Container>
                            </div>
                          );
                        } else { return <></>}
                        })}
                      </Card.Body>
                    )}
                    {/* Bar Not Selected */}
                    {(!barSelected || activeBarIndex < 0) && (
                      <Card.Body className="text-muted">
                        [Select a bar to view more information]
                      </Card.Body>
                    )}
                  </>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Container>
        </>
      )}
      {(!dayData || dayData.length === 0) && (
        <Container>
          <Row>
            <Col>
              <p>Loading ...</p>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}
