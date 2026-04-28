package food.donation.Food_Donation.service;

import food.donation.Food_Donation.dto.CreateDonationRequest;
import food.donation.Food_Donation.dto.DonationResponse;
import food.donation.Food_Donation.dto.UpdateDonationStatusRequest;
import food.donation.Food_Donation.model.AppUser;
import food.donation.Food_Donation.model.Donation;
import food.donation.Food_Donation.model.DonationStatus;
import food.donation.Food_Donation.model.Role;
import food.donation.Food_Donation.repository.DonationRepository;
import food.donation.Food_Donation.repository.UserRepository;
import food.donation.Food_Donation.security.UserPrincipal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class DonationService {

    private final DonationRepository donationRepository;
    private final UserRepository userRepository;

    public DonationService(DonationRepository donationRepository, UserRepository userRepository) {
        this.donationRepository = donationRepository;
        this.userRepository = userRepository;
    }

    public DonationResponse createDonation(UserPrincipal principal, CreateDonationRequest request) {
        if (principal.getRole() != Role.DONOR) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only donors can create donations");
        }
        AppUser donor = findUser(principal.getId());
        Donation donation = new Donation();
        donation.setDonor(donor);
        donation.setPickupAddress(request.pickupAddress().trim());
        donation.setCity(request.city().trim());
        donation.setContactNumber(request.contactNumber().trim());
        donation.setFoodDescription(request.foodDescription().trim());
        donation.setImageUrl(request.imageUrl().trim());
        donation.setPasscode(request.passcode().trim());
        donation.setStatus(DonationStatus.REQUESTED);
        return toResponse(donationRepository.save(donation));
    }

    public List<DonationResponse> listDonations(UserPrincipal principal) {
        List<Donation> donations;
        if (principal.getRole() == Role.ADMIN) {
            donations = donationRepository.findAllByOrderByCreatedAtDesc();
        } else if (principal.getRole() == Role.DONOR) {
            donations = donationRepository.findByDonorIdOrderByCreatedAtDesc(principal.getId());
        } else {
            List<Donation> requested = donationRepository.findByStatusOrderByCreatedAtDesc(DonationStatus.REQUESTED);
            List<Donation> inProgress =
                donationRepository.findByAssignedVolunteerIdAndStatusOrderByCreatedAtDesc(
                    principal.getId(), DonationStatus.ON_THE_WAY
                );
            Map<Long, Donation> merged = new LinkedHashMap<>();
            requested.forEach(donation -> merged.put(donation.getId(), donation));
            inProgress.forEach(donation -> merged.put(donation.getId(), donation));
            donations = new ArrayList<>(merged.values());
            donations.sort(Comparator.comparing(Donation::getCreatedAt).reversed());
        }

        return donations.stream().map(this::toResponse).toList();
    }

    public DonationResponse getDonation(UserPrincipal principal, Long donationId) {
        Donation donation = findDonation(donationId);
        boolean isOwner = donation.getDonor().getId().equals(principal.getId());
        boolean isAdmin = principal.getRole() == Role.ADMIN;
        boolean isVolunteer = principal.getRole() == Role.VOLUNTEER;
        if (!(isOwner || isAdmin || isVolunteer)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed to view this donation");
        }
        return toResponse(donation);
    }

    public DonationResponse updateStatus(UserPrincipal principal, Long donationId, UpdateDonationStatusRequest request) {
        Donation donation = findDonation(donationId);

        if (request.status() == DonationStatus.ON_THE_WAY) {
            if (donation.getStatus() != DonationStatus.REQUESTED) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only requested donations can be picked up");
            }
            if (principal.getRole() == Role.VOLUNTEER) {
                donation.setAssignedVolunteer(findUser(principal.getId()));
            }
            donation.setStatus(DonationStatus.ON_THE_WAY);
            return toResponse(donationRepository.save(donation));
        }

        if (request.status() == DonationStatus.RECEIVED) {
            if (donation.getStatus() != DonationStatus.ON_THE_WAY) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Donation must be on the way before it can be received"
                );
            }
            if (request.passcode() == null || !donation.getPasscode().equals(request.passcode().trim())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid passcode");
            }
            if (
                principal.getRole() == Role.VOLUNTEER
                && donation.getAssignedVolunteer() != null
                && !donation.getAssignedVolunteer().getId().equals(principal.getId())
            ) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This donation is assigned to another volunteer");
            }
            if (donation.getAssignedVolunteer() == null && principal.getRole() == Role.VOLUNTEER) {
                donation.setAssignedVolunteer(findUser(principal.getId()));
            }
            donation.setStatus(DonationStatus.RECEIVED);
            return toResponse(donationRepository.save(donation));
        }

        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported status transition");
    }

    private AppUser findUser(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private Donation findDonation(Long donationId) {
        return donationRepository.findById(donationId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Donation not found"));
    }

    private DonationResponse toResponse(Donation donation) {
        return new DonationResponse(
            donation.getId(),
            donation.getDonor().getId(),
            donation.getDonor().getUsername(),
            donation.getAssignedVolunteer() == null ? null : donation.getAssignedVolunteer().getId(),
            donation.getAssignedVolunteer() == null ? null : donation.getAssignedVolunteer().getUsername(),
            donation.getPickupAddress(),
            donation.getCity(),
            donation.getContactNumber(),
            donation.getFoodDescription(),
            donation.getImageUrl(),
            donation.getStatus(),
            donation.getCreatedAt(),
            donation.getUpdatedAt()
        );
    }
}
