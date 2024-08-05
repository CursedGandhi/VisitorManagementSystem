package com.user.backend.service;

import com.user.backend.model.User;
import org.springframework.data.domain.Page;

import java.util.List;

public interface UserService {
    public String createUser(User user);
    public String updateUser(User user);
    public String deleteUser(String id);
    public User getUser(String id);
    public Page<User> getUsers(int pageNo, int pageSize, String sortingDirection, String sortBy, String searchText);
    public List<User> getAllUsers();
    public String getNewUserID();
    public User authenticate(String email, String password);
}
