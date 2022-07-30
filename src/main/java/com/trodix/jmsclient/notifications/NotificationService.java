package com.trodix.jmsclient.notifications;

import java.time.LocalTime;
import org.springframework.messaging.core.MessageSendingOperations;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class NotificationService {

    private final MessageSendingOperations<String> messageSendingOperations;
    private final ObjectMapper objectMapper;

    public NotificationService(final MessageSendingOperations<String> messageSendingOperations) {
        this.messageSendingOperations = messageSendingOperations;
        this.objectMapper = new ObjectMapper();
    }

    public void sendNotification(final Notification notification) {
        try {
            final String broadcast = objectMapper.writeValueAsString(notification);
            log.info(broadcast);
            this.messageSendingOperations.convertAndSend("/topic/notification", broadcast);
        } catch (final Exception e) {
            log.error("Error while sending notification", e);
        }
    }

}
