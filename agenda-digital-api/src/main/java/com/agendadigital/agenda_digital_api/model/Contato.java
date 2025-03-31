package com.agendadigital.agenda_digital_api.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "contato")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contato {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String tipo;

    @Column(nullable = false, length = 100)
    private String valor;

    @Column(length = 200)
    private String observacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "cliente_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_contato_cliente")
    )
    @JsonBackReference
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Cliente cliente;

}