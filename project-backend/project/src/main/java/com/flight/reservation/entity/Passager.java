package com.flight.reservation.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Embeddable
public class Passager {
    
    @NotBlank
    @Column(name = "nom", nullable = false, length = 50)
    private String nom;
    
    @NotBlank
    @Column(name = "prenom", nullable = false, length = 50)
    private String prenom;
    
    @Email
    @NotBlank
    @Column(name = "email", nullable = false, length = 100)
    private String email;
    
    // Constructeurs
    public Passager() {}
    
    public Passager(String nom, String prenom, String email) {
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
    }
    
    // Getters et Setters
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    
    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getNomComplet() {
        return prenom + " " + nom;
    }
}