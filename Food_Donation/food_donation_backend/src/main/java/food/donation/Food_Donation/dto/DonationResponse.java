package food.donation.Food_Donation.dto;

import food.donation.Food_Donation.model.DonationStatus;
import java.time.Instant;

public record DonationResponse(
    Long id,
    Long donorId,
    String donorUsername,
    Long assignedVolunteerId,
    String assignedVolunteerUsername,
    String pickupAddress,
    String city,
    String contactNumber,
    String foodDescription,
    String imageUrl,
    DonationStatus status,
    Instant createdAt,
    Instant updatedAt
) {
}
