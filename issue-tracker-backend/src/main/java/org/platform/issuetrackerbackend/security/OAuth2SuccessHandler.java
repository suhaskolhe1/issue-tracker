package org.platform.issuetrackerbackend.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.platform.issuetrackerbackend.entity.Role;
import org.platform.issuetrackerbackend.entity.User;
import org.platform.issuetrackerbackend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String firstName = oAuth2User.getAttribute("given_name");
        String rawLastName = oAuth2User.getAttribute("family_name");
        final String lastName = (rawLastName == null) ? "" : rawLastName;

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = User.builder()
                    .email(email)
                    .firstName(firstName)
                    .lastName(lastName)
                    .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                    .role(Role.DEVELOPER)
                    .build();
            return userRepository.save(newUser);
        });

        String token = jwtService.generateToken(user);
        getRedirectStrategy().sendRedirect(request, response, "http://localhost:4000/oauth2/redirect?token=" + token);
    }
}
