package org.platform.issuetrackerbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.platform.issuetrackerbackend.entity.IssueType;
import org.platform.issuetrackerbackend.entity.Priority;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IssueRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Issue type is required")
    private IssueType type;

    @NotNull(message = "Priority is required")
    private Priority priority;

    @NotNull(message = "Project ID is required")
    private Long projectId;

    // Assignee is optional, so no constraint needed here!
    private Long assigneeId;
}
