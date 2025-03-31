package com.agendadigital.agenda_digital_api.controller;

import com.agendadigital.agenda_digital_api.model.Contato;
import com.agendadigital.agenda_digital_api.model.Cliente;
import com.agendadigital.agenda_digital_api.repository.ContatoRepository;
import com.agendadigital.agenda_digital_api.repository.ClienteRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/clientes/{clienteId}/contatos")
public class ContatoController {

    private final ContatoRepository contatoRepository;
    private final ClienteRepository clienteRepository;

    public ContatoController(ContatoRepository contatoRepository,
                             ClienteRepository clienteRepository) {
        this.contatoRepository = contatoRepository;
        this.clienteRepository = clienteRepository;
    }

    // Endpoint para buscar um contato específico
    @GetMapping("/{contatoId}")
    public ResponseEntity<Contato> buscarContatoPorId(
            @PathVariable Long clienteId,
            @PathVariable Long contatoId) {

        // Verifica se o cliente existe
        if (!clienteRepository.existsById(clienteId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Cliente não encontrado");
        }

        return contatoRepository.findById(contatoId)
                .filter(contato -> contato.getCliente().getId().equals(clienteId))
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Contato não encontrado"));
    }

    @PostMapping
    public ResponseEntity<Contato> criarContato(
            @PathVariable Long clienteId,
            @Valid @RequestBody Contato contato) {

        return clienteRepository.findById(clienteId)
                .map(cliente -> {
                    contato.setCliente(cliente); // Garante o relacionamento
                    return ResponseEntity.status(HttpStatus.CREATED)
                            .body(contatoRepository.save(contato));
                })
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Cliente não encontrado"));
    }

    @GetMapping
    public ResponseEntity<List<Contato>> listarContatos(@PathVariable Long clienteId) {
        if (!clienteRepository.existsById(clienteId)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(contatoRepository.findByClienteId(clienteId));
    }

    @PutMapping("/{contatoId}")
    public ResponseEntity<Contato> atualizarContato(
            @PathVariable Long clienteId,
            @PathVariable Long contatoId,
            @Valid @RequestBody Contato contatoAtualizado) {

        return contatoRepository.findById(contatoId)
                .filter(contato -> contato.getCliente().getId().equals(clienteId))
                .map(contato -> {
                    contato.setTipo(contatoAtualizado.getTipo());
                    contato.setValor(contatoAtualizado.getValor());
                    contato.setObservacao(contatoAtualizado.getObservacao());
                    return ResponseEntity.ok(contatoRepository.save(contato));
                })
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Contato não encontrado"));
    }

    @DeleteMapping("/{contatoId}")
    public ResponseEntity<Void> removerContato(
            @PathVariable Long clienteId,
            @PathVariable Long contatoId) {

        return contatoRepository.findById(contatoId)
                .filter(contato -> contato.getCliente().getId().equals(clienteId))
                .map(contato -> {
                    contatoRepository.delete(contato);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Contato não encontrado"));
    }
}