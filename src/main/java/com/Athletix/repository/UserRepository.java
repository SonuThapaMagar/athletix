package com.Athletix.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Athletix.entity.User;

public interface UserRepository extends JpaRepository<User, Long>{
	Optional<User> findByClerkId(String clerkId);
}
