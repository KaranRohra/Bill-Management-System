package com.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.model.Session;
import com.backend.model.User;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long>{
    Session findByToken(String token);
    Session findByUser(User user);
}
