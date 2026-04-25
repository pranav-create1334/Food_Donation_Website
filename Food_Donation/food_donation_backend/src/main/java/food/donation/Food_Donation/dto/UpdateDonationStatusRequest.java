package food.donation.Food_Donation.dto;

import food.donation.Food_Donation.model.DonationStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record UpdateDonationStatusRequest(
    @NotNull(message = "Status is required")
    DonationStatus status,
    @Pattern(regexp = "^$|\\d{4,8}$", message = "Passcode must be empty or 4 to 8 digits")
    String passcode
) {
}

