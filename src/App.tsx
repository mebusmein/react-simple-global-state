import "./App.css";
import { SearchForm } from "./modules/Search/components/SearchForm";
import { SearchData } from "./modules/Search/components/SearchData";

function App() {
  return (
    <>
      <h1>Search State Demo</h1>
      <div className="card">
        <div
          style={{
            width: "100%",
            display: "flex",
            gap: "2rem",
            justifyContent: "center",
          }}
        >
          <SearchForm />
          <SearchData />
        </div>
      </div>
    </>
  );
}

export default App;
