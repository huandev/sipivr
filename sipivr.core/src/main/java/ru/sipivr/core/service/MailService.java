package ru.sipivr.core.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

/**
 * Created by Admin on 21.01.2016.
 */
@Service
public class MailService {
    @Value("${mail.user}")
    private String mailUser;

    @Autowired
    private JavaMailSender mailSender;

    public void send(String to, String subject, String text) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, false, "utf-8");
        message.setContent(text, "text/html");
        helper.setFrom(mailUser);
        helper.setTo(to);
        helper.setSubject(subject);
        this.mailSender.send(message);
    }
}