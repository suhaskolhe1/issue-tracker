package org.platform.issuetrackerbackend.service;


import lombok.RequiredArgsConstructor;
import org.platform.issuetrackerbackend.dto.ProjectRequest;
import org.platform.issuetrackerbackend.dto.ProjectResponse;
import org.platform.issuetrackerbackend.entity.Organization;
import org.platform.issuetrackerbackend.entity.Project;
import org.platform.issuetrackerbackend.repository.OrganizationRepository;
import org.platform.issuetrackerbackend.repository.ProjectRepository;
import org.springframework.cache.annotation.Cacheable;
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

    @Cacheable(value = "project",key = "#id")
    public ProjectResponse getProjectById(Long id) {
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));

        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .projectKey(project.getProjectKey())
                .description(project.getDescription())
                .organizationName(project.getOrganization().getName())
                .build();
    }
}
