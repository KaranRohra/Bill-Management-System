package com.backend.utility;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import com.backend.exception.UnauthorizedUserException;
import com.backend.model.Session;
import com.backend.repository.SessionRepository;

public class Helper {
    public static String getHash(String text) {
        try {
            final MessageDigest digest = MessageDigest.getInstance("SHA-256");
            final byte[] hash = digest.digest(text.getBytes(StandardCharsets.UTF_8));
            StringBuffer hexString = new StringBuffer();
            for (int i = 0; i < hash.length; i++) {
                final String hex = Integer.toHexString(0xff & hash[i]);
                if (hex.length() == 1)
                    hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException noSuchAlgorithmException) {
            return null;
        }
    }

    public static Session getSession(SessionRepository sessionRepository, String token) throws UnauthorizedUserException {
        Session session = sessionRepository.findByToken(token);
        if (session == null)
            throw new UnauthorizedUserException("Invalid Authorization Token");
        return session;
    }
}
