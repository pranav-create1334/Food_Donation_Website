package food.donation.Food_Donation.dto;

import food.donation.Food_Donation.model.Role;

public record AuthResponse(
    String token,
    UserInfo user
) {
    public record UserInfo(
        Long id,
        String username,
        Role role
    ) {
    }
}

