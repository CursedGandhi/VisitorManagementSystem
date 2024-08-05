package com.user.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity

public class User {
    @Id
    private String id;
    private String name;
    private String email;
    private String role;
    private String number;
    private String password;

    public User() {
    }

    public User(String id, String name, String email, String role, String number, String password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.number = number;
        this.password = password;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
