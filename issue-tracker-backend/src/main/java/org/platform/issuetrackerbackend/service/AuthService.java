package org.platform.issuetrackerbackend.service;

import lombok.RequiredArgsConstructor;
import org.platform.issuetrackerbackend.dto.AuthenticationRequest;
import org.platform.issuetrackerbackend.dto.AuthenticationResponse;
import org.platform.issuetrackerbackend.dto.RegisterRequest;
import org.platform.issuetrackerbackend.entity.Role;
import org.platform.issuetrackerbackend.entity.User;
import org.platform.issuetrackerbackend.repository.UserRepository;
import org.platform.issuetrackerbackend.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class AuthService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {

        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.DEVELOPER)
                .build();

        repository.save(user);

        var jwtToken = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = repository.findByEmail(request.getEmail())
                .orElseThrow();


        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }
}
