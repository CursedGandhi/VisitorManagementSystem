package com.user.backend.service;

import com.user.backend.model.Visitor;

public interface EmailService {
    public void sendEmail(String to, String subject, String body);
    public void sendReminderEmail(Visitor visitor);
}
