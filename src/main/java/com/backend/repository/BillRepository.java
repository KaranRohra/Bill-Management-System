package com.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.model.Bill;

public interface BillRepository extends JpaRepository<Bill, Long> {

}
