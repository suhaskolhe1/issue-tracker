import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { FolderIcon, CheckCircleIcon, UsersIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

const navItems = [
    { name: 'Projects', href: '/projects', icon: FolderIcon },
    { name: 'My Issues', href: '/issues', icon: CheckCircleIcon },
    { name: 'Team', href: '/team', icon: UsersIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

export const Layout: React.FC = () => {
    return (
        <div className="flex h-screen bg-surface">
            {/* Sidebar Navigation */}
            <aside className="w-64 border-r border-stone-200 bg-surface-muted flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-stone-200">
                    <span className="text-lg font-bold text-stone-900 tracking-tight">Platform</span>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-sm transition-colors duration-150 ${
                                    isActive
                                        ? 'bg-stone-200 text-stone-900'
                                        : 'text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5 opacity-75" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                {/* User Profile Area (Mock for now) */}
                <div className="p-4 border-t border-stone-200">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-sm bg-accent text-white flex items-center justify-center text-sm font-bold">
                            TU
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-stone-900">Test User</span>
                            <span className="text-xs text-stone-500">Developer</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Dynamic Page Content injected by React Router */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-5xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};
