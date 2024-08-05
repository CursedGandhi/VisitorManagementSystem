package com.user.backend.service;

import com.user.backend.model.Visitor;
import org.springframework.data.domain.Page;

import java.util.List;

public interface VisitorService {
    public String createVisitor(Visitor visitor);
    public String updateVisitor(Visitor visitor);
    public String deleteVisitor(String id);
    public Visitor getVisitor(String id);
    public List<Visitor> getAllVisitors();
    public Page<Visitor> getVisitors(int pageNo, int pageSize, String sortingDirection, String sortBy, String searchText);
    public String getNewVisitorID();
    public Page<Visitor> getVisitors(String user, int pageNo, int pageSize, String sortingDirection, String sortBy, String searchText);
}
