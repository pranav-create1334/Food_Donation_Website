package food.donation.Food_Donation.service;

import food.donation.Food_Donation.dto.AuthRequest;
import food.donation.Food_Donation.dto.AuthResponse;
import food.donation.Food_Donation.dto.RegisterRequest;
import food.donation.Food_Donation.model.AppUser;
import food.donation.Food_Donation.model.Role;
import food.donation.Food_Donation.repository.UserRepository;
import food.donation.Food_Donation.security.JwtService;
import food.donation.Food_Donation.security.UserPrincipal;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
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
        String username = normalizeUsername(request.username());
        try {
            AppUser user = new AppUser();
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode(request.password()));
            user.setRole(request.role() == null ? Role.DONOR : request.role());
            AppUser saved = userRepository.save(user);

            return toAuthResponse(saved);
        } catch (DataIntegrityViolationException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username already exists");
        } catch (DataAccessException ex) {
            throw new ResponseStatusException(
                HttpStatus.SERVICE_UNAVAILABLE,
                "Authentication database is unavailable",
                ex
            );
        }
    }

    public AuthResponse signin(AuthRequest request) {
        String username = normalizeUsername(request.username());
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, request.password())
            );
        } catch (AuthenticationException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        } catch (DataAccessException ex) {
            throw new ResponseStatusException(
                HttpStatus.SERVICE_UNAVAILABLE,
                "Authentication database is unavailable",
                ex
            );
        }

        if (authentication.getPrincipal() instanceof UserPrincipal principal) {
            return toAuthResponse(principal);
        }

        try {
            AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
            return toAuthResponse(user);
        } catch (DataAccessException ex) {
            throw new ResponseStatusException(
                HttpStatus.SERVICE_UNAVAILABLE,
                "Authentication database is unavailable",
                ex
            );
        }
    }

    private String normalizeUsername(String username) {
        return username == null ? "" : username.trim();
    }

    private AuthResponse toAuthResponse(AppUser user) {
        return toAuthResponse(UserPrincipal.fromUser(user));
    }

    private AuthResponse toAuthResponse(UserPrincipal principal) {
        String token = jwtService.generateToken(principal);
        return new AuthResponse(
            token,
            new AuthResponse.UserInfo(principal.getId(), principal.getUsername(), principal.getRole())
        );
    }
}
