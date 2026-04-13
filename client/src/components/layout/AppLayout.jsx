import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-content">
        {/* Header mobile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 16px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg)',
        }}>
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(true)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36 }}
          >
            ☰
          </button>
        </div>

        <Outlet />
      </div>
    </div>
  );
}
