package com.user.backend.controller;

import com.user.backend.model.Visitor;
import com.user.backend.service.EmailService;
import com.user.backend.service.VisitorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/visitor")
@CrossOrigin(origins = "*")
public class VisitorAPIController {
    VisitorService visitorService;

    @Autowired
    private EmailService emailService;

    public VisitorAPIController(VisitorService visitorService) {
        this.visitorService = visitorService;
    }

    @GetMapping("{id}")
    public Visitor getVisitorDetails(@PathVariable("id") String id)
    {
        return visitorService.getVisitor(id);
    }

    @GetMapping("all")
    public List<Visitor> getAllVisitorDetails()
    {
        return visitorService.getAllVisitors();
    }

    @GetMapping
    public ResponseEntity<Page<Visitor>> getVisitors(@RequestParam(defaultValue = "0") int pageNo, @RequestParam(defaultValue = "10") int  pageSize, @RequestParam(defaultValue = "DESC") String sortingDirection, @RequestParam(defaultValue = "date") String sortBy, @RequestParam(required = false) String searchText){
        Page<Visitor> visitors = visitorService.getVisitors(pageNo, pageSize, sortingDirection, sortBy, searchText);
        return ResponseEntity.ok(visitors);
    }

    @GetMapping(value = "newID", produces = "text/plain")
    public String getNewVisitorID()
    {
        return visitorService.getNewVisitorID();
    }

    @GetMapping("byUser")
    public ResponseEntity<Page<Visitor>> getByUser(@RequestParam String user, @RequestParam(defaultValue = "0") int pageNo, @RequestParam(defaultValue = "10") int  pageSize, @RequestParam(defaultValue = "DESC") String sortingDirection, @RequestParam(defaultValue = "date") String sortBy, @RequestParam(required = false) String searchText){
        Page<Visitor> visitors = visitorService.getVisitors(user, pageNo, pageSize, sortingDirection, sortBy, searchText);
        return ResponseEntity.ok(visitors);
    }

    @PostMapping
    public String createVisitorDetails(@RequestBody Visitor visitor)
    {
        visitorService.createVisitor(visitor);
        return("Visitor created successfully");
    }

    @PutMapping("{id}")
    public String updateVisitorDetails(@PathVariable("id") String id, @RequestBody Visitor visitor)
    {
        visitorService.updateVisitor(visitor);
        return("Visitor updated successfully");
    }

    @DeleteMapping("{id}")
    public String deleteVisitorDetails(@PathVariable("id") String id)
    {
        visitorService.deleteVisitor(id);
        return "Visitor deleted successfully";
    }
}
