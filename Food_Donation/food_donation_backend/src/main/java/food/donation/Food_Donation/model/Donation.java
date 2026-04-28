package food.donation.Food_Donation.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "donations")
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "donor_id", nullable = false)
    private AppUser donor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_volunteer_id")
    private AppUser assignedVolunteer;

    @Column(nullable = false, length = 300)
    private String pickupAddress;

    @Column(length = 120)
    private String city;

    @Column(length = 20)
    private String contactNumber;

    @Column(length = 600)
    private String foodDescription;

    @Lob
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String imageUrl;

    @Column(nullable = false, length = 20)
    private String passcode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private DonationStatus status;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public AppUser getDonor() {
        return donor;
    }

    public void setDonor(AppUser donor) {
        this.donor = donor;
    }

    public AppUser getAssignedVolunteer() {
        return assignedVolunteer;
    }

    public void setAssignedVolunteer(AppUser assignedVolunteer) {
        this.assignedVolunteer = assignedVolunteer;
    }

    public String getPickupAddress() {
        return pickupAddress;
    }

    public void setPickupAddress(String pickupAddress) {
        this.pickupAddress = pickupAddress;
    }

    public String getFoodDescription() {
        return foodDescription;
    }

    public void setFoodDescription(String foodDescription) {
        this.foodDescription = foodDescription;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getPasscode() {
        return passcode;
    }

    public void setPasscode(String passcode) {
        this.passcode = passcode;
    }

    public DonationStatus getStatus() {
        return status;
    }

    public void setStatus(DonationStatus status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
