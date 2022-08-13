package com.backend.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.backend.model.Session;
import com.backend.model.User;
import com.backend.repository.SessionRepository;
import com.backend.repository.UserRepository;
import com.backend.utility.Helper;
import com.backend.utility.Links;
import com.fasterxml.jackson.core.JsonProcessingException;

@CrossOrigin("*")
@RestController
public class UserController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SessionRepository sessionRepository;

    @PostMapping(Links.REGISTER_URL)
    public ResponseEntity<?> create(@RequestBody User user) {
        try {
            user.setPassword(Helper.getHash(user.getPassword()));
            if (userRepository.findByEmail(user.getEmail()) != null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                        "error", "Account with this email already exists"));
            }
            userRepository.save(user);
        } catch (DataIntegrityViolationException dataIntegrityViolationException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Some fields are missing. Check name, email and password"));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PostMapping(Links.AUTH_URL)
    public ResponseEntity<Map<String, String>> authUser(@RequestBody Map<String, String> map) {
        String email = map.get("email"), password = map.get("password");
        User user = userRepository.findByEmail(email);
        if (user == null)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    Map.of("email", "User not found with email " + email));
        if (!user.getPassword().equals(Helper.getHash(password)))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    Map.of("password", "Wrong password"));

        Session session = sessionRepository.findByUser(user);
        if (session == null) {
            session = new Session();
            session.setUser(user);
            session.setToken("Token " + Helper.getHash(user.getId() + user.getEmail() + user.getPassword()));
            sessionRepository.save(session);
        }

        return ResponseEntity.ok(Map.of("token", session.getToken()));
    }

    @GetMapping(Links.GET_USER_URL)
    public ResponseEntity<?> get(@RequestHeader(value = "Authorization") String token) {
        Session session = Helper.getSession(sessionRepository, token);
        return ResponseEntity.ok(session.getUser());
    }

    @PutMapping(Links.UPDATE_USER_URL)
    public ResponseEntity<?> updateUser(@RequestHeader(value = "Authorization") String token,
            @RequestBody User user) throws JsonProcessingException {
        Session session = Helper.getSession(sessionRepository, token);
        User updateUser = session.getUser();

        if (user.getEmail() != null && !user.getEmail().equals(updateUser.getEmail())) {
            if ( userRepository.findByEmail(user.getEmail()) != null)
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Account with email " + user.getEmail() + " already exists"));
            updateUser.setEmail(user.getEmail());
            sessionRepository.delete(session);
        }
        if (user.getPhoneNo() != null)
            updateUser.setPhoneNo(user.getPhoneNo());
        if (user.getName() != null)
            updateUser.setName(user.getName());
        if (user.getPassword() != null) {
            updateUser.setPassword(Helper.getHash(user.getPassword()));
            sessionRepository.delete(session);
        }

        userRepository.save(updateUser);
        return ResponseEntity.ok(updateUser);
    }
}
