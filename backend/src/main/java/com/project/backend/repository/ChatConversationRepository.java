package com.project.backend.repository;

import com.project.backend.model.ChatConversation;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ChatConversationRepository extends JpaRepository<ChatConversation, Long> {
    @Query("select distinct c from ChatConversation c join c.participants p where p.uzytkownikId = :userId order by c.updatedAt desc")
    List<ChatConversation> findAllForUser(Integer userId);

    @EntityGraph(attributePaths = "participants")
    Optional<ChatConversation> findWithParticipantsById(Long id);
}
