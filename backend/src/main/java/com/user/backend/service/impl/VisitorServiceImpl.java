package com.user.backend.service.impl;

import com.user.backend.model.Visitor;
import com.user.backend.repository.VisitorRepository;
import com.user.backend.service.EmailService;
import com.user.backend.service.VisitorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Random;


@Service
public class VisitorServiceImpl implements VisitorService {
    @Autowired
    VisitorRepository visitorRepository;

    @Autowired
    private EmailService emailService;

    public VisitorServiceImpl(VisitorRepository visitorRepository) {
        this.visitorRepository = visitorRepository;
    }

    @Override
    public String createVisitor(Visitor visitor) {
        visitorRepository.save(visitor);

        return "Success";
    }

    @Override
    public String updateVisitor(Visitor visitor) {
        Visitor oldVisitor = visitorRepository.getReferenceById(visitor.getId());
        if(!(oldVisitor.getCheckIn().equals(visitor.getCheckIn()))){
        String subject = "Welcome to Alok Industries!";
        String body = visitor.getName() + " from " + visitor.getCompany() + " has successfully checked into Alok Industries. Please make sure to check out within the next 8 hours.";
        emailService.sendEmail(visitor.getEmail(), subject, body);
        }
        if(!(oldVisitor.getCheckOut().equals(visitor.getCheckOut()))){
            String subject = "Hope you had a great day at Alok Industries!";
            String body = visitor.getName() + " from " + visitor.getCompany() + " has successfully checked out of Alok Industries. Hope you had a pleasant time.";
            emailService.sendEmail(visitor.getEmail(), subject, body);
        }
        visitorRepository.save(visitor);
        return "Success";
    }

    @Override
    public String deleteVisitor(String id) {
        visitorRepository.deleteById(id);
        return "Success";
    }

    @Override
    public Visitor getVisitor(String id) {
        return visitorRepository.findById(id).get();
    }

    @Override
    public List<Visitor> getAllVisitors() {

        List<Visitor> visitors = visitorRepository.findAll();
        Collections.sort(visitors,new sortDates());
        return visitors;
    }

    @Override
    public Page<Visitor> getVisitors(int pageNo, int pageSize, String sortingDirection, String sortBy, String searchText){
        Sort.Direction sortDirection = Sort.Direction.fromString(sortingDirection);
        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by(sortDirection, sortBy));
        if (searchText == null || searchText.isEmpty()) {
            return visitorRepository.findAll(pageable);
        } else {
            return visitorRepository.searchVisitors(searchText, pageable);
        }
    }

    @Override
    public String getNewVisitorID(){
        List<Visitor> visitors = visitorRepository.findAll();
        Random rand = new Random();
        int n = rand.nextInt(1000);
        String id = "v" + String.valueOf(n);
        while(true)
        {
            if(!visitorRepository.existsById(id))
                break;
            else{
                n = rand.nextInt(1000);
                id = "v" + String.valueOf(n);
            }
        }
        return id;
    }

    @Override
    public Page<Visitor> getVisitors(String user, int pageNo, int pageSize, String sortingDirection, String sortBy, String searchText){
        Sort.Direction sortDirection = Sort.Direction.fromString(sortingDirection);
        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by(sortDirection, sortBy));
        if (searchText == null || searchText.isEmpty()) {
            return visitorRepository.findByUser(user, pageable);
        } else {
            return visitorRepository.searchVisitorsByUser(user, searchText, pageable);
        }
    }
}
