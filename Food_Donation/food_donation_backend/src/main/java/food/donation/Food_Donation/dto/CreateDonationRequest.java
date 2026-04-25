package food.donation.Food_Donation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateDonationRequest(
    @NotBlank(message = "Pickup address is required")
    @Size(max = 300, message = "Pickup address cannot exceed 300 characters")
    String pickupAddress,
    @NotBlank(message = "Food description is required")
    @Size(max = 600, message = "Food description cannot exceed 600 characters")
    String foodDescription,
    @NotBlank(message = "Food image is required")
    @Size(max = 4_000_000, message = "Image content is too large")
    String imageUrl,
    @NotBlank(message = "Passcode is required")
    @Pattern(regexp = "^\\d{4,8}$", message = "Passcode must be 4 to 8 digits")
    String passcode
) {
}
