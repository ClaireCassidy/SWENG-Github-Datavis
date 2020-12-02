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
    if (username != "") {
      axios
        .get(`https://api.github.com/search/users?q=${username}`)
        .then((response) => {
          console.log(response.data);
        });
    } else console.log("Invalid username submitted");
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
