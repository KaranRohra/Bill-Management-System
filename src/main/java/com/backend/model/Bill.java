package com.backend.model;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bills")
public class Bill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @Column(name = "biller_name", nullable = false)
    private String billerName;

    @Column(name = "biller_email", nullable = false)
    private String billerEmail;

    @Column(name = "biller_phone_no", nullable = false)
    private String phoneNo;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "amount", nullable = false)
    private Long amount;

    @Column(name = "amount_paid", columnDefinition = "BIGINT DEFAULT 0")
    private Long amountPaid;

    @Column(name = "is_bill_paid", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean isBillPaid;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
