import TeamPlayerManager from "@/components/TeamPlayerManager";

export default function PlayersPage() {
  console.log("Page is rendering...");
  return (
    <div>
      <h1>Hello from /team-player</h1>
      <TeamPlayerManager />
    </div>
  );
  // return <TeamPlayerManager />;
}
