package org.platform.issuetrackerbackend.repository;

import org.platform.issuetrackerbackend.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project,Long> {
    Optional<Project> findByProjectKey(String projectKey);

}
