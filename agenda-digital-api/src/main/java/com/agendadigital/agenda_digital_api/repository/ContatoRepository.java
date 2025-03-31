package com.agendadigital.agenda_digital_api.repository;

import com.agendadigital.agenda_digital_api.model.Contato;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ContatoRepository extends JpaRepository<Contato, Long> {

    List<Contato> findByClienteId(Long clienteId);
}