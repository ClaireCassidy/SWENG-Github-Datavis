
import axios from 'axios';
import { useState } from 'react'; 

function App() {
  console.log("Log");

  const [serverResponses, setServerResponses] = useState([]);

  const hitBackend = () => {
    axios.get('/test')
      .then((response) => {
        console.log(response.data);
        setServerResponses((serverResponses) => [...serverResponses, response.data]);
      });
  }

  const sendReqClienSide = () => {
    axios.get('https://api.github.com/search/users?q=esjmb')
    .then((response) => {
      console.log(response.data);
    });
  }

  return (
    <>
      <h1>Hello World!</h1>
      <button onClick={hitBackend}>Send request</button>
      <button onClick={sendReqClienSide}>Log Stephen's info</button>
      {serverResponses.map((response, index) => {
        return(
          <>
            <p>{index}</p>
            <p>{response}</p>
          </>
        )
      })}
    </>
  );
}

export default App;
