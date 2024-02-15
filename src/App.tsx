import Table from "./components/table";
import TablePathe from "./components/table-pathe";

function App() {
  return (
    <main className="bg-neutral-900 h-screen overflow-y-auto text-neutral-200">
      <div className="mt-8 mx-auto container flex flex-col gap-12">
        <div>
          <h1 className="text-3xl font-bold">UGC Data AVP à Paris</h1>
          <div className="my-4 rounded-xl border border-neutral-700">
            <Table />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold">Pathé Data AVP à Paris</h1>
          <div className="my-4 rounded-xl border border-neutral-700">
            <TablePathe />
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
