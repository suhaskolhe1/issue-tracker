package org.platform.issuetrackerbackend.controller;

import lombok.RequiredArgsConstructor;
import org.platform.issuetrackerbackend.dto.ProjectRequest;
import org.platform.issuetrackerbackend.dto.ProjectResponse;
import org.platform.issuetrackerbackend.entity.Project;
import org.platform.issuetrackerbackend.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;

    @PostMapping
    @PreAuthorize("hasRole('PROJECT_MANAGER') or hasRole('ORG_ADMIN')")
    public ResponseEntity<Project> createProject(@RequestBody ProjectRequest request){
        Project createProject = projectService.createProject(request);
        return  ResponseEntity.ok(createProject);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProject(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }
}
