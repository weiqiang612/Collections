package com.weiqiang.portfolio.ai.service;

import com.weiqiang.portfolio.ai.dto.QuickStartRequest;
import com.weiqiang.portfolio.ai.dto.QuickStartResponse;
import org.junit.jupiter.api.Test;
import org.springframework.ai.chat.client.ChatClient;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Answers.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class QuickStartServiceTest {

    @Test
    void generateShouldCallModelAndReturnAnswer() {
        ChatClient.Builder builder = mock(ChatClient.Builder.class);
        ChatClient chatClient = mock(ChatClient.class, RETURNS_DEEP_STUBS);

        when(builder.build()).thenReturn(chatClient);
        when(chatClient.prompt().user("hello").call().content()).thenReturn("hi there");

        QuickStartService service = new QuickStartService(builder, "tencent/hy3-preview:free");
        QuickStartResponse response = service.generate(new QuickStartRequest("hello"));

        assertThat(response.model()).isEqualTo("tencent/hy3-preview:free");
        assertThat(response.answer()).isEqualTo("hi there");
    }
}
