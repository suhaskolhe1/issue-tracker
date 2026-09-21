package org.platform.issuetrackerbackend.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.platform.issuetrackerbackend.dto.ProjectRequest;
import org.platform.issuetrackerbackend.entity.Organization;
import org.platform.issuetrackerbackend.entity.Project;
import org.platform.issuetrackerbackend.repository.OrganizationRepository;
import org.platform.issuetrackerbackend.repository.ProjectRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private OrganizationRepository organizationRepository;

    @InjectMocks
    private ProjectService projectService;

    @Test
    public void shouldCreateProjectSuccessfully() {

        ProjectRequest request = ProjectRequest
                .builder()
                .name("Payment Gateway")
                .projectKey("PAY")
                .description("Migrate to Razorpay")
                .organizationId(1L)
                .build();

        Project savedProject = Project.builder()
                .id(1L)
                .name("Payment Gateway")
                .projectKey("PAY")
                .build();
        Organization organization = Organization.builder()
                .id(1L)
                .name("ABC Crop")
                .build();

        when(organizationRepository.findById(1L)).thenReturn(Optional.of(organization));
        when(projectRepository.save(any(Project.class))).thenReturn(savedProject);

        Project result = projectService.createProject(request);

        assertNotNull(result);
        assertEquals("Payment Gateway", result.getName());
        assertEquals("PAY", result.getProjectKey());

        verify(projectRepository, times(1)).save(any(Project.class));

    }
}
