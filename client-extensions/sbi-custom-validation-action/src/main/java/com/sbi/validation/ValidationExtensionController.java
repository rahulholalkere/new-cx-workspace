package com.sbi.validation;

import com.liferay.client.extension.util.spring.boot3.BaseRestController;

import java.util.Objects;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import org.json.JSONObject;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/object/validation/rule/one")
public class ValidationExtensionController {

    @PostMapping
    public ResponseEntity<Map<String, Object>> validateObject(@RequestBody Map<String, Object> payload) {
        String email = (String) payload.get("email");

        if (email != null && isBlockedDomain(email)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Email domain not permitted"));
        }

        return ResponseEntity.ok(Map.of("status", "VALID"));
    }

    private boolean isBlockedDomain(String email) {
        String domain = email.substring(email.indexOf("@") + 1).toLowerCase();
        return List.of("gmail.com", "yahoo.com", "rediffmail.com").contains(domain);
    }
}