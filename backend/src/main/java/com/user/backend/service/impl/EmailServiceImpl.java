package com.user.backend.service.impl;

import com.user.backend.model.Visitor;
import com.user.backend.service.EmailService;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService{
    private JavaMailSender mailSender;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendEmail(String to, String subject, String body){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        message.setFrom("suyashpbe@gmail.com");
        mailSender.send(message);
    }

    @Override
    public void sendReminderEmail(Visitor visitor){
        SimpleMailMessage message = new SimpleMailMessage();
        String body = "Dear " + visitor.getName() + ", It has been 9 hours since your check-in time please check-out at the nearest gate or get your visitor id renewed.";
        String subject = "CHECK-OUT OVERDUE";
        String to = visitor.getEmail();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        message.setFrom("suyashpbe@gmail.com");
        mailSender.send(message);
    }
}
