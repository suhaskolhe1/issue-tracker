package org.platform.issuetrackerbackend.dto;

import lombok.Builder;
import lombok.Data;
import java.io.Serializable;

@Data
@Builder
public class ProjectResponse implements Serializable {
    private Long id;
    private String name;
    private String projectKey;
    private String description;
    private String organizationName;
}
