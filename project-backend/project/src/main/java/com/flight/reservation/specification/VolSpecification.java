package com.flight.reservation.specification;

import com.flight.reservation.entity.Vol;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class VolSpecification {
    public static Specification<Vol> hasDateDepart(LocalDate dateDepart) {
        return (root, query, criteriaBuilder) -> dateDepart == null ? null : criteriaBuilder.equal(
                criteriaBuilder.function("date", String.class, root.get("dateDepart")),
                criteriaBuilder.function("date", String.class, criteriaBuilder.literal(
                        dateDepart.atStartOfDay()
                ))
        );
    }

    public static Specification<Vol> hasDateArrivee(LocalDate dateArrivee) {
        return (root, query, criteriaBuilder) -> dateArrivee == null ? null : criteriaBuilder.equal(
                criteriaBuilder.function("date", String.class, root.get("dateArrivee")),
                criteriaBuilder.function("date", String.class, criteriaBuilder.literal(
                        dateArrivee.atStartOfDay()
                ))
        );
    }

    public static Specification<Vol> hasVilleDepart(String villeDepart) {
        return (root, query, criteriaBuilder) -> villeDepart == null ? null : criteriaBuilder.like(
                criteriaBuilder.lower(root.get("villeDepart")),
                "%" + villeDepart.toLowerCase() + "%"
        );
    }

    public static Specification<Vol> hasVilleArrivee(String villeArrivee) {
        return (root, query, criteriaBuilder) -> villeArrivee == null ? null : criteriaBuilder.like(
                criteriaBuilder.lower(root.get("villeArrivee")),
                "%" + villeArrivee.toLowerCase() + "%"
        );
    }
}