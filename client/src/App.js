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
          const languagesUrl = response.data.items[0].languages_url;
          console.log(reposUrl);
          console.log(languagesUrl);

          if (reposUrl) { 
            // print the size of the repository
            logSizeRepos(username, reposUrl);
            // print bytes of code by language
            logBreakdownByLanguage(username, languagesUrl);
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

  const logBreakdownByLanguage = (username, url) => {
    console.log(`${username}:${url}`)

    axios
      .get(`${url}`)
      .then((res) => {
        console.log(res.data)

        let languageSizes = res.data;
      })
  }

  const getRepoSize = () => {
    if (username) {
      axios
      .get(`/user/${username}`)
      .then((res) => {
        console.log(res);
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
      <button onClick={getRepoSize}>Get Size</button>
      <button onClick={getRepoLanguages}>Get Languages</button>

      <p>{username}</p>

      {serverResponses.map((response, index) => {
        return (
          <>
            <hr/>
            <p>{index}</p>
            {typeof response === 'object' ?
              <p id={index}>{JSON.stringify(response)}</p> 
              : <p id={index} style={newLineStyle}>{response}</p>}

          </>
        );
      })}
    </>
  );
}

export default App;

