package com.user.backend.repository;

import com.user.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserRepository extends JpaRepository<User, String> {
    List<User> findByEmail(String email);
    @Query("SELECT u FROM User u WHERE "+
            "LOWER(u.name) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
            "LOWER(u.number) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
            "LOWER(u.id) LIKE LOWER(CONCAT('%', :searchText, '%'))")
    Page<User> searchUsers(@Param("searchText") String searchText, Pageable pageable);
}
