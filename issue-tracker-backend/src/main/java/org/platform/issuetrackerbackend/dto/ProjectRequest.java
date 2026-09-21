package org.platform.issuetrackerbackend.dto;


import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectRequest {
    private String name;
    private String projectKey;
    private String description;
    private Long organizationId;
}
