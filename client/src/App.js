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
  Fade,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [debug, setDebug] = useState(true);
  const [serverResponses, setServerResponses] = useState([]);

  const [username, setUsername] = useState("");
  const [repos, setRepos] = useState([]);

  const [sidebarLoading, setSidebarLoading] = useState(false);
  const [noUsernameError, setNoUsernameError] = useState(false);

  // just the info we need from a Repo response for the sidebar
  function RepoConcise(name, url) {
    this.name = name;
    this.url = url;
  }

  const hitBackend = () => {
    axios.get("/test").then((response) => {
      console.log(response.data);
      setServerResponses((serverResponses) => [
        ...serverResponses,
        response.data,
      ]);
    });
  };

  const getReposForUsername = () => {
    if (username) {
      setSidebarLoading(true);
      axios
        .get(`/user/${username}/repo`)
        .then((res) => {
          setSidebarLoading(false);
          console.log(res.data);
          if (Array.isArray(res.data)) {
            const repos = res.data;
            repos.forEach((repo, index, arr) => {
              arr[index] = new RepoConcise(repo.name, repo.url);
            });
            console.log(repos);

            setRepos(repos);
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

  const submitUserRequest = () => {
    if (username) {
      axios
        .get(`/user/${username}`)
        .then((res) => {
          console.log(res);
          if (res.data.items) {
            setServerResponses((serverResponses) => [
              ...serverResponses,
              res.data.items[0],
            ]);
          } else {
            setServerResponses((serverResponses) => [
              ...serverResponses,
              res.data,
            ]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  const handleUsernameSubmission = (e) => {
    getReposForUsername();
  };

  return (
    <div className="App">
      <Container fluid>
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

        <Row>
          {/* sidebar */}
          <Col xs={2} className="App__Sidebar">
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
                  hover
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
                        <tr key={index}>
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
            {serverResponses.map((response, index) => {
              return (
                <div key={index}>
                  <hr />
                  <p>
                    <b>R{index + 1}</b>
                  </p>
                  {typeof response === "object" ? (
                    <div>
                      <pre>{JSON.stringify(response, null, 2)}</pre>
                    </div>
                  ) : (
                    <p
                      id={index}
                      style={{
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {response}
                    </p>
                  )}
                </div>
              );
            })}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

// function App() {
//   const [serverResponses, setServerResponses] = useState([]);
//   const [username, setUsername] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [noUsernameError, setNoUsernameError] = useState(false);

//   const hitBackend = () => {
//     setLoading(true);
//     axios.get("/test").then((response) => {
//       setLoading(false);

//       console.log(response.data);
//       setServerResponses((serverResponses) => [
//         ...serverResponses,
//         response.data,
//       ]);
//     });
//   };

//   const clearResponses = () => {
//     setServerResponses((serverResponses) => []);
//   };

//   const submitUserRequest = () => {
//     if (username) {
//       setLoading(true);
//       setNoUsernameError(false);

//       axios
//         .get(`/user/${username}`)
//         .then((res) => {
//           setLoading(false);
//           console.log(res);
//           if (res.data.items) {
//             setServerResponses((serverResponses) => [
//               ...serverResponses,
//               res.data.items[0],
//             ]);
//           } else {
//             setServerResponses((serverResponses) => [
//               ...serverResponses,
//               res.data,
//             ]);
//           }
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     } else {
//       setNoUsernameError(true);
//     }
//   };

//   const getUserRepos = () => {
//     if (username) {
//       setLoading(true);
//       setNoUsernameError(false);

//       axios
//         .get(`/user/${username}/repo`)
//         .then((res) => {
//           setLoading(false);
//           console.log(res.data);
//           setServerResponses((serverResponses) => [
//             ...serverResponses,
//             res.data,
//           ]);
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     } else {
//       setNoUsernameError(true);
//     }
//   };

//   const getUserRepoSizes = () => {
//     if (username) {
//       setLoading(true);
//       setNoUsernameError(false);

//       axios
//         .get(`/user/${username}/repo`)
//         .then((response) => {
//           setLoading(false);

//           // response an array of objects for each repo
//           let total_size_kbs = 0;

//           let serverResponseItem = `Showing Repo Sizes for "${username}":\n\n`;

//           let repos = response.data;
//           console.log(repos);

//           if (typeof repos === "string") { // repos is error string
//             serverResponseItem = repos;
//           } else {
//             repos.forEach((repo) => {
//               console.log(
//                 `Repo name: ${repo.name}\nRepo Size (KBs): ${repo.size}`
//               );
//               serverResponseItem += `\nRepo name: ${repo.name}\n\tRepo Size (KBs): ${repo.size}`;
//               total_size_kbs += repo.size;
//             });

//             console.log(
//               `Total size of ${username}'s public repos: ${total_size_kbs} KBs`
//             );
//             serverResponseItem += `\n\t\tTotal size of ${username}'s public repos: ${total_size_kbs} KBs`;
//           }

//           setServerResponses((serverResponses) => [
//             ...serverResponses,
//             serverResponseItem,
//           ]);
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     } else {
//       noUsernameError(true);
//     }
//   };

//   return (
//     <>
//       <h1>Github API Access Demo</h1>
//       <p>
//         Enter a username and retrieve information on the user's public
//         repositories and their sizes:
//       </p>
//       <button onClick={hitBackend} style={{ marginRight: "20px" }}>
//         Contact Backend
//       </button>
//       <input
//         type="text"
//         value={username}
//         onChange={(e) => {
//           setUsername(e.target.value);
//         }}
//       />
//       <button onClick={submitUserRequest}>Render Raw User Info</button>
//       <button onClick={getUserRepos}>Get Raw Repo Info</button>
//       <button onClick={getUserRepoSizes}>Get Repo Sizes</button>
//       <button onClick={clearResponses} style={{ marginLeft: "20px" }}>
//         Clear Responses
//       </button>

//       {username ? <p>Looking for: {username}</p> : <></>}
//       {loading ? <p>Loading ...</p> : <></>}
//       {noUsernameError ? (
//         <p style={{ color: "red" }}>Please enter a username</p>
//       ) : (
//         <></>
//       )}

//       {serverResponses.map((response, index) => {
//         return (
//           <div key={index}>
//             <hr />
//             <p><b>R{index+1}</b></p>
//             {typeof response === "object" ? (
//               <div>
//                 <pre>{JSON.stringify(response, null, 2)}</pre>
//               </div>
//             ) : (
//               <p
//                 id={index}
//                 style={{
//                   whiteSpace: "pre-wrap",
//                 }}
//               >
//                 {response}
//               </p>
//             )}
//           </div>
//         );
//       })}
//     </>
//   );
// }

// export default App;

export default App;
