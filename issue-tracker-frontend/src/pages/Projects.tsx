import React, {useState} from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProjects, createProject, type CreateProjectRequest } from '../features/projects/projectService';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { PlusIcon } from '@heroicons/react/24/outline';

export const Projects: React.FC = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [projectKey, setProjectKey] = useState('');
    const [description, setDescription] = useState('');
    // 1. Fetch projects using React Query
    const { data: projects, isLoading, isError } = useQuery({
        queryKey: ['projects'],
        queryFn: getProjects,
    });
    const createMutation = useMutation({
        mutationFn: createProject,
        onSuccess: () => {
            // Refresh the project list instantly!
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            setIsModalOpen(false);
            setName('');
            setProjectKey('');
            setDescription('');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newProject: CreateProjectRequest = {
            name,
            projectKey,
            description,
            organizationId: 1, // Hardcoded to our dummy org for now!
        };
        createMutation.mutate(newProject);
    };

    return (
        <div>
            {/* Header Area */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-stone-900 tracking-tight">Projects</h1>
                    <p className="text-sm text-stone-500 mt-1">Manage your organization's projects.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                    <PlusIcon className="w-4 h-4" />
                    New Project
                </Button>
            </div>
            {/* Main Content Area */}
            {isLoading && <div className="text-stone-500">Loading projects...</div>}
            {isError && <div className="text-red-500">Failed to load projects.</div>}

            {!isLoading && !isError && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects?.map((project) => (
                        <div key={project.id} className="p-5 border border-stone-200 rounded-sm bg-white hover:border-stone-300 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-stone-900">{project.name}</h3>
                                <span className="text-xs font-medium px-2 py-1 bg-stone-100 text-stone-600 rounded-sm">
                  {project.projectKey}
                </span>
                            </div>
                            <p className="text-sm text-stone-500 line-clamp-2">{project.description}</p>
                        </div>
                    ))}
                    {projects?.length === 0 && (
                        <div className="col-span-full p-8 text-center border border-dashed border-stone-300 text-stone-500 rounded-sm">
                            No projects yet. Click "New Project" to create one.
                        </div>
                    )}
                </div>
            )}
            {/* Extremely simple, accessible Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-white rounded-sm shadow-xl border border-stone-200">
                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-stone-900 mb-4">Create New Project</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input
                                    label="Project Name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                    placeholder="e.g. Payment Gateway"
                                />
                                <Input
                                    label="Project Key"
                                    value={projectKey}
                                    onChange={e => setProjectKey(e.target.value.toUpperCase())}
                                    required
                                    maxLength={10}
                                    placeholder="e.g. PAY"
                                />
                                <Input
                                    label="Description"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="Brief description..."
                                />
                                <div className="pt-4 flex justify-end gap-3">
                                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                    <Button type="submit" isLoading={createMutation.isPending}>Create</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};