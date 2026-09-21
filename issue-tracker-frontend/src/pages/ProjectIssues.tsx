import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getIssuesByProject, createIssue, updateIssueStatus } from '../features/issues/issueService';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { PlusIcon, ViewColumnsIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import { KanbanBoard } from '../components/KanbanBoard';
import { Link } from 'react-router-dom';

const issueSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  type: z.enum(['EPIC', 'STORY', 'TASK', 'BUG', 'SUBTASK']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
});

type IssueFormValues = z.infer<typeof issueSchema>;

export const ProjectIssues: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'board'>('board'); // Default to our cool new board!

  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');

  const projectId = 1;

  const { data: issues, isLoading } = useQuery({
    // Adding them to the queryKey means React Query will auto-refetch when they change!
    queryKey: ['issues', projectId, statusFilter, priorityFilter],
    queryFn: () => getIssuesByProject(projectId, statusFilter || undefined, priorityFilter || undefined),
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<IssueFormValues>({
    resolver: zodResolver(issueSchema),
    defaultValues: { type: 'TASK', priority: 'MEDIUM' }
  });

  const createMutation = useMutation({
    mutationFn: createIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues', projectId] });
      setIsModalOpen(false);
      reset();
    },
  });

  // The mutation that powers our Drag-and-Drop!
  const statusMutation = useMutation({
    mutationFn: ({ issueId, newStatus }: { issueId: number, newStatus: string }) =>
        updateIssueStatus(issueId, newStatus),
    onMutate: async ({ issueId, newStatus }) => {
      // OPTIMISTIC UI UPDATE:
      // We update the screen instantly before the server even responds, making it feel blazing fast!
      await queryClient.cancelQueries({ queryKey: ['issues', projectId] });
      const previousIssues = queryClient.getQueryData(['issues', projectId]);
      queryClient.setQueryData(['issues', projectId], (old: any) => {
        if (!old) return old;
        return old.map((issue: any) =>
            issue.id === issueId ? { ...issue, status: newStatus } : issue
        );
      });
      return { previousIssues };
    },
    onError: (err, newTodo, context) => {
      // If the server fails, roll it back to how it was!
      queryClient.setQueryData(['issues', projectId], context?.previousIssues);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['issues', projectId] });
    }
  });

  const onSubmit = (data: IssueFormValues) => {
    createMutation.mutate({ ...data, projectId });
  };

  const handleStatusChange = (issueId: number, newStatus: string) => {
    statusMutation.mutate({ issueId, newStatus });
  };

  return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-8 shrink-0">
          <div>
            <h1 className="text-2xl font-semibold text-stone-900 tracking-tight">Project Issues</h1>
            <p className="text-sm text-stone-500 mt-1">Manage and track work items.</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Filter Dropdowns */}
            <div className="flex gap-2 mr-4">
              <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-stone-300 rounded-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">All Statuses</option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>

              <select
                  value={priorityFilter}
                  onChange={e => setPriorityFilter(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-stone-300 rounded-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">All Priorities</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex bg-stone-200/50 p-1 rounded-sm border border-stone-200">
              <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-sm transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-accent' : 'text-stone-500 hover:text-stone-700'}`}
              >
                <ListBulletIcon className="w-5 h-5" />
              </button>
              <button
                  onClick={() => setViewMode('board')}
                  className={`p-1.5 rounded-sm transition-colors ${viewMode === 'board' ? 'bg-white shadow-sm text-accent' : 'text-stone-500 hover:text-stone-700'}`}
              >
                <ViewColumnsIcon className="w-5 h-5" />
              </button>
            </div>

            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <PlusIcon className="w-4 h-4" />
              Create Issue
            </Button>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          {isLoading ? (
              <div className="text-stone-500">Loading issues...</div>
          ) : viewMode === 'list' ? (
              <div className="bg-white border border-stone-200 rounded-sm overflow-hidden">
                <table className="w-full text-left text-sm text-stone-600">
                  <thead className="bg-surface-muted border-b border-stone-200 text-stone-900 font-medium">
                  <tr>
                    <th className="px-4 py-3">Key</th>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                  </thead>
                  <tbody>
                  {issues?.map(issue => (
                      <tr key={issue.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-stone-900">{issue.issueKey}</td>
                        <td className="px-4 py-3">
                          <Link to={`/issues/${issue.id}`} className="font-medium text-accent hover:underline">
                            {issue.title}
                          </Link>
                        </td>
                        <td className="px-4 py-3">{issue.type}</td>
                        <td className="px-4 py-3">{issue.priority}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-stone-100 rounded-sm text-xs font-medium uppercase tracking-wider">{issue.status}</span>
                        </td>
                      </tr>
                  ))}
                  {issues?.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-stone-500">No issues found.</td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
          ) : (
              <KanbanBoard issues={issues || []} onStatusChange={handleStatusChange} />
          )}
        </div>

        {/* Creation Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
              <div className="w-full max-w-lg bg-white rounded-sm shadow-xl border border-stone-200">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-stone-900 mb-4">Create New Issue</h2>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input label="Title" {...register('title')} error={errors.title?.message} />
                    <Input label="Description" {...register('description')} />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-stone-900">Type</label>
                        <select {...register('type')} className="px-3 py-2 bg-white border border-stone-300 rounded-sm focus:ring-2 focus:ring-accent outline-none">
                          <option value="EPIC">Epic</option>
                          <option value="STORY">Story</option>
                          <option value="TASK">Task</option>
                          <option value="BUG">Bug</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-stone-900">Priority</label>
                        <select {...register('priority')} className="px-3 py-2 bg-white border border-stone-300 rounded-sm focus:ring-2 focus:ring-accent outline-none">
                          <option value="LOW">Low</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HIGH">High</option>
                          <option value="CRITICAL">Critical</option>
                        </select>
                      </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-3 border-t border-stone-100 mt-6">
                      <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                      <Button type="submit" isLoading={createMutation.isPending}>Create Issue</Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};
