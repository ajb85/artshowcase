import { Route, Routes } from "react-router-dom";

import { Login, ImageManager, Gallery, FullPageImage } from "atoms";
import { useAccount } from "hooks/";

function App() {
  const { token } = useAccount();
  return (
    <div className="App">
      <Routes>
        <Route path="/" exact element={<Gallery />} />
        <Route path="/image/:id" element={<FullPageImage />} />
        <Route
          path="/manager"
          element={token.validated ? <ImageManager /> : <Login />}
        />
      </Routes>
    </div>
  );
}

export default App;
