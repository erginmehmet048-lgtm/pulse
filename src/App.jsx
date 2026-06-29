import Dashboard from "./Dashboard"; 
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex">
        <Sidebar />

        <Dashboard />

      </div>
    </div>
  );
}

export default App;
