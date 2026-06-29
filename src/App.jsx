import Dashboard from "./Dashboard";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="min-h-screen bg-[#060a12] text-white">
      <div className="mx-auto flex min-h-screen max-w-[1800px]">
        <Sidebar />
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
