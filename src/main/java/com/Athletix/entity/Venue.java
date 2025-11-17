package com.athletix.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

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

	private String name;
	private String address;
	private String city;

	@ElementCollection
	private List<String> sportTypes = new ArrayList<>();

	private Double pricePerHour;
	@Setter
    private String description;

	@ElementCollection
	private List<String> images = new ArrayList<>();

	private boolean isVerified = false;

	@Column(nullable = false)
	private String status = "PENDING"; // PENDING, APPROVED, REJECTED

	@CreationTimestamp
	private LocalDateTime createdAt;
	
	@UpdateTimestamp
	private LocalDateTime updatedAt;
}
