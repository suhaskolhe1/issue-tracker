import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getIssuesByProject, createIssue } from '../features/issues/issueService';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { PlusIcon } from '@heroicons/react/24/outline';

// 1. Define our Zod Schema for validation
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

  // For now, we hardcode to Project ID 1 (The Payment Gateway we made earlier)
  const projectId = 1;

  const { data: issues, isLoading } = useQuery({
    queryKey: ['issues', projectId],
    queryFn: () => getIssuesByProject(projectId),
  });

  // 2. Setup React Hook Form
  const { register, handleSubmit, formState: { errors }, reset } = useForm<IssueFormValues>({
    resolver: zodResolver(issueSchema),
    defaultValues: { type: 'TASK', priority: 'MEDIUM' }
  });

  const createMutation = useMutation({
    mutationFn: createIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues', projectId] });
      setIsModalOpen(false);
      reset(); // Clears the form instantly!
    },
  });

  const onSubmit = (data: IssueFormValues) => {
    createMutation.mutate({ ...data, projectId });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 tracking-tight">Project Issues</h1>
          <p className="text-sm text-stone-500 mt-1">Manage and track work items.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <PlusIcon className="w-4 h-4" />
          Create Issue
        </Button>
      </div>

      {isLoading ? (
        <div className="text-stone-500">Loading issues...</div>
      ) : (
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
                  <td className="px-4 py-3">{issue.title}</td>
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
      )}

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-sm shadow-xl border border-stone-200">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-stone-900 mb-4">Create New Issue</h2>

              {/* Notice how clean this form is compared to our Project form! */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Title"
                  {...register('title')}
                  error={errors.title?.message}
                />

                <Input
                  label="Description"
                  {...register('description')}
                />

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
