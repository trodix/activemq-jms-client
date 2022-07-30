package com.trodix.jmsclient.consumer;

import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.TextMessage;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.trodix.jmsclient.models.ProductModel;
import com.trodix.jmsclient.notifications.Notification;
import com.trodix.jmsclient.notifications.NotificationService;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JmsConsumer implements MessageListener {

    private final NotificationService notificationService;

    public JmsConsumer(final NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @Override
    @JmsListener(destination = "${activemq.topic}")
    public void onMessage(final Message message) {
        final ObjectMapper objectMapper = new ObjectMapper();
        try {
            final TextMessage objectMessage = (TextMessage) message;
            final String serializedObject = objectMessage.getText();
            final ProductModel product = objectMapper.readValue(serializedObject, ProductModel.class);
            // do additional processing
            log.info("Received Message: " + product.toString());
            final Notification notification = new Notification(product.getName());
            this.notificationService.sendNotification(notification);
        } catch (final Exception e) {
            log.error("Received Exception : " + e);
        }

    }
}
