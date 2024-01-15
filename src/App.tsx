import { Routes, Route, HashRouter } from "react-router-dom";
import { MainPage, PlayerPage } from "./pages";
import { Theme } from "@radix-ui/themes";
import "react-contexify/dist/ReactContexify.css";
import "@radix-ui/themes/styles.css";
import { useAppSelector } from "./hooks";

function App() {
  const { primaryColor } = useAppSelector((state) => state.settings);
  return (
    <Theme>
      <style>
        {`
          ::selection {
            background: ${primaryColor} !important;
          }
          ::-moz-selection {
            background: ${primaryColor} !important;
          }
        `}
      </style>
      <HashRouter>
        <Routes>
          <Route path="*" Component={MainPage} />
          <Route path="/player" Component={PlayerPage} />
        </Routes>
      </HashRouter>
    </Theme>
  );
}

export default App;
