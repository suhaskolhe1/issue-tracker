package org.platform.issuetrackerbackend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProjectAnalyticsResponse {
    private Long totalIssues;
    private Long todoCount;
    private Long inProgressCount;
    private Long doneCount;
}
