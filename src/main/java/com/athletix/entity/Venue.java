package com.athletix.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "venues")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Venue {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "owner_id")
	private User owner;

	@Column(length = 150)
	private String name;

	@Column(length = 500)
	private String location;

	@ElementCollection
	private List<String> sportTypes = new ArrayList<>();

	private Double pricePerHour;

	@Column(columnDefinition = "TEXT")
	@Basic(fetch = FetchType.LAZY)
	private String description;

	@ElementCollection
	private List<String> images = new ArrayList<>();

	@ElementCollection
	private List<String> amenities = new ArrayList<>();

	@Column(length = 50)
	private String contactPhone;

	@Column(length = 320)
	private String contactEmail;

	@ElementCollection
	@CollectionTable(name = "venue_operating_hours", joinColumns = @JoinColumn(name = "venue_id"))
	private List<OperatingHourEmbed> operatingHours = new ArrayList<>();

//	private boolean isVerified = false;

//	@Enumerated(EnumType.STRING)
//	@Column(nullable = false)
//	private VenueStatus status = VenueStatus.PENDING;

	@CreationTimestamp
	private LocalDateTime createdAt;

	@UpdateTimestamp
	private LocalDateTime updatedAt;

}