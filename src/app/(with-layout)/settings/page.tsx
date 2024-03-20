import { auth } from "@/auth";
import { redirect } from "next/navigation";

const SettingsPage = async () => {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  redirect("/settings/teams");
};

export default SettingsPage;
