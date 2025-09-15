package com.flight.reservation.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "vols")
public class Vol {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @NotNull
    @Column(name = "date_depart", nullable = false)
    @JsonProperty("date_depart")
    private LocalDateTime dateDepart;

    @NotNull
    @Column(name = "date_arrivee", nullable = false)
    @JsonProperty("date_arrivee")
    private LocalDateTime dateArrivee;

    @NotNull
    @Column(name = "ville_depart", nullable = false, length = 100)
    @JsonProperty("ville_depart")
    private String villeDepart;

    @NotNull
    @Column(name = "ville_arrivee", nullable = false, length = 100)
    @JsonProperty("ville_arrivee")
    private String villeArrivee;

    @NotNull
    @Positive
    @Column(name = "prix", nullable = false, precision = 10, scale = 2)
    @JsonProperty("prix")
    private BigDecimal prix;

    @NotNull
    @Positive
    @Column(name = "temps_trajet", nullable = false)
    @JsonProperty("temps_trajet")
    private Integer tempsTrajet;  // in minutes

    @NotNull
    @Positive
    @Column(name = "capacite_maximale", nullable = false)
    @JsonProperty("capacite_maximale")
    private Integer capaciteMaximale = 180;

    @NotNull
    @Column(name = "places_reservees", nullable = false)
    @JsonProperty("places_reservees")
    private Integer placesReservees = 0;

    @Version
    @Column(name = "version")
    private Long version = 0L;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    @JsonProperty("updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "vol", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Reservation> reservations = new ArrayList<>();

    // Constructeurs
    public Vol() {}

    public Vol(LocalDateTime dateDepart, LocalDateTime dateArrivee, String villeDepart, String villeArrivee, BigDecimal prix, Integer tempsTrajet, Integer capaciteMaximale) {
        this.dateDepart = dateDepart;
        this.dateArrivee = dateArrivee;
        this.villeDepart = villeDepart;
        this.villeArrivee = villeArrivee;
        this.prix = prix;
        this.tempsTrajet = tempsTrajet;
        this.capaciteMaximale = capaciteMaximale != null ? capaciteMaximale : 180;
    }

    // Méthodes métier
    public Integer getPlacesDisponibles() {
        return capaciteMaximale - placesReservees;
    }

    @JsonProperty("places_disponibles")  // Expose method as JSON field
    public Integer getPlacesDisponiblesJson() {
        return getPlacesDisponibles();
    }

    public boolean hasAvailableSeats(Integer nombrePlaces) {
        return getPlacesDisponibles() >= nombrePlaces;
    }

    public void reservePlaces(Integer nombrePlaces) {
        if (!hasAvailableSeats(nombrePlaces)) {
            throw new IllegalStateException("Pas assez de places disponibles");
        }
        this.placesReservees += nombrePlaces;
    }

    // Getters et Setters (unchanged)
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public LocalDateTime getDateDepart() { return dateDepart; }
    public void setDateDepart(LocalDateTime dateDepart) { this.dateDepart = dateDepart; }
    public LocalDateTime getDateArrivee() { return dateArrivee; }
    public void setDateArrivee(LocalDateTime dateArrivee) { this.dateArrivee = dateArrivee; }
    public String getVilleDepart() { return villeDepart; }
    public void setVilleDepart(String villeDepart) { this.villeDepart = villeDepart; }
    public String getVilleArrivee() { return villeArrivee; }
    public void setVilleArrivee(String villeArrivee) { this.villeArrivee = villeArrivee; }
    public BigDecimal getPrix() { return prix; }
    public void setPrix(BigDecimal prix) { this.prix = prix; }
    public Integer getTempsTrajet() { return tempsTrajet; }
    public void setTempsTrajet(Integer tempsTrajet) { this.tempsTrajet = tempsTrajet; }
    public Integer getCapaciteMaximale() { return capaciteMaximale; }
    public void setCapaciteMaximale(Integer capaciteMaximale) { this.capaciteMaximale = capaciteMaximale; }
    public Integer getPlacesReservees() { return placesReservees; }
    public void setPlacesReservees(Integer placesReservees) { this.placesReservees = placesReservees; }
    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public List<Reservation> getReservations() { return reservations; }
    public void setReservations(List<Reservation> reservations) { this.reservations = reservations; }
}