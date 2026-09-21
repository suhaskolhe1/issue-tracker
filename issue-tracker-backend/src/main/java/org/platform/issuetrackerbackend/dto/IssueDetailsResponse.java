package org.platform.issuetrackerbackend.dto;

import lombok.Builder;
import lombok.Data;
import org.platform.issuetrackerbackend.entity.Comment;
import org.platform.issuetrackerbackend.entity.Issue;
import org.platform.issuetrackerbackend.entity.IssueActivity;

import java.util.List;

@Data
@Builder
public class IssueDetailsResponse {
    private Issue issue;
    private List<Comment> comments;
    private List<IssueActivity> activities;
}
