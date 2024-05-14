import "./App.css";
import MultiSelect from "./components/MultiSelect";
import Profile from "./components/Forms/Profile";
import Login from "./components/Forms/Logjn";
import Register from "./components/Forms/Register";

function App() {
  return (
    <>
      {/* <DemoProfile /> */}
      <Profile />
      {/* <Login onClickClose={() => console.log("close")} /> */}
      {/* <Register onClickClose={() => console.log("close")} /> */}
    </>
  );
}

export default App;
