package com.weiqiang.portfolio.ai.controller;

import com.weiqiang.portfolio.ai.dto.QuickStartRequest;
import com.weiqiang.portfolio.ai.dto.QuickStartResponse;
import com.weiqiang.portfolio.ai.service.QuickStartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class QuickStartController {

    private final QuickStartService quickStartService;

    public QuickStartController(QuickStartService quickStartService) {
        this.quickStartService = quickStartService;
    }

    @PostMapping("/quick-start")
    public ResponseEntity<QuickStartResponse> quickStart(@RequestBody QuickStartRequest request) {
        return ResponseEntity.ok(quickStartService.generate(request));
    }
}
