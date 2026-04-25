package food.donation.Food_Donation.service;

import food.donation.Food_Donation.dto.AuthRequest;
import food.donation.Food_Donation.dto.AuthResponse;
import food.donation.Food_Donation.dto.RegisterRequest;
import food.donation.Food_Donation.model.AppUser;
import food.donation.Food_Donation.model.Role;
import food.donation.Food_Donation.repository.UserRepository;
import food.donation.Food_Donation.security.JwtService;
import food.donation.Food_Donation.security.UserPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        AuthenticationManager authenticationManager,
        JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public AuthResponse signup(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username already exists");
        }

        AppUser user = new AppUser();
        user.setUsername(request.username().trim());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(request.role() == null ? Role.DONOR : request.role());
        AppUser saved = userRepository.save(user);

        return toAuthResponse(saved);
    }

    public AuthResponse signin(AuthRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
            );
        } catch (AuthenticationException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        AppUser user = userRepository.findByUsername(request.username())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        return toAuthResponse(user);
    }

    private AuthResponse toAuthResponse(AppUser user) {
        UserPrincipal principal = UserPrincipal.fromUser(user);
        String token = jwtService.generateToken(principal);
        return new AuthResponse(
            token,
            new AuthResponse.UserInfo(user.getId(), user.getUsername(), user.getRole())
        );
    }
}
