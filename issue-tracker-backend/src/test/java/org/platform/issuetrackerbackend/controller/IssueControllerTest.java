package org.platform.issuetrackerbackend.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.platform.issuetrackerbackend.dto.IssueRequest;
import org.platform.issuetrackerbackend.entity.IssueType;
import org.platform.issuetrackerbackend.entity.Priority;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.test.context.support.WithMockUser;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.http.MediaType;

@SpringBootTest
@AutoConfigureMockMvc
public class IssueControllerTest {
    @Autowired
    private MockMvc mockMvc;


    private ObjectMapper objectMapper = new ObjectMapper();

    @Test
    public void shouldReturnBadRequestWhenTitleIsBlank() throws Exception{
        IssueRequest request = IssueRequest.builder() .title("")
                .type(IssueType.TASK)
                .priority(Priority.HIGH)
                .projectId(1L)
                .build();

        mockMvc.perform(post("/api/issues")
                        .with(csrf())
                        .with(user("test-user").roles("USER"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
