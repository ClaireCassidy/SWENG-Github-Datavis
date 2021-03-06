import axios from "axios";
import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Table,
  Spinner,
  Toast,
  Card,
  Accordion,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleDown } from "@fortawesome/free-solid-svg-icons";

import CommitGraph from "./CommitGraph";
import CommitsPerDayGraph from "./CommitsPerDayGraph";
import LanguagePiechart from "./LanguagePiechart";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const RADIAL_CHART_COLOURS = [
  "#8884d8",
  "#83a6ed",
  "#8dd1e1",
  "#82ca9d",
  "#a4de6c",
  "#d0ed57",
  "#ffc658",
];

function App() {
  const [debug, setDebug] = useState(true);

  // text field
  const [username, setUsername] = useState("");
  // actually submitted
  const [submittedUsername, setSubmittedUsername] = useState("");
  const [repos, setRepos] = useState([]);

  const [sidebarLoading, setSidebarLoading] = useState(false);
  const [noUsernameError, setNoUsernameError] = useState(false);
  const [invalidUsernameError, setInvalidUsernameError] = useState(false);

  const [commitDensityInfoOpen, setCommitDensityInfoOpen] = useState(false);
  const [languageInfoOpen, setLanguageInfoOpen] = useState(false);

  // has a repo been selected from the list
  const [repoActive, setRepoActive] = useState(false);
  const [curRepo, setCurRepo] = useState(null);
  const [languageDataLoading, setLanguageDataLoading] = useState(false);
  const [repoLanguageData, setRepoLanguageData] = useState({}); // used to render the radial chart
  // commit data for curRepo
  const [commitDataLoading, setCommitDataLoading] = useState(false);
  const [curRepoCommitData, setcurRepoCommitData] = useState([]);

  // just the info we need from a Repo response for the sidebar
  function RepoConcise(name, url) {
    this.name = name;
    this.url = url;
  }

  const parseLanguageInfo = (languageInfo) => {
    let languagesFormatted = [];

    // array [{language: size}, ...]
    let kvps = Object.entries(languageInfo);

    for (
      let i = 0;
      i < Math.min(kvps.length, RADIAL_CHART_COLOURS.length);
      i++
    ) {
      const [language, size] = kvps[i];

      languagesFormatted.push({
        name: language,
        size: size,
        fill: RADIAL_CHART_COLOURS[i],
      });
    }

    return languagesFormatted;
  };

  // Extracts the relevant information from repository's commits
  const parseCommitInfo = (commitInfo) => {
    // default commits are most recent - oldest; reverse order for calculations
    const commitInfoReversed = commitInfo.slice().reverse();
    const commitInfoFormatted = [];

    commitInfoReversed.forEach((curCommit, index) => {
      // time between this commit and the previous commit
      let timeBetweenMillis = 0;

      const dateISO = curCommit.commit.author.date; // date as ISO string
      const authorName = curCommit.commit.author.name;
      const authorAccountUrl = curCommit.author.html_url;
      const message = curCommit.commit.message;
      const commitUrl = curCommit.html_url;
      const commentCount = curCommit.commit.comment_count;
      const authorAvatarUrl = curCommit.author.avatar_url;

      const timeThisCommit = new Date(curCommit.commit.author.date);

      let timeBetweenDays = 0;

      if (index !== 0) {
        // avoid index oob
        const timePreviousCommit = new Date(
          commitInfoReversed[index - 1].commit.author.date
        );
        timeBetweenMillis = Math.abs(
          timeThisCommit.getTime() - timePreviousCommit.getTime()
        );
        timeBetweenDays = Math.round(timeBetweenMillis / (1000 * 60 * 60 * 24));
      }

      commitInfoFormatted.push({
        name: "Commit " + index,
        timeBetween: timeBetweenDays,
        dateISO: dateISO,
        authorName: authorName,
        authorAccountUrl: authorAccountUrl,
        message: message,
        commitUrl: commitUrl,
        commentCount: commentCount,
        authorAvatarUrl: authorAvatarUrl,
      });
    });

    return commitInfoFormatted;
  };

  const getReposForUsername = () => {
    if (username) {
      // trigger the Spinner
      setSidebarLoading(true);
      // update the submitted username
      setSubmittedUsername(username);
      // get rid of the last request's repo data
      setRepos([]);
      setRepoActive(false);
      setRepoLanguageData({});

      // submit request to server
      axios
        .get(`/user/${username}/repo`)
        .then((res) => {
          setSidebarLoading(false);

          if (Array.isArray(res.data)) {
            //success
            const repos = res.data;
            repos.forEach((repo, index, arr) => {
              arr[index] = new RepoConcise(repo.name, repo.html_url);
            });

            setRepos(repos);
          } else {
            // user dne
            console.log("dne");
            setInvalidUsernameError(true);
          }
        })
        .catch((error) => {
          console.log(error);
          setSidebarLoading(false);
        });
    } else {
      setNoUsernameError(true);
    }
  };

  const handleUsernameSubmission = (e) => {
    getReposForUsername();
  };

  const handleRepoSelection = (repo) => {
    // set the active repo
    setCurRepo(repo);
    setRepoActive(true);

    // pending API response
    setLanguageDataLoading(true);
    setCommitDataLoading(true);

    // fetch the language data from api
    axios
      .get(`/user/${submittedUsername}/${repo.name}/languages`)
      .then((res) => {

        let languageInfo = res.data;

        if (!(Object.keys(languageInfo).length === 0)) {
          languageInfo = parseLanguageInfo(languageInfo);
        }

        setRepoLanguageData(languageInfo); // may be empty object
        setLanguageDataLoading(false);
      })
      .catch((error) => {
        setLanguageDataLoading(false);
        console.log(error);
      });

    // fetch the commit data from the API
    axios
      .get(`/user/${submittedUsername}/${repo.name}/commits/20`)
      .then((res) => {
        setCommitDataLoading(false);

        // could be empty object
        let commitInfo = res.data;
        if (!res.data) {
          commitInfo = [];
        }

        if (commitInfo.length > 0) {
          // if we have any commits ...
          commitInfo = parseCommitInfo(commitInfo);
        }


        setcurRepoCommitData(commitInfo);
      })
      .catch((error) => {
        // can occur when no commits found/forked repo w no commits from user
        setCommitDataLoading(false);
        setcurRepoCommitData([]);
        console.log(error);
      });
  };

  return (
    <div className="App">
      <Container
        fluid
        style={{
          height: "100vh",
        }}
        className="App__Container"
      >
        {/* No Username */}
        {noUsernameError && (
          <Toast
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              margin: "10px",
            }}
            className="text-muted"
            onClose={() => setNoUsernameError(false)}
            show={noUsernameError}
            delay={2000}
            autohide
          >
            <Toast.Header className="bg-info text-white">
              <strong className="mr-auto">No Username</strong>
              <small>Now</small>
            </Toast.Header>
            <Toast.Body>Please enter a username before proceeding</Toast.Body>
          </Toast>
        )}

        {/* Invalid Username */}
        {invalidUsernameError && (
          <Toast
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              margin: "10px",
            }}
            className="text-muted"
            onClose={() => setInvalidUsernameError(false)}
            show={invalidUsernameError}
            delay={2000}
            autohide
          >
            <Toast.Header className="bg-danger text-white">
              <strong className="mr-auto">Invalid Username</strong>
              <small>Now</small>
            </Toast.Header>
            <Toast.Body>
              User <strong>{submittedUsername}</strong> doesn't seem to exist :(
            </Toast.Body>
          </Toast>
        )}

        <Row>
          {/* sidebar */}
          <Col
            xs={2}
            className="App__Sidebar"
            style={{
              height: "100vh",
            }}
          >
            {/* Heading */}
            <h1 className="App__Header">GitHub Access</h1>

            {/* Username input */}
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                handleUsernameSubmission(e);
              }}
            >
              <Form.Group controlId="FormUsername">
                <Form.Label>Username:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="GitHub Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>
              {/* Submit Username */}
              <Button variant="primary" className="btn-block" type="submit">
                Get Repos
              </Button>
            </Form>

            <hr />
            {/* Loading spinner ... */}
            {sidebarLoading && (
              <Container className="App__Sidebar__Spinner">
                <Spinner animation="border" role="status" variant="info">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              </Container>
            )}

            {/* Table of repos */}
            {repos.length > 0 && !sidebarLoading && (
              <Row className="App__Sidebar__Repos">
                <Table
                  striped
                  bordered
                  className="App__Sidebar__Repos__ReposTable"
                >
                  <thead>
                    <tr
                      style={{
                        cursor: "default",
                      }}
                    >
                      <th>Select a Repo:</th>
                    </tr>
                  </thead>
                  <tbody>
                    {repos.map((repo, index) => {
                      return (
                        <tr
                          key={index}
                          onClick={() => {
                            handleRepoSelection(repo);
                          }}
                        >
                          <td>{repo.name}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Row>
            )}
          </Col>

          <Col xs={10} className="App__MainContent">
            {/* User hasn't selected a repo yet */}
            {!repoActive && (
              <Container className="App__MainContent__NoData">
                <h2>Select a repo to display data</h2>
              </Container>
            )}

            {/* User has selected a Repo */}
            {repoActive && (
              // Header
              <Container fluid>
                <Row className="App__MainContent__Header">
                  <h2>
                    <span className="header-weak">{submittedUsername}/ </span>
                    <span className="header-strong">
                      <strong>
                        <a
                          href={curRepo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {curRepo.name} <FontAwesomeIcon icon={faAngleRight} />
                        </a>
                      </strong>
                    </span>
                  </h2>
                </Row>

                {/* Commits Per Day */}
                <Container fluid className="App__MainContent__Container">
                  <Row>
                    <h3 className="main-content-header">
                      Commits Per Day for <strong>{curRepo.name}</strong>
                    </h3>
                  </Row>
                  <Row className="main-content-row">
                    <Accordion className="App__MainContent__Accordian">
                      <Card>
                        <Accordion.Toggle
                          as={Card.Header}
                          variant="link"
                          eventKey="0"
                        >
                          <div
                            style={{ textAlign: "right" }}
                            className="text-info"
                          >
                            More Info {"  "}
                            <FontAwesomeIcon icon={faAngleDown} />
                          </div>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                          <ListGroup className="list-group-flush">
                            <ListGroupItem className="text-dark">
                              Groups the repository's most recent 20 commits by
                              their commit date. This graph helps give an
                              overview of the most productive dates with
                              resepect to recent activity in the repository
                            </ListGroupItem>
                            <ListGroupItem className="text-secondary">
                              Click on a date bar to view detailed information
                              about a particular day.
                            </ListGroupItem>
                          </ListGroup>
                        </Accordion.Collapse>
                      </Card>
                    </Accordion>
                  </Row>
                  <Row className="main-content-row">
                    <CommitsPerDayGraph commitData={curRepoCommitData} />
                  </Row>
                </Container>

                {/* Commit Density */}
                <Container fluid className="App__MainContent__Container">
                  <Row>
                    <h3 className="main-content-header">
                      Commit Density for <strong>{curRepo.name}</strong>
                    </h3>
                  </Row>
                  <Row className="main-content-row">
                    <Accordion className="App__MainContent__Accordian">
                      <Card>
                        <Accordion.Toggle
                          as={Card.Header}
                          variant="link"
                          eventKey="0"
                        >
                          <div
                            style={{ textAlign: "right" }}
                            className="text-info"
                          >
                            More Info {"  "}
                            <FontAwesomeIcon icon={faAngleDown} />{" "}
                          </div>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                          <ListGroup className="list-group-flush">
                            <ListGroupItem className="text-dark">
                              Shows the time between a given commit and the
                              previous commit in days, using up to the most
                              recent 20 commits. Lower is better, with a score
                              of 0 indicating that the two commits occurred on
                              the same day. Note that commits are in ascending
                              order of recency. This graph can be used to track
                              periods of inactivity for the project, or features
                              that took a relatively long time to implement.
                            </ListGroupItem>
                            <ListGroupItem className="text-secondary">
                              Click on a commit to view detailed information.
                            </ListGroupItem>
                          </ListGroup>
                        </Accordion.Collapse>
                      </Card>
                    </Accordion>
                  </Row>
                  <Row className="main-content-row">
                    <CommitGraph commitData={curRepoCommitData}></CommitGraph>
                  </Row>
                </Container>

                {/* Language Breakdown */}
                <Container fluid className="App__MainContent__Container">
                  <Row>
                    <h3 className="main-content-header">
                      Language breakdown for <strong>{curRepo.name}</strong>
                    </h3>
                  </Row>
                  <Row className="main-content-row">
                    <Accordion className="App__MainContent__Accordian text-dark">
                      <Card>
                        <Accordion.Toggle
                          as={Card.Header}
                          variant="link"
                          eventKey="0"
                        >
                          <div
                            style={{ textAlign: "right" }}
                            className="text-info"
                          >
                            More Info {"  "}
                            <FontAwesomeIcon icon={faAngleDown} />{" "}
                          </div>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                          <Card.Body>
                            Compares languages used in the repo by quanity of
                            code (KBs). The inner bar represents the most
                            utilised language, and the outer bars show the
                            fractional use of other languages relative to this
                            most popular language
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    </Accordion>
                    {/* <p>
                      <i>
                        Compares languages used in the repo by lines of code
                        (KBs)
                      </i>
                    </p> */}
                  </Row>
                  <Row>
                    <LanguagePiechart
                      languageInfo={repoLanguageData}
                      loading={languageDataLoading}
                    />{" "}
                  </Row>
                </Container>
              </Container>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
