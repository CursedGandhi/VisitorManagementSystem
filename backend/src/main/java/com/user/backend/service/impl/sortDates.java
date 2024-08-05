package com.user.backend.service.impl;

import com.user.backend.model.Visitor;

import java.util.Comparator;

public class sortDates implements Comparator<Visitor> {


    public int compare(Visitor a, Visitor b)
    {

        // Returning the value after comparing the objects
        // this will sort the data in Ascending order
        return a.getDate().compareTo(b.getDate());
    }
}
