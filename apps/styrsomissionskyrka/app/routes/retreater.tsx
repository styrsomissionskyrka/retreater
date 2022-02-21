import { Outlet } from 'remix';

export default function Retreater() {
  return (
    <div>
      <h1>Retreater</h1>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
