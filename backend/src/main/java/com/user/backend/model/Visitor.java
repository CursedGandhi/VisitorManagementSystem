package com.user.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity

public class Visitor {
    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    @Id
    private String id;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    private String name;
    private String company;
    private String doc;
    private String email;
    private String doc_no;
    private String date;
    private String checkIn;
    private String checkOut;
    private String number;
    private String user;
    private String is_remarks;
    private String sec_remarks;
    private int no_vis;
    private boolean reminderEmailSent;



    public Visitor(String id, String name, String company, String doc, String email, String doc_no, String date, String checkIn, String checkOut, String number, String user, String is_remarks, String sec_remarks, int no_vis, boolean reminderEmailSent) {
        this.id = id;
        this.name = name;
        this.company = company;
        this.doc = doc;
        this.email = email;
        this.doc_no = doc_no;
        this.date = date;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.number = number;
        this.user = user;
        this.is_remarks = is_remarks;
        this.sec_remarks = sec_remarks;
        this.no_vis = no_vis;
        this.reminderEmailSent = reminderEmailSent;
    }

    public Visitor() {
    }

    public boolean isReminderEmailSent() {
        return reminderEmailSent;
    }

    public void setReminderEmailSent(boolean reminderEmailSent) {
        this.reminderEmailSent = reminderEmailSent;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getDoc() {
        return doc;
    }

    public void setDoc(String doc) {
        this.doc = doc;
    }

    public String getDoc_no() {
        return doc_no;
    }

    public void setDoc_no(String doc_no) {
        this.doc_no = doc_no;
    }



    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getCheckIn() {
        return checkIn;
    }

    public void setCheckIn(String checkIn) {
        this.checkIn = checkIn;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getCheckOut() {
        return checkOut;
    }

    public void setCheckOut(String checkOut) {
        this.checkOut = checkOut;
    }
    public String getSec_remarks() {
        return sec_remarks;
    }

    public void setSec_remarks(String sec_remarks) {
        this.sec_remarks = sec_remarks;
    }

    public int getNo_vis() {
        return no_vis;
    }

    public void setNo_vis(int no_vis) {
        this.no_vis = no_vis;
    }

    public String getIs_remarks() {
        return is_remarks;
    }

    public void setIs_remarks(String is_remarks) {
        this.is_remarks = is_remarks;
    }

}
