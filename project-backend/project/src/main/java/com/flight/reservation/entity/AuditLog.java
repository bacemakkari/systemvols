package com.flight.reservation.entity;

import com.flight.reservation.enums.StatutReservation;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "audit_logs")
public class AuditLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    
    @CreationTimestamp
    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;
    
    @Column(name = "vol_id", nullable = false)
    private UUID volId;
    
    @Column(name = "email_passager", nullable = false, length = 100)
    private String emailPassager;
    
    @Column(name = "places_demandees", nullable = false)
    private Integer placesDemandees;
    
    @Column(name = "places_disponibles_avant", nullable = false)
    private Integer placesDisponiblesAvant;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "statut", nullable = false)
    private StatutReservation statut;
    
    @Column(name = "message_erreur", length = 500)
    private String messageErreur;
    
    @Column(name = "reservation_id")
    private UUID reservationId;
    
    // Constructeurs
    public AuditLog() {}
    
    public AuditLog(UUID volId, String emailPassager, Integer placesDemandees, 
                   Integer placesDisponiblesAvant, StatutReservation statut, 
                   String messageErreur, UUID reservationId) {
        this.volId = volId;
        this.emailPassager = emailPassager;
        this.placesDemandees = placesDemandees;
        this.placesDisponiblesAvant = placesDisponiblesAvant;
        this.statut = statut;
        this.messageErreur = messageErreur;
        this.reservationId = reservationId;
    }
    
    // Getters et Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    
    public UUID getVolId() { return volId; }
    public void setVolId(UUID volId) { this.volId = volId; }
    
    public String getEmailPassager() { return emailPassager; }
    public void setEmailPassager(String emailPassager) { this.emailPassager = emailPassager; }
    
    public Integer getPlacesDemandees() { return placesDemandees; }
    public void setPlacesDemandees(Integer placesDemandees) { this.placesDemandees = placesDemandees; }
    
    public Integer getPlacesDisponiblesAvant() { return placesDisponiblesAvant; }
    public void setPlacesDisponiblesAvant(Integer placesDisponiblesAvant) { this.placesDisponiblesAvant = placesDisponiblesAvant; }
    
    public StatutReservation getStatut() { return statut; }
    public void setStatut(StatutReservation statut) { this.statut = statut; }
    
    public String getMessageErreur() { return messageErreur; }
    public void setMessageErreur(String messageErreur) { this.messageErreur = messageErreur; }
    
    public UUID getReservationId() { return reservationId; }
    public void setReservationId(UUID reservationId) { this.reservationId = reservationId; }
}