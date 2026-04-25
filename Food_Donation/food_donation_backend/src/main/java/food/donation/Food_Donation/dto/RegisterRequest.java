package food.donation.Food_Donation.dto;

import food.donation.Food_Donation.model.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 120, message = "Username must be between 3 and 120 characters")
    String username,
    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 120, message = "Password must be between 6 and 120 characters")
    String password,
    Role role
) {
}

