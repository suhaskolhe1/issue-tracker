package org.platform.issuetrackerbackend.repository;

import org.platform.issuetrackerbackend.entity.Issue;
import org.platform.issuetrackerbackend.entity.Priority;
import org.platform.issuetrackerbackend.entity.Status;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IssueRepository extends JpaRepository<Issue, Long> {
    List<Issue> findByProjectId(Long projectId);


    @Query("SELECT i FROM Issue i WHERE i.project.id = :projectId " +
            "AND (:status IS NULL OR i.status = :status)" +
            "AND (:priority IS NULL OR i.priority = :priority)")
    Page<Issue> findFilteredIssues(
            @Param("projectId") Long projectId,
            @Param("status") Status status,
            @Param("priority") Priority priority,
            Pageable pageable);


    @Query("SELECT i.status, COUNT(i) FROM Issue i WHERE i.project.id = :projectId GROUP BY i.status")
    List<Object[]> countIssuesByStatus(@Param("projectId") Long projectId);

}
