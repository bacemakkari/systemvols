package com.flight.reservation.controller;

import com.flight.reservation.dto.VolRequest;
import com.flight.reservation.entity.Vol;
import com.flight.reservation.service.VolService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/vols")
@CrossOrigin(origins = "http://localhost:4200")
public class VolController {
    private final VolService volService;

    public VolController(VolService volService) {
        this.volService = volService;
    }

    @GetMapping
    public ResponseEntity<List<Vol>> getVols(
            @RequestParam(required = false, name = "date_depart")
            @DateTimeFormat(pattern = "yyyy-MM-dd")
            LocalDate dateDepart,
            @RequestParam(required = false, name = "date_arrivee")
            @DateTimeFormat(pattern = "yyyy-MM-dd")
            LocalDate dateArrivee,
            @RequestParam(required = false, name = "ville_depart")
            String villeDepart,
            @RequestParam(required = false, name = "ville_arrivee")
            String villeArrivee,
            @RequestParam(required = false, name = "tri")
            String tri) {
        List<Vol> vols = volService.findAll(dateDepart, dateArrivee, villeDepart, villeArrivee, tri);
        return ResponseEntity.ok(vols);
    }

    @PostMapping
    public ResponseEntity<List<Vol>> addVols(@Valid @RequestBody List<VolRequest> volRequests) {
        List<Vol> savedVols = volService.saveAll(volRequests);
        return new ResponseEntity<>(savedVols, HttpStatus.CREATED);
    }

    @GetMapping("/{id}/places")
    public ResponseEntity<Integer> getPlacesDisponibles(@PathVariable UUID id) {
        Integer places = volService.getPlacesDisponibles(id);
        return ResponseEntity.ok(places);
    }
}