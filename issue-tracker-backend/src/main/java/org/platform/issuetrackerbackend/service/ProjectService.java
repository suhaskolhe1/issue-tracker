package org.platform.issuetrackerbackend.service;


import lombok.RequiredArgsConstructor;
import org.platform.issuetrackerbackend.dto.ProjectRequest;
import org.platform.issuetrackerbackend.entity.Organization;
import org.platform.issuetrackerbackend.entity.Project;
import org.platform.issuetrackerbackend.repository.OrganizationRepository;
import org.platform.issuetrackerbackend.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final OrganizationRepository organizationRepository;

    public Project createProject(ProjectRequest request) {
        Organization org = organizationRepository.findById(request.getOrganizationId()).orElseThrow(() -> new IllegalArgumentException("Organization not found"));
        Project project = Project.builder()
                .name(request.getName())
                .projectKey(request.getProjectKey())
                .description(request.getDescription())
                .organization(org)
                .build();
        return projectRepository.save(project);
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }
}
