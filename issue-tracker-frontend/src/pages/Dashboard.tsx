import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProjectAnalytics } from '../features/analytics/analyticsService';
import { ChartBarIcon, CheckCircleIcon, PlayIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

// A reusable sub-component for our metric cards!
const StatCard = ({ title, value, icon: Icon, colorClass }: { title: string, value: number, icon: any, colorClass: string }) => (
    <div className="bg-white p-6 border border-stone-200 rounded-sm shadow-sm flex items-center gap-4 hover:border-stone-300 transition-colors">
        <div className={`p-3 rounded-sm ${colorClass}`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-sm font-medium text-stone-500">{title}</p>
            <p className="text-2xl font-bold text-stone-900 tracking-tight">{value}</p>
        </div>
    </div>
);

export const Dashboard: React.FC = () => {
    const projectId = 1; // Hardcoded for our demo

    const { data, isLoading, isError } = useQuery({
        queryKey: ['analytics', projectId],
        queryFn: () => getProjectAnalytics(projectId),
    });

    if (isLoading) return <div className="p-8 text-stone-500">Loading dashboard...</div>;
    if (isError || !data) return <div className="p-8 text-red-500">Failed to load analytics.</div>;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-stone-900 tracking-tight">Project Overview</h1>
                <p className="text-sm text-stone-500 mt-1">Real-time metrics for Payment Gateway migration.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Issues"
                    value={data.totalIssues}
                    icon={DocumentTextIcon}
                    colorClass="bg-stone-100 text-stone-700"
                />
                <StatCard
                    title="To Do"
                    value={data.todoCount}
                    icon={ChartBarIcon}
                    colorClass="bg-blue-50 text-blue-600 border border-blue-100"
                />
                <StatCard
                    title="In Progress"
                    value={data.inProgressCount}
                    icon={PlayIcon}
                    colorClass="bg-amber-50 text-amber-600 border border-amber-100"
                />
                <StatCard
                    title="Done"
                    value={data.doneCount}
                    icon={CheckCircleIcon}
                    colorClass="bg-emerald-50 text-emerald-600 border border-emerald-100"
                />
            </div>

            {/* A placeholder for future charts (Phase 9 material!) */}
            <div className="mt-8 bg-white border border-stone-200 rounded-sm p-8 text-center border-dashed">
                <p className="text-stone-500">Burn-down charts will appear here.</p>
            </div>
        </div>
    );
};
