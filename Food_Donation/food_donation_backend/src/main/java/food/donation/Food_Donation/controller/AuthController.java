package food.donation.Food_Donation.controller;

import food.donation.Food_Donation.dto.AuthRequest;
import food.donation.Food_Donation.dto.AuthResponse;
import food.donation.Food_Donation.dto.RegisterRequest;
import food.donation.Food_Donation.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse signup(@Valid @RequestBody RegisterRequest request) {
        return authService.signup(request);
    }

    @PostMapping("/signin")
    public AuthResponse signin(@Valid @RequestBody AuthRequest request) {
        return authService.signin(request);
    }
}

