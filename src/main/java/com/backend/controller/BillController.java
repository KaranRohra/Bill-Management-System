package com.backend.controller;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import org.springframework.web.multipart.MultipartFile;

import com.backend.exception.BillNotFoundException;
import com.backend.exception.UploadDownloadFileException;
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
    public ResponseEntity<List<?>> getBills(@RequestHeader("Authorization") String token,
            @RequestParam Map<String, String> filterData) {
        Session session = Helper.getSession(sessionRepository, token);
        Query query = billRepository.filterBill(entityManager, filterData, session.getUser().getId());
        return ResponseEntity.ok(query.getResultList());
    }

    @GetMapping(Links.GET_BILL_BY_ID)
    public ResponseEntity<Bill> getBill(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        Session session = Helper.getSession(sessionRepository, token);
        Bill bill = session.getUser().getBills().stream().filter((b) -> b.getId() == id).findFirst()
                .orElseThrow(() -> new BillNotFoundException("Bill not found with id " + id));
        return ResponseEntity.ok(bill);
    }

    @PutMapping(Links.UPDATE_BILL)
    public ResponseEntity<?> updateBill(@RequestHeader("Authorization") String token,
            BillDto billDto,
            @RequestParam(name = "billImage", required = false) MultipartFile multipartFile,
            @PathVariable("id") Long id) {

        Session session = Helper.getSession(sessionRepository, token);
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new BillNotFoundException("Bill not found with id " + id));

        if (bill.getUser() != session.getUser())
            throw new BillNotFoundException("Bill not found with id " + id);

        billMapper.updateBillFromDto(billDto, bill);
        if (multipartFile != null && !multipartFile.isEmpty())
            bill.setBillImage(saveBillImage(multipartFile, bill.getId()));
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

    @GetMapping(Links.GET_BILL_IMAGE)
    public ResponseEntity<Resource> getImage(@PathVariable("id") Long id, HttpServletRequest request) throws Exception {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new BillNotFoundException("Bill not found with id " + id));
        if (bill.getBillImage() == null) {
            throw new UploadDownloadFileException("Image not found for bill with id " + id);
        }
        try {
            File file = new ClassPathResource("static/bill_images/" + bill.getBillImage()).getFile();
            Resource resource = new UrlResource(Paths.get(file.getAbsolutePath()).toUri());
            return ResponseEntity.ok().contentType(
                    MediaType.parseMediaType(
                            request.getServletContext().getMimeType(resource.getFile().getAbsolutePath())))
                    // If headers is added the file get downloaded else it will display on browser
                    // .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" +
                    // resource.getFilename() + "\"")
                    .body(resource);
        } catch (Exception exception) {
            throw new UploadDownloadFileException("Unable to get File");
        }
    }

    private String saveBillImage(MultipartFile multipartFile, Long id) {
        try {
            File file = new ClassPathResource("").getFile();
            String fileDir = file.getPath() + "/static/bill_images/";
            String fileName = id + "_" + multipartFile.getOriginalFilename();

            Path path = Paths.get(fileDir);
            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }
            Files.copy(multipartFile.getInputStream(), Paths.get(fileDir + fileName),
                    StandardCopyOption.REPLACE_EXISTING);
            return fileName;
        } catch (IOException ioException) {
            throw new UploadDownloadFileException("Unable to upload file");
        }
    }
}
