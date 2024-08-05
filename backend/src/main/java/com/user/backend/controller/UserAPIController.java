package com.user.backend.controller;

import com.user.backend.model.User;
import com.user.backend.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "*")
public class UserAPIController {
    UserService userService;

    public UserAPIController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("{id}")
    public User getUserDetails(@PathVariable("id") String id)
    {
        return userService.getUser(id);
    }

    @GetMapping("all")
    public List<User> getAllUserDetails()
    {
        return userService.getAllUsers();
    }

    @GetMapping
    public ResponseEntity<Page<User>> getUsers(@RequestParam(defaultValue = "0") int pageNo, @RequestParam(defaultValue = "10") int  pageSize, @RequestParam(defaultValue = "DESC") String sortingDirection, @RequestParam(defaultValue = "date") String sortBy, @RequestParam(required = false) String searchText){
        Page<User> users = userService.getUsers(pageNo, pageSize, sortingDirection, sortBy, searchText);
        return ResponseEntity.ok(users);
    }

    @GetMapping(value = "newID", produces = "text/plain")
    public String getNewUserID()
    {
        return userService.getNewUserID();
    }

    @GetMapping(value = "auth")
    public User authenticate(@RequestParam(defaultValue = "") String email, @RequestParam(defaultValue = "") String password)
    {
        return userService.authenticate(email, password);
    }

    @PostMapping
    public String createUserDetails(@RequestBody User user)
    {
        userService.createUser(user);
        return("User created successfully");
    }

    @PutMapping("{id}")
    public String updateUserDetails(@PathVariable("id") String id, @RequestBody User user)
    {
        userService.updateUser(user);
        return("User updated successfully");
    }

    @DeleteMapping("{id}")
    public String deleteUserDetails(@PathVariable("id") String id)
    {
        userService.deleteUser(id);
        return "User deleted successfully";
    }
}
