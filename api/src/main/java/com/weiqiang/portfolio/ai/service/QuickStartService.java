package com.weiqiang.portfolio.ai.service;

import com.weiqiang.portfolio.ai.dto.QuickStartRequest;
import com.weiqiang.portfolio.ai.dto.QuickStartResponse;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class QuickStartService {

    private final ChatClient chatClient;
    private final String model;

    public QuickStartService(ChatClient.Builder chatClientBuilder,
                             @Value("${spring.ai.openai.chat.options.model}") String model) {
        this.chatClient = chatClientBuilder.build();
        this.model = model;
    }

    public QuickStartResponse generate(QuickStartRequest request) {
        if (request == null || !StringUtils.hasText(request.message())) {
            throw new IllegalArgumentException("message 不能为空");
        }

        String answer = chatClient.prompt()
                .user(request.message())
                .call()
                .content();

        return new QuickStartResponse(model, answer);
    }
}
