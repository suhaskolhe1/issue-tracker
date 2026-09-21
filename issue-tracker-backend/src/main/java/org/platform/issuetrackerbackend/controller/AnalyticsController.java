package org.platform.issuetrackerbackend.controller;

import lombok.RequiredArgsConstructor;
import org.platform.issuetrackerbackend.dto.ProjectAnalyticsResponse;
import org.platform.issuetrackerbackend.repository.IssueRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final IssueRepository issueRepository;

    @GetMapping("/project/{projectId}")
    public ResponseEntity<ProjectAnalyticsResponse> getProjectAnalytics(@PathVariable Long projectId) {

        List<Object[]> rawCounts = issueRepository.countIssuesByStatus(projectId);

        long total = 0;
        long todo = 0;
        long inProgress = 0;
        long done = 0;

        for (Object[] row : rawCounts) {
            String status = row[0].toString();
            Long count = (Long) row[1];

            total += count;

            if ("TODO".equals(status)) todo = count;
            else if ("IN_PROGRESS".equals(status)) inProgress = count;
            else if ("DONE".equals(status)) done = count;
        }

        ProjectAnalyticsResponse response = ProjectAnalyticsResponse.builder()
                .totalIssues(total)
                .todoCount(todo)
                .inProgressCount(inProgress)
                .doneCount(done)
                .build();

        return ResponseEntity.ok(response);
    }
}
