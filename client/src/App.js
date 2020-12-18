import axios from "axios";
import { useState } from "react";

function App() {
  const [serverResponses, setServerResponses] = useState([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [noUsernameError, setNoUsernameError] = useState(false);

  const hitBackend = () => {
    setLoading(true);
    axios.get("/test").then((response) => {
      setLoading(false);

      console.log(response.data);
      setServerResponses((serverResponses) => [
        ...serverResponses,
        response.data,
      ]);
    });
  };

  const clearResponses = () => {
    setServerResponses((serverResponses) => []);
  };

  const submitUserRequest = () => {
    if (username) {
      setLoading(true);
      setNoUsernameError(false);

      axios
        .get(`/user/${username}`)
        .then((res) => {
          setLoading(false);
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
      setNoUsernameError(true);
    }
  };

  const getUserRepos = () => {
    if (username) {
      setLoading(true);
      setNoUsernameError(false);

      axios
        .get(`/user/${username}/repo`)
        .then((res) => {
          setLoading(false);
          console.log(res.data);
          setServerResponses((serverResponses) => [
            ...serverResponses,
            res.data,
          ]);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setNoUsernameError(true);
    }
  };

  const getUserRepoSizes = () => {
    if (username) {
      setLoading(true);
      setNoUsernameError(false);

      axios
        .get(`/user/${username}/repo`)
        .then((response) => {
          setLoading(false);

          // response an array of objects for each repo
          let total_size_kbs = 0;

          let serverResponseItem = `Showing Repo Sizes for "${username}":\n\n`;

          let repos = response.data;
          console.log(repos);

          if (typeof repos === "string") { // repos is error string
            serverResponseItem = repos;
          } else {
            repos.forEach((repo) => {
              console.log(
                `Repo name: ${repo.name}\nRepo Size (KBs): ${repo.size}`
              );
              serverResponseItem += `\nRepo name: ${repo.name}\n\tRepo Size (KBs): ${repo.size}`;
              total_size_kbs += repo.size;
            });

            console.log(
              `Total size of ${username}'s public repos: ${total_size_kbs} KBs`
            );
            serverResponseItem += `\n\t\tTotal size of ${username}'s public repos: ${total_size_kbs} KBs`;
          }

          setServerResponses((serverResponses) => [
            ...serverResponses,
            serverResponseItem,
          ]);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      noUsernameError(true);
    }
  };

  return (
    <>
      <h1>Github API Access Demo</h1>
      <p>
        Enter a username and retrieve information on the user's public
        repositories and their sizes:
      </p>
      <button onClick={hitBackend} style={{ marginRight: "20px" }}>
        Contact Backend
      </button>
      <input
        type="text"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
      <button onClick={submitUserRequest}>Render Raw User Info</button>
      <button onClick={getUserRepos}>Get Raw Repo Info</button>
      <button onClick={getUserRepoSizes}>Get Repo Sizes</button>
      <button onClick={clearResponses} style={{ marginLeft: "20px" }}>
        Clear Responses
      </button>

      {username ? <p>Looking for: {username}</p> : <></>}
      {loading ? <p>Loading ...</p> : <></>}
      {noUsernameError ? (
        <p style={{ color: "red" }}>Please enter a username</p>
      ) : (
        <></>
      )}

      {serverResponses.map((response, index) => {
        return (
          <div key={index}>
            <hr />
            <p><b>R{index+1}</b></p>
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
    </>
  );
}

export default App;
