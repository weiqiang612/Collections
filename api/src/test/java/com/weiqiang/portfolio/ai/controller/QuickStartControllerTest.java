package com.weiqiang.portfolio.ai.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.weiqiang.portfolio.ai.dto.QuickStartRequest;
import com.weiqiang.portfolio.ai.dto.QuickStartResponse;
import com.weiqiang.portfolio.ai.service.QuickStartService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(QuickStartController.class)
class QuickStartControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private QuickStartService quickStartService;

    @Test
    void quickStartShouldReturnAnswer() throws Exception {
        when(quickStartService.generate(new QuickStartRequest("你好"))).thenReturn(
                new QuickStartResponse("tencent/hy3-preview:free", "hello")
        );

        mockMvc.perform(post("/api/ai/quick-start")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new QuickStartRequest("你好"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.model").value("tencent/hy3-preview:free"))
                .andExpect(jsonPath("$.answer").value("hello"));
    }
}
