package org.platform.issuetrackerbackend.controller;


import lombok.RequiredArgsConstructor;
import org.platform.issuetrackerbackend.entity.Issue;
import org.platform.issuetrackerbackend.repository.IssueRepository;
import org.platform.issuetrackerbackend.service.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {
    private final FileStorageService fileStorageService;
    private final IssueRepository issueRepository;

    @PostMapping("/issue/{issueId}")
    public ResponseEntity<String> uploadAttachment(
            @PathVariable Long issueId,
            @RequestParam("file") MultipartFile file) {
        try {
            String fileUrl = fileStorageService.saveFile(file);
            Issue issue = issueRepository.findById(issueId).orElseThrow();
            issue.setAttachmentUrl(fileUrl);
            issueRepository.save(issue);

            return ResponseEntity.ok(fileUrl);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to upload file");
        }

    }
}
