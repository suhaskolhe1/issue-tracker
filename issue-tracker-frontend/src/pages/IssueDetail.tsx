import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {addComment, getIssueDetails, updateIssueStatus} from '../features/issues/issueService';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export const IssueDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['issue', id],
        queryFn: () => getIssueDetails(Number(id)),
        enabled: !!id,
    });

    const statusMutation = useMutation({
        mutationFn: (newStatus: string) => updateIssueStatus(Number(id), newStatus),
        onSuccess: () => {
            // Refresh the data to instantly show the new audit log entry!
            queryClient.invalidateQueries({ queryKey: ['issue', id] });
        },
    });

    const [newComment, setNewComment] = React.useState('');
    const commentMutation = useMutation({
        mutationFn: (content: string) => addComment(Number(id), content),
        onSuccess: () => {
            setNewComment('');
            queryClient.invalidateQueries({ queryKey: ['issue', id] });
        },
    });
    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        commentMutation.mutate(newComment);
    };


    if (isLoading) return <div className="p-8 text-stone-500">Loading issue...</div>;
    if (!data) return <div className="p-8 text-red-500">Issue not found.</div>;

    const { issue, activities } = data;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <Link to="/issues" className="inline-flex items-center text-sm font-medium text-stone-500 hover:text-stone-900 mb-4 transition-colors">
                    <ArrowLeftIcon className="w-4 h-4 mr-1" />
                    Back to Issues
                </Link>
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-stone-900 tracking-tight">
                        <span className="text-stone-400 font-medium mr-3">{issue.issueKey}</span>
                        {issue.title}
                    </h1>

                    {/* Status Dropdown to trigger our Audit Log! */}
                    <select
                        className="px-3 py-1.5 bg-white border border-stone-300 rounded-sm text-sm font-medium focus:ring-2 focus:ring-accent outline-none"
                        value={issue.status}
                        onChange={(e) => statusMutation.mutate(e.target.value)}
                        disabled={statusMutation.isPending}
                    >
                        <option value="TODO">TODO</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="DONE">DONE</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="col-span-2 space-y-8">
                    <div className="bg-white border border-stone-200 rounded-sm p-6">
                        <h3 className="text-sm font-medium text-stone-900 mb-2">Description</h3>
                        <p className="text-stone-600 whitespace-pre-wrap">{issue.description || 'No description provided.'}</p>
                    </div>
                {/* Comments Section */}
                <div className="bg-white border border-stone-200 rounded-sm p-6 mt-8">
                    <h3 className="text-sm font-medium text-stone-900 mb-4">Comments</h3>

                    <div className="space-y-6 mb-6">
                        {data.comments.map(comment => (
                            <div key={comment.id} className="flex gap-4">
                                <div className="w-8 h-8 rounded-sm bg-stone-200 flex items-center justify-center text-sm font-medium text-stone-700 shrink-0">
                                    {comment.author.firstName[0]}
                                </div>
                                <div>
                                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-medium text-stone-900 text-sm">
                        {comment.author.firstName} {comment.author.lastName}
                      </span>
                                        <span className="text-xs text-stone-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                                    </div>
                                    <p className="text-sm text-stone-700">{comment.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleCommentSubmit} className="mt-4">
              <textarea
                  rows={3}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-sm text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-accent resize-none mb-2"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
              />
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={commentMutation.isPending || !newComment.trim()}
                                className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-sm hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50"
                            >
                                {commentMutation.isPending ? 'Posting...' : 'Post Comment'}
                            </button>
                        </div>
                    </form>
                </div>
                </div>


                {/* Sidebar: Audit Timeline */}
                <div className="col-span-1">
                    <h3 className="text-sm font-medium text-stone-900 mb-4">Activity</h3>
                    <div className="space-y-4">
                        {activities.length === 0 ? (
                            <p className="text-sm text-stone-500">No activity yet.</p>
                        ) : (
                            activities.map(activity => (
                                <div key={activity.id} className="flex gap-3 text-sm">
                                    <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-xs font-medium text-stone-600 shrink-0">
                                        {activity.actor.firstName[0]}
                                    </div>
                                    <div>
                                        <p className="text-stone-900">
                                            <span className="font-medium">{activity.actor.firstName} {activity.actor.lastName}</span>
                                            {' '}changed status to <span className="font-medium">{activity.newValue}</span>
                                        </p>
                                        <p className="text-xs text-stone-500 mt-0.5">
                                            {new Date(activity.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
