import { useState } from "react";
import HomeNav from "../HomeNav/HomeNav";
import DriverList from "../DriverList/DriverList";

function HomePage() {
  const [name, setName] = useState("");

  return (
    <div>
      <HomeNav name={name} setName={setName} />
      <DriverList name={name} />
    </div>
  );
}

export default HomePage;
