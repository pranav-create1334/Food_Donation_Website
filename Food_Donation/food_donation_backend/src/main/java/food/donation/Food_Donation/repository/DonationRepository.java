package food.donation.Food_Donation.repository;

import food.donation.Food_Donation.model.Donation;
import food.donation.Food_Donation.model.DonationStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findAllByOrderByCreatedAtDesc();
    List<Donation> findByDonorIdOrderByCreatedAtDesc(Long donorId);
    List<Donation> findByStatusOrderByCreatedAtDesc(DonationStatus status);
    List<Donation> findByAssignedVolunteerIdAndStatusOrderByCreatedAtDesc(Long volunteerId, DonationStatus status);
}

