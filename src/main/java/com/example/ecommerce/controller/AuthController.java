package com.example.ecommerce.controller;

import com.example.ecommerce.dto.LoginRequest;
import com.example.ecommerce.dto.SignupRequest;
import com.example.ecommerce.security.JwtTokenProvider;
import com.example.ecommerce.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        log.debug("Login attempt for user: {}", loginRequest.getUsername());

        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);

            log.debug("Login successful for user: {}", loginRequest.getUsername());
            return ResponseEntity.ok(Map.of(
                "token", jwt,
                "message", "Login successful"
            ));

        } catch (BadCredentialsException e) {
            log.error("Login failed for user: {}. Reason: {}", loginRequest.getUsername(), e.getMessage());
            return ResponseEntity.status(401).body(Map.of(
                "message", "Invalid username or password"
            ));
        } catch (Exception e) {
            log.error("Unexpected error during login for user: {}. Error: {}", loginRequest.getUsername(), e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                "message", "An error occurred during login"
            ));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest signupRequest) {
        log.debug("Registration attempt for user: {}", signupRequest.getUsername());

        try {
            userService.createUser(signupRequest);
            log.debug("Registration successful for user: {}", signupRequest.getUsername());
            return ResponseEntity.ok(Map.of("message", "User registered successfully"));
        } catch (Exception e) {
            log.error("Registration failed for user: {}. Error: {}", signupRequest.getUsername(), e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "message", "Registration failed: " + e.getMessage()
            ));
        }
    }
}