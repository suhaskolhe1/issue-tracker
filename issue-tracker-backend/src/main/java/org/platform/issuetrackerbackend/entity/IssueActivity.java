package org.platform.issuetrackerbackend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "issue_activities")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class IssueActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // What happened? (e.g., "STATUS_CHANGED", "ASSIGNEE_CHANGED")
    @Column(nullable = false)
    private String actionType;

    // e.g., "TODO"
    private String oldValue;

    // e.g., "IN_PROGRESS"
    private String newValue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issue_id", nullable = false)
    private Issue issue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actor_id", nullable = false)
    private User actor; // The person who made the change

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
