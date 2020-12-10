import axios from "axios";
import { useState } from "react";

function App() {
  console.log("Log");

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

  const stockRequest = () => {
    axios
      .get("https://api.github.com/search/users?q=esjmb")
      .then((response) => {
        console.log(response.data);
      });
  };

  const submitUserRequest = () => {
    if (username !== "") {

      axios
        .get(`https://api.github.com/search/users?q=${username}`)
        .then((response) => {
          console.log(response.data);
          const reposUrl = response.data.items[0].repos_url;
          console.log(reposUrl);

          if (reposUrl) logSizeRepos(username, reposUrl);
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
        
        let repos = res.data;
        console.log(repos);
        repos.map(repo => {
          console.log(`Repo name: ${username}\nRepo Size (KBs): ${repo.size}`);
          total_size_kbs += repo.size;
        });

        console.log(`Total size of ${username}'s repos: ${total_size_kbs} KBs`);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      <h1>Hello World!</h1>
      <button onClick={hitBackend}>Send request</button>
      <button onClick={stockRequest}>Log Stephen's info</button>
      <input
        type="text"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
      <button onClick={submitUserRequest}>Submit</button>
      <p>{username}</p>
      {serverResponses.map((response, index) => {
        return (
          <>
            <p>{index}</p>
            <p>{response}</p>
          </>
        );
      })}
    </>
  );
}

export default App;

