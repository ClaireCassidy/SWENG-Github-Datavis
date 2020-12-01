
import axios from 'axios';

function App() {
  console.log("Log");

  const hitBackend = () => {
    axios.get('/test')
      .then((response) => {
        console.log(response.data);
      });
  }

  return (
    <>
      <h1>Hello World!</h1>
      <button onClick={hitBackend}>Send request</button>
    </>
  );
}

export default App;
