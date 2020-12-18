import axios from "axios";
import { useState } from "react";

function App() {
  const [serverResponses, setServerResponses] = useState([]);
  const [username, setUsername] = useState("");

  const hitBackend = () => {
    axios.get("/test").then((response) => {
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
      axios
        .get(`/user/${username}`)
        .then((res) => {
          console.log(res);
          setServerResponses((serverResponses) => [
            ...serverResponses,
            res.data.items[0],
          ]);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const getUserRepos = () => {
    if (username) {
      axios
        .get(`/user/${username}/repo`)
        .then((res) => {
          console.log(res.data);
          setServerResponses((serverResponses) => [
            ...serverResponses,
            res.data,
          ]);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const getUserRepoSizes = () => {
    if (username) {
      axios
        .get(`/user/${username}/repo`)
        .then((response) => {
          // response an array of objects for each repo
          let total_size_kbs = 0;

          let serverResponseItem = `Showing Repo Sizes for "${username}":\n\n`;

          let repos = response.data;
          console.log(repos);

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
  
          setServerResponses((serverResponses) => [
            ...serverResponses,
            serverResponseItem,
          ]);
        })
        .catch((error) => {
          console.log(error);
        });
    } else console.log("Invalid username submitted");
  };

  return (
    <>
      <h1>Github API Access Demo</h1>
      <p>
        Enter a username and retrieve information on the user's public
        repositories and their sizes:
      </p>
      <button onClick={hitBackend}>Contact Backend</button>
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
      <button onClick={clearResponses}>Clear Responses</button>

      {username ? <p>Looking for: {username}</p> : <></>}

      {serverResponses.map((response, index) => {
        return (
          <div key={index}>
            <hr />
            <p>{index}</p>
            {typeof response === "object" ? (
              <div>
                <pre>{JSON.stringify(response, null, 2)}</pre>
              </div>
            ) : (
              <p id={index} style={{
                whiteSpace: "pre-wrap",
              }}>
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
