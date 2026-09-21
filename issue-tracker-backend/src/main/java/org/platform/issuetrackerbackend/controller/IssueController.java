package org.platform.issuetrackerbackend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.platform.issuetrackerbackend.dto.IssueRequest;
import org.platform.issuetrackerbackend.entity.Comment;
import org.platform.issuetrackerbackend.entity.Issue;
import org.platform.issuetrackerbackend.service.IssueService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
@RequiredArgsConstructor
public class IssueController {

    private final IssueService issueService;

    @PostMapping
    public ResponseEntity<Issue> createIssue(@Valid @RequestBody IssueRequest request) {
        return ResponseEntity.ok(issueService.createIssue(request));
    }


    @PatchMapping("/{issueId}/status")
    public ResponseEntity<Issue> updateStatus(
            @PathVariable Long issueId,
            @RequestParam org.platform.issuetrackerbackend.entity.Status status) {
        return ResponseEntity.ok(issueService.updateIssueStatus(issueId, status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<org.platform.issuetrackerbackend.dto.IssueDetailsResponse> getIssueDetails(@PathVariable Long id) {
        return ResponseEntity.ok(issueService.getIssueDetails(id));
    }

    @PostMapping("/{issueId}/comments")
    public ResponseEntity<Comment> addComment(
            @PathVariable Long issueId,
            @RequestBody String content) {
        return ResponseEntity.ok(issueService.addComment(issueId, content));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Issue>> getIssuesByProject(
            @PathVariable Long projectId,
            @RequestParam(required = false) org.platform.issuetrackerbackend.entity.Status status,
            @RequestParam(required = false) org.platform.issuetrackerbackend.entity.Priority priority) {

        return ResponseEntity.ok(issueService.getIssuesByProject(projectId, status, priority));
    }

}
