package com.project.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class ChatWebSocketHandshakeInterceptor implements HandshakeInterceptor {
    private final JwtDecoder jwtDecoder;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) {
        if (!(request instanceof ServletServerHttpRequest servletRequest)) {
            return false;
        }
        String token = servletRequest.getServletRequest().getParameter("access_token");
        if (token == null || token.isBlank()) {
            return false;
        }
        try {
            Jwt jwt = jwtDecoder.decode(token);
            attributes.put("chatEmail", jwt.getClaimAsString("email"));
            attributes.put("chatUsername", jwt.getClaimAsString("preferred_username"));
            return true;
        } catch (JwtException exception) {
            return false;
        }
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) {
        // No-op.
    }
}
