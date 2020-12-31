import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Container, Row, Col, Accordion, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CommitGraph({ commitData }) {
  const [selectedDatapointIndex, setSelectedDatapointIndex] = useState(0);
  const [datapointSelected, setDatapointSelected] = useState(false);

  const datapointClickHandler = (data) => {
    setDatapointSelected(true);
    setSelectedDatapointIndex(parseInt(data.index));
  };

  useEffect(() => {
    setDatapointSelected(false);
    setSelectedDatapointIndex(0);
  }, [commitData]);

  return (
    <>
      {/* {console.log(`INDEX: ${selectedDatapointIndex}`)} */}
      <LineChart
        width={730}
        height={250}
        data={commitData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis dataKey="timeBetween" />
        <Tooltip labelFormatter={() => "Click datapoint to see more"} />
        <Legend />
        <Line
          type="monotone"
          dataKey="timeBetween"
          stroke="#8884d8"
          //   activeDot={{
          //     onClick: (index) => {
          //       console.log("CLICKED" + JSON.stringify(index));
          //     },
          //   }}
          activeDot={{ onClick: datapointClickHandler }}
        />
      </LineChart>

      <Container fluid>
        <Accordion defaultActiveKey="0">
          <Card>
            <Accordion.Toggle as={Card.Header} variant="link" eventKey="0">
                <div>More Details{" "}<FontAwesomeIcon icon={faAngleDown} /></div>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <>
                {/* Datapoint Selected */}
                {datapointSelected && selectedDatapointIndex >= 0 && (
                  <Card.Body>
                    {!(
                      Object.keys(commitData).length === 0 &&
                      commitData.constructor === Object
                    ) && (
                      <div
                        style={{
                          borderBottom: "1px solid #d9e2ef",
                          margin: "2px",
                          paddingTop: "10px",
                          backgroundColor: "#f1f4f8",
                          borderRadius: "3px",
                        }}
                        key={Date.now()}
                      >
                        <Container fluid>
                          <Row>
                            <Col>
                              <a
                                href={
                                  commitData[selectedDatapointIndex]
                                    .authorAccountUrl
                                }
                              >
                                <img
                                  src={
                                    commitData[selectedDatapointIndex]
                                      .authorAvatarUrl
                                  }
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                  }}
                                />
                              </a>
                            </Col>
                            <Col>
                              <a
                                href={
                                  commitData[selectedDatapointIndex]
                                    .authorAccountUrl
                                }
                              >
                                <h5>
                                  {
                                    commitData[selectedDatapointIndex]
                                      .authorName
                                  }
                                </h5>
                              </a>
                            </Col>
                            <Col>
                              <a
                                href={
                                  commitData[selectedDatapointIndex].commitUrl
                                }
                              >
                                Go to commit {">"}
                              </a>
                            </Col>
                          </Row>
                          <Row
                            style={{
                              paddingTop: "10px",
                              backgroundColor: "white",
                              margin: "5px 10px 10px 10px",
                            }}
                          >
                            <Col>
                              <p>
                                {commitData[selectedDatapointIndex].message}
                              </p>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <p>
                                Comment Count:{" "}
                                {
                                  commitData[selectedDatapointIndex]
                                    .commentCount
                                }
                              </p>
                            </Col>
                            <Col>
                              <p>
                                Date:{" "}
                                {new Date(
                                  commitData[selectedDatapointIndex].dateISO
                                ).toString()}
                              </p>
                            </Col>
                          </Row>
                        </Container>
                      </div>
                    )}
                  </Card.Body>
                )}
                {/* Datapoint Not Selected */}
                {(!datapointSelected || selectedDatapointIndex < 0) && (
                  <Card.Body className="text-muted">
                    [Select a datapoint to view more information]
                  </Card.Body>
                )}
              </>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </Container>
    </>
  );
}
