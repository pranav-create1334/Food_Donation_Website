package food.donation.Food_Donation.controller;

import food.donation.Food_Donation.dto.CreateDonationRequest;
import food.donation.Food_Donation.dto.DonationResponse;
import food.donation.Food_Donation.dto.UpdateDonationStatusRequest;
import food.donation.Food_Donation.security.UserPrincipal;
import food.donation.Food_Donation.service.DonationService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    private final DonationService donationService;

    public DonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    @PostMapping
    @PreAuthorize("hasRole('DONOR')")
    public DonationResponse createDonation(
        @AuthenticationPrincipal UserPrincipal principal,
        @Valid @RequestBody CreateDonationRequest request
    ) {
        return donationService.createDonation(principal, request);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('DONOR','VOLUNTEER','ADMIN')")
    public List<DonationResponse> listDonations(@AuthenticationPrincipal UserPrincipal principal) {
        return donationService.listDonations(principal);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('DONOR','VOLUNTEER','ADMIN')")
    public DonationResponse getDonation(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id) {
        return donationService.getDonation(principal, id);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('VOLUNTEER','ADMIN')")
    public DonationResponse updateDonationStatus(
        @AuthenticationPrincipal UserPrincipal principal,
        @PathVariable Long id,
        @Valid @RequestBody UpdateDonationStatusRequest request
    ) {
        return donationService.updateStatus(principal, id, request);
    }
}

