import SettingsClient from "./SettingsClient";

// Open to every admin: menu preferences are personal. Platform settings are gated by permission.
export default function SettingsPage() {
  return <SettingsClient />;
}
