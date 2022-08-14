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

import com.backend.exception.AccountWithEmailAlreadyExistException;
import com.backend.mapstruct.dto.UserDto;
import com.backend.mapstruct.mappers.UserMapper;
import com.backend.model.Session;
import com.backend.model.User;
import com.backend.repository.SessionRepository;
import com.backend.repository.UserRepository;
import com.backend.utility.Helper;
import com.backend.utility.Links;

@CrossOrigin("*")
@RestController
public class UserController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SessionRepository sessionRepository;
    @Autowired
    private UserMapper userMapper;

    @PostMapping(Links.REGISTER_URL)
    public ResponseEntity<?> create(@RequestBody User user) {
        try {
            user.setPassword(Helper.getHash(user.getPassword()));
            if (userRepository.findByEmail(user.getEmail()) != null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                        "error", "Account with this email " + user.getEmail() + " already exists"));
            }
            userRepository.save(user);
        } catch (DataIntegrityViolationException dataIntegrityViolationException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Some fields are missing. Check name, email and password"));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PostMapping(Links.AUTH_URL)
    public ResponseEntity<Map<String, String>> authUser(@RequestBody UserDto userDto) {
        if (userDto.getEmail() == null || userDto.getPassword() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "error", "Email or Password is missing"));
        }

        User user = userRepository.findByEmail(userDto.getEmail());
        if (user == null)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    Map.of("error", "User not found with email " + userDto.getEmail()));
        if (!user.getPassword().equals(Helper.getHash(userDto.getPassword())))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    Map.of("error", "Wrong password"));

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
            @RequestBody UserDto userDto) {
        Session session = Helper.getSession(sessionRepository, token);
        User user = session.getUser();
        if (userDto.getPassword() != null)
            userDto.setPassword(Helper.getHash(userDto.getPassword()));

        try {
            userMapper.updateUserFromDto(userDto, user);
            userRepository.save(user);
        } catch (DataIntegrityViolationException dataIntegrityViolationException) {
            throw new AccountWithEmailAlreadyExistException(
                    "Account with email " + userDto.getEmail() + " already exist");
        }
        sessionRepository.delete(session);
        return ResponseEntity.ok(user);
    }
}
