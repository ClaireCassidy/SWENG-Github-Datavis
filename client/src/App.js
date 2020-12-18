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

  const getUserRepoSizes = () => {
    if (username !== "") {

      axios
        .get(`https://api.github.com/search/users?q=${username}`)
        .then((response) => {
          console.log(response.data);
          
          const reposUrl = response.data.items[0].repos_url;
          const languagesUrl = response.data.items[0].languages_url;
          console.log(reposUrl);
          console.log(languagesUrl);

          if (reposUrl) { 
            // print the size of the repository
            logSizeRepos(username, reposUrl);
          }
        })
        .catch((error) => {
          console.log(error.response);
        });

    } else console.log("Invalid username submitted");
  };

  const logSizeRepos = (username, url) => {
    console.log(`${username}:${url}`)
    axios
      .get(`${url}`)
      .then((res) => {
        console.log(res.data);
        let total_size_kbs = 0;

        let serverResponseItem = `Showing Repo Sizes for "${username}":\n\n`; 
        
        let repos = res.data;
        console.log(repos);
        repos.forEach(repo => {
          console.log(`Repo name: ${repo.name}\nRepo Size (KBs): ${repo.size}`);
          serverResponseItem += `\nRepo name: ${repo.name}\n\tRepo Size (KBs): ${repo.size}`;
          total_size_kbs += repo.size;
        });

        console.log(`Total size of ${username}'s public repos: ${total_size_kbs} KBs`);
        serverResponseItem += `\n\t\tTotal size of ${username}'s public repos: ${total_size_kbs} KBs`;

        setServerResponses((serverResponses) => [
          ...serverResponses,
          serverResponseItem,
        ]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

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
  }

  const getRepoLanguages = () => {
    if (username) {
      axios
        .get(`/user/${username}/size`)
        .then((res) => {
          console.log(res);
        })
    }
   }

  const newLineStyle = {
    // color: 'red',
    // fontSize: 200
    whiteSpace: 'pre-wrap'
  };

  const sizeTest = () => {
    if (username) {
      axios
        .get(`/user/${username}/size`)
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
  }

  return (
    <>
      <h1>Github API Access Demo</h1>
      <p>Enter a username and retrieve information on the user's public repositories and their sizes:</p>
      <button onClick={hitBackend}>Contact Backend</button>
      <input
        type="text"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
      <button onClick={submitUserRequest}>Render Raw Info</button>
      <button onClick={getUserRepoSizes}>Get Size</button>
      <button onClick={sizeTest}>Test Size</button>

      {username ? <p>Looking for: {username}</p> : <></>}

      {serverResponses.map((response, index) => {
        return (
          <div key={index}>
            <hr/>
            <p>{index}</p>
            {typeof response === 'object' ?
              <div><pre>{JSON.stringify(response, null, 2) }</pre></div>
              : <p id={index} style={newLineStyle}>{response}</p>}

          </div>
        );
      })}
    </>
  );
}

export default App;

