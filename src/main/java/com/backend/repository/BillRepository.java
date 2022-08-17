package com.backend.repository;

import java.time.LocalDateTime;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.model.Bill;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
        default Query filterBill(EntityManager entityManager, Map<String, String> filterData, Long userId) {
                String maxDate = LocalDateTime.now().toLocalDate().plusDays(1).toString();
                String search = "%" + filterData.getOrDefault("search", "") + "%";
                return entityManager.createQuery(
                                String.format("SELECT b FROM Bill as b WHERE " +
                                                "(billerName LIKE '%s' OR billerEmail LIKE '%s' OR phoneNo LIKE '%s' ) AND "
                                                +
                                                "updatedAt BETWEEN '%s' AND '%s' AND " +
                                                "amount BETWEEN %s AND %s AND " +
                                                "isBillPaid IN (%s) AND " +
                                                "user = %d " +
                                                "ORDER BY %s",
                                                search, search, search,
                                                filterData.getOrDefault("dateGreaterThan", "1990-01-01"),
                                                filterData.getOrDefault("dateLessThan", maxDate),
                                                filterData.getOrDefault("amountGreaterThan", "0"),
                                                filterData.getOrDefault("amountLessThan",
                                                                Long.toString(Long.MAX_VALUE)),
                                                filterData.getOrDefault("billPaid", "true,false"),
                                                userId,
                                                filterData.getOrDefault("sortBy", "id desc")));

        }
}
