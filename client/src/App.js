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
} from "react-bootstrap";
import CommitGraph from "./CommitGraph";
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

  // has a repo been selected from the list
  const [repoActive, setRepoActive] = useState(false);
  const [curRepo, setCurRepo] = useState(null);
  const [languageDataLoading, setLanguageDataLoading] = useState(false);
  const [repoLanguageData, setRepoLanguageData] = useState({}); // used to render the radial chart
  // commit data for curRepo
  const [curRepoCommits, setCurRepoCommits] = useState([]);

  // just the info we need from a Repo response for the sidebar
  function RepoConcise(name, url) {
    this.name = name;
    this.url = url;
  }

  const parseLanguageInfo = (languageInfo) => {
    let languagesFormatted = [];

    // array [{language: size}, ...]
    let kvps = Object.entries(languageInfo);
    console.log(kvps);

    for (
      let i = 0;
      i < Math.min(kvps.length, RADIAL_CHART_COLOURS.length);
      i++
    ) {
      console.log(kvps[i]);
      const [language, size] = kvps[i];
      console.log(`Language: ${language}, Size: ${size}`);

      languagesFormatted.push({
        name: language,
        size: size,
        fill: RADIAL_CHART_COLOURS[i],
      });
    }

    return languagesFormatted;
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
    setLanguageDataLoading(true);

    // fetch the language data from api
    axios
      .get(`/user/${submittedUsername}/${repo.name}/languages`)
      .then((res) => {
        console.log(res.data);
        setLanguageDataLoading(false);

        let languageInfo = res.data;

        if (!(Object.keys(languageInfo).length === 0)) {
          languageInfo = parseLanguageInfo(languageInfo);
          console.log(languageInfo);
        }

        setRepoLanguageData(languageInfo); // may be empty object
      })
      .catch((error) => {
        setLanguageDataLoading(false);
        console.log(error);
      });

      // fetch the commit data from the API
  };

  return (
    <div className="App">
      <Container
        fluid
        style={{
          height: "100vh",
        }}
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
                          {curRepo.name}
                        </a>
                      </strong>
                    </span>
                  </h2>
                </Row>
                <Row>
                  <CommitGraph repo={curRepo}></CommitGraph>
                </Row>
                <Container fluid className="App__MainContent__LanguagesContainer">
                  <Row>
                    <h3 className="languages-header">
                      Language breakdown for <strong>{curRepo.name}</strong>
                    </h3>
                  </Row>
                  <Row>
                    <p><i>Compares languages used in the repo by lines of code (KBs)</i></p>
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
