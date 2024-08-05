package com.user.backend.service.impl;

import com.user.backend.model.User;
import com.user.backend.repository.UserRepository;
import com.user.backend.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class UserServiceImpl implements UserService {
    UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public String createUser(User user) {
        userRepository.save(user);
        return "Success";
    }

    @Override
    public String updateUser(User user) {
        userRepository.save(user);
        return "Success";
    }

    @Override
    public String deleteUser(String id) {
        userRepository.deleteById(id);
        return "Success";
    }

    @Override
    public User getUser(String id) {
        return userRepository.findById(id).get();
    }

    @Override
    public Page<User> getUsers(int pageNo, int pageSize, String sortingDirection, String sortBy, String searchText){
        Sort.Direction sortDirection = Sort.Direction.fromString(sortingDirection);
        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by(sortDirection, sortBy));
        if(searchText == null || searchText.isEmpty())
            return userRepository.findAll(pageable);
        else
            return userRepository.searchUsers(searchText, pageable);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public String getNewUserID(){
        List<User> users = userRepository.findAll();
        Random rand = new Random();
        int n = rand.nextInt(1000);
        String id = "u" + String.valueOf(n);
        while(true)
        {
            if(!userRepository.existsById(id))
                break;
            else{
                n = rand.nextInt(1000);
                id = "v" + String.valueOf(n);
            }
        }
        return id;
    }

    @Override
    public User authenticate(String email, String password)
    {
        List<User> found = userRepository.findByEmail(email);
        if(found.size()==0) {
            return null;
        }
        else
        {
            boolean b = false;
            User foundUser = new User();
            for(User user: found){
                String pass = user.getPassword();
                if(pass.equals(password)) {
                    foundUser = user;
                    b = true;
                    break;
                }
            }
            if(b)
                return foundUser;
            else
                return null;
        }
    }
}
