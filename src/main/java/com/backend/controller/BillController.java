package com.backend.controller;

import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.exception.BillNotFoundException;
import com.backend.mapstruct.dto.BillDto;
import com.backend.mapstruct.mappers.BillMapper;
import com.backend.model.Bill;
import com.backend.model.Session;
import com.backend.repository.BillRepository;
import com.backend.repository.SessionRepository;
import com.backend.utility.Helper;
import com.backend.utility.Links;

@CrossOrigin("*")
@RestController
public class BillController {
    @Autowired
    private BillRepository billRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private BillMapper billMapper;

    @Autowired
    private EntityManager entityManager;

    @PostMapping(Links.CREATE_BILL)
    public ResponseEntity<?> createBill(@RequestBody Bill bill, @RequestHeader("Authorization") String token) {
        Session session = Helper.getSession(sessionRepository, token);
        bill.setUser(session.getUser());
        try {
            billRepository.save(bill);
        } catch (DataIntegrityViolationException dataIntegrityViolationException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Some fields are missing."));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(bill);
    }

    @GetMapping(Links.GET_ALL_BILLS)
    public ResponseEntity<List<Bill>> getBills(@RequestHeader("Authorization") String token,
            @RequestParam Map<String, String> filterData) {
        Session session = Helper.getSession(sessionRepository, token);
        Query query = billRepository.filterBill(entityManager, filterData, session.getUser().getId());
        return ResponseEntity.ok(query.getResultList()); // Unchecked exception may occur so be care full !!!
    }

    @GetMapping(Links.GET_BILL_BY_ID)
    public ResponseEntity<Bill> getBill(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        Session session = Helper.getSession(sessionRepository, token);
        Bill bill = session.getUser().getBills().stream().filter((b) -> b.getId() == id).findFirst()
                .orElseThrow(() -> new BillNotFoundException("Bill not found with id " + id));
        return ResponseEntity.ok(bill);
    }

    @PutMapping(Links.UPDATE_BILL)
    public ResponseEntity<?> updateBill(@RequestHeader("Authorization") String token, @RequestBody BillDto billDto,
            @PathVariable("id") Long id) {
        Session session = Helper.getSession(sessionRepository, token);
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new BillNotFoundException("Bill not found with id " + id));

        if (bill.getUser() != session.getUser())
            throw new BillNotFoundException("Bill not found with id " + id);

        billMapper.updateBillFromDto(billDto, bill);
        billRepository.save(bill);
        return ResponseEntity.ok(bill);
    }

    @DeleteMapping(Links.DELETE_BILL)
    public ResponseEntity<Void> deleteBill(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        Session session = Helper.getSession(sessionRepository, token);
        Bill deleteBill = billRepository.findById(id)
                .orElseThrow(() -> new BillNotFoundException("Bill not found with id " + id));
        if (deleteBill.getUser() != session.getUser())
            throw new BillNotFoundException("Bill not found with id " + id);

        billRepository.delete(deleteBill);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
