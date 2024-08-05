package com.user.backend.repository;

import com.user.backend.model.Visitor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VisitorRepository extends JpaRepository<Visitor, String> {
    Page<Visitor> findByUser(String user, Pageable pageable);


    List<Visitor> findAllByCheckOutAndReminderEmailSentIsFalse(String checkOut);


    @Query("SELECT v FROM Visitor v WHERE "+
            "LOWER(v.name) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
            "LOWER(v.email) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
            "LOWER(v.number) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
            "LOWER(v.id) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
            "LOWER(v.company) LIKE LOWER(CONCAT('%', :searchText, '%'))")
    Page<Visitor> searchVisitors(@Param("searchText") String searchText, Pageable pageable);


    @Query("SELECT v FROM Visitor v WHERE v.user = :user AND ("+
            "LOWER(v.name) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
            "LOWER(v.email) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
            "LOWER(v.number) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
            "LOWER(v.id) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
            "LOWER(v.company) LIKE LOWER(CONCAT('%', :searchText, '%')))")
    Page<Visitor> searchVisitorsByUser(@Param("user") String user, @Param("searchText") String searchText, Pageable pageable);
}
