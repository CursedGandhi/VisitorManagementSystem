package com.user.backend.service;

import com.user.backend.model.Visitor;
import com.user.backend.repository.VisitorRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class VisitorCheckTask {
    private VisitorRepository visitorRepository;
    private EmailService emailService;
    private DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");

    VisitorCheckTask(VisitorRepository visitorRepository, EmailService emailService){
        this.visitorRepository = visitorRepository;
        this.emailService = emailService;
    }

    @Scheduled(fixedRate = 3600000)
    public void checkVisitors(){
        LocalDateTime now = LocalDateTime.now();
        List<Visitor> visitors = visitorRepository.findAllByCheckOutAndReminderEmailSentIsFalse("");

        for(Visitor visitor: visitors){
            if(!visitor.getCheckIn().isEmpty()){
                try{
                LocalDateTime checkIn = LocalDateTime.parse(visitor.getCheckIn(), formatter);
                if(checkIn.isBefore(now.minusHours(9))) {
                    emailService.sendReminderEmail(visitor);
                    visitor.setReminderEmailSent(true);
                    visitorRepository.save(visitor);
                }
                }catch (Exception e){
                    System.err.println("Error parsing date of visitor ID " + visitor.getId() + ": " + e.getMessage());
                }
            }
        }
    }
}
