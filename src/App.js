import { Route, Routes } from "react-router-dom";

import { Login, ImageManager, Gallery, FullPageImage, EditSite } from "atoms";
import { useAccount } from "hooks/";
import { handleBodyClick } from "js/";

function App() {
  const { token } = useAccount();

  return (
    <div className="App" onClick={handleBodyClick}>
      <Routes>
        <Route path="/" exact element={<Gallery />} />
        <Route path="/image/:id" exact element={<FullPageImage />} />
        <Route path="/image/:id/:progressIndex" element={<FullPageImage />} />
        <Route
          path="/manager"
          element={token.validated ? <ImageManager /> : <Login />}
        />
        <Route
          path="/manager/site"
          element={token.validated ? <EditSite /> : <Login />}
        />
      </Routes>
    </div>
  );
}

export default App;
