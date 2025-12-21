package com.athletix.service;

import com.athletix.entity.User;
import com.athletix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
 private final UserRepository userRepository;

 public User save(User user){
     return userRepository.save(user);
 }
}
