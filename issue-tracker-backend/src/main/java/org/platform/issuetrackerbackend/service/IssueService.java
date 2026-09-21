package org.platform.issuetrackerbackend.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.platform.issuetrackerbackend.dto.IssueRequest;
import org.platform.issuetrackerbackend.entity.*;
import org.platform.issuetrackerbackend.repository.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class IssueService {

    private final IssueRepository issueRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final IssueActivityRepository activityRepository;
    private final CommentRepository commentRepository;

    public Issue createIssue(IssueRequest request) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User reporter = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));

        User assignee = null;
        if (request.getAssigneeId() != null) {
            assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new IllegalArgumentException("Assignee not found"));
        }


        String issueKey = project.getProjectKey() + "-" + (int)(Math.random() * 10000);

        Issue issue = Issue.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .type(request.getType())
                .priority(request.getPriority())
                .project(project)
                .reporter(reporter)
                .assignee(assignee)
                .issueKey(issueKey)
                .build();

        return issueRepository.save(issue);
    }

    public List<Issue> getIssuesByProject(Long projectId) {
        return issueRepository.findByProjectId(projectId);
    }

    @Transactional
    public Issue updateIssueStatus(Long issueId, org.platform.issuetrackerbackend.entity.Status newStatus) {
        // 1. Get the current user
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User actor = userRepository.findByEmail(email).orElseThrow();
        // 2. Fetch the issue (will fail if someone else deleted it!)
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new IllegalArgumentException("Issue not found"));
        // 3. Only proceed if the status is actually changing
        if (issue.getStatus() != newStatus) {

            // 4. Create the Audit Log entry
            IssueActivity activity = IssueActivity.builder()
                    .actionType("STATUS_CHANGED")
                    .oldValue(issue.getStatus().name())
                    .newValue(newStatus.name())
                    .issue(issue)
                    .actor(actor)
                    .build();

            // 5. Save the activity
            activityRepository.save(activity);

            // 6. Update the issue itself
            issue.setStatus(newStatus);
            issueRepository.save(issue);
        }
        return issue;
    }

    public org.platform.issuetrackerbackend.dto.IssueDetailsResponse getIssueDetails(Long issueId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new IllegalArgumentException("Issue not found"));
        List<Comment> comments =
                commentRepository.findByIssueIdOrderByCreatedAtAsc(issueId);

        List<IssueActivity> activities =
                activityRepository.findByIssueIdOrderByCreatedAtDesc(issueId);
        return org.platform.issuetrackerbackend.dto.IssueDetailsResponse.builder()
                .issue(issue)
                .comments(comments)
                .activities(activities)
                .build();
    }

    @Transactional
    public Comment addComment(Long issueId, String content) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User author = userRepository.findByEmail(email).orElseThrow();

        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new IllegalArgumentException("Issue not found"));

        Comment comment =
                org.platform.issuetrackerbackend.entity.Comment.builder()
                        .content(content)
                        .issue(issue)
                        .author(author)
                        .build();
        return commentRepository.save(comment);
    }
}
