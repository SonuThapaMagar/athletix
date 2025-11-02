//package com.athletix.config;
//
//import com.athletix.repository.UserRepository;
//import com.athletix.security.JwtUtil;
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
//import org.springframework.stereotype.Component;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import java.util.Collections;
//
//@Component
//public class JwtFilter extends OncePerRequestFilter {
//
//    private final JwtUtil jwtUtil;
//    private final UserRepository userRepository;
//
//    public JwtFilter(JwtUtil jwtUtil, UserRepository userRepository) {
//        this.jwtUtil = jwtUtil;
//        this.userRepository = userRepository;
//    }
//
//    @Override
//    protected void doFilterInternal(HttpServletRequest request,
//                                    HttpServletResponse response,
//                                    FilterChain chain)
//            throws java.io.IOException, jakarta.servlet.ServletException {
//
//        String header = request.getHeader("Authorization");
//        if (header != null && header.startsWith("Bearer ")) {
//            String token = header.substring(7);
//            String email = jwtUtil.extractEmail(token);
//
//            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
//                userRepository.findByEmail(email).ifPresent(user -> {
//                    if (jwtUtil.validateToken(token, user)) {
//                        var auth = new UsernamePasswordAuthenticationToken(
//                                user, null, user.getRole().getAuthorities()
//                        );
//                        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
//                        SecurityContextHolder.getContext().setAuthentication(auth);
//                    }
//                });
//            }
//        }
//        chain.doFilter(request, response);
//    }
//}
