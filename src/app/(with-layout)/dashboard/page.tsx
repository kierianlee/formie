import Logo from "@/components/ui/logo";

const Dashboard = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-md border bg-zinc-800/40 p-6 text-center">
      <Logo variant="small" className="mb-4 w-12" />
      <div>Select or create a form.</div>
    </div>
  );
};

export default Dashboard;
