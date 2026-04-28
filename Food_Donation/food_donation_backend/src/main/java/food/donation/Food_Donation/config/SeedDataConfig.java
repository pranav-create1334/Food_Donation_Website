package food.donation.Food_Donation.config;

import food.donation.Food_Donation.model.AppUser;
import food.donation.Food_Donation.model.Donation;
import food.donation.Food_Donation.model.DonationStatus;
import food.donation.Food_Donation.model.Role;
import food.donation.Food_Donation.repository.DonationRepository;
import food.donation.Food_Donation.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SeedDataConfig {

    @Bean
    @Profile("!prod")
    CommandLineRunner seedData(UserRepository userRepository, DonationRepository donationRepository, PasswordEncoder encoder) {
        return args -> {
            if (userRepository.count() > 0) {
                return;
            }

            AppUser donor = new AppUser();
            donor.setUsername("donor1");
            donor.setPassword(encoder.encode("password123"));
            donor.setRole(Role.DONOR);

            AppUser volunteer = new AppUser();
            volunteer.setUsername("volunteer1");
            volunteer.setPassword(encoder.encode("password123"));
            volunteer.setRole(Role.VOLUNTEER);

            AppUser admin = new AppUser();
            admin.setUsername("admin1");
            admin.setPassword(encoder.encode("password123"));
            admin.setRole(Role.ADMIN);

            donor = userRepository.save(donor);
            volunteer = userRepository.save(volunteer);
            userRepository.save(admin);

            Donation requested = new Donation();
            requested.setDonor(donor);
            requested.setPickupAddress("14 MG Road, Bengaluru");
            requested.setCity("Bengaluru");
            requested.setContactNumber("9876543210");
            requested.setFoodDescription("Fresh cooked rice and curry for around 15 people.");
            requested.setImageUrl("https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80");
            requested.setPasscode("1234");
            requested.setStatus(DonationStatus.REQUESTED);

            Donation inTransit = new Donation();
            inTransit.setDonor(donor);
            inTransit.setAssignedVolunteer(volunteer);
            inTransit.setPickupAddress("22 Residency Road, Bengaluru");
            inTransit.setCity("Bengaluru");
            inTransit.setContactNumber("9876543210");
            inTransit.setFoodDescription("Packed bakery items from this evening batch.");
            inTransit.setImageUrl("https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?auto=format&fit=crop&w=900&q=80");
            inTransit.setPasscode("5678");
            inTransit.setStatus(DonationStatus.ON_THE_WAY);

            donationRepository.save(requested);
            donationRepository.save(inTransit);
        };
    }
}
