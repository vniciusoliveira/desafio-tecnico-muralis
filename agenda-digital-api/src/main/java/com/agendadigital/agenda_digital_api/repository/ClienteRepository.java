package com.agendadigital.agenda_digital_api.repository;

import com.agendadigital.agenda_digital_api.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    // Busca por CPF exato
    Optional<Cliente> findByCpf(String cpf);

    // Verifica se CPF existe
    boolean existsByCpf(String cpf);

    // Busca por nome
    List<Cliente> findByNomeContainingIgnoreCase(String nome);

    // Busca clientes com contatos
    @Query("SELECT c FROM Cliente c LEFT JOIN FETCH c.contatos WHERE c.id = :id")
    Optional<Cliente> findByIdWithContatos(@Param("id") Long id);

    // Busca todos os clientes com contatos
    @Query("SELECT DISTINCT c FROM Cliente c LEFT JOIN FETCH c.contatos")
    List<Cliente> findAllWithContatos();

    // Busca por nome ou CPF
    @Query("SELECT c FROM Cliente c WHERE " +
            "LOWER(c.nome) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
            "REPLACE(REPLACE(c.cpf, '.', ''), '-', '') LIKE CONCAT('%', :termo, '%')")
    List<Cliente> findByNomeOrCpf(@Param("termo") String termo);
}