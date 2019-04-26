package de.grubermi.code_critters.application.init;

import de.grubermi.code_critters.application.service.PasswordService;
import de.grubermi.code_critters.persistence.entities.User;
import de.grubermi.code_critters.persistence.repository.UserRepositiory;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

@Component
public class UserInitialization {

    private UserRepositiory userRepositiory;
    private PasswordService passwordService;

    private final Logger logger = LogManager.getLogger(UserInitialization.class);


    @Autowired
    public UserInitialization(UserRepositiory userRepositiory, PasswordService passwordService) {
        this.userRepositiory = userRepositiory;
        this.passwordService = passwordService;
    }

    @PostConstruct
    public void init() {
        //TODO find by role (admin)
        Iterable<User> users = userRepositiory.findAll();
        if (users == null || !users.iterator().hasNext()) {
            User user = new User();
            user.setActive(true);
            user.setEmail("admin@admin.de");
            user.setUsername("admin");
            user = passwordService.hashPassword("admin", user);
            userRepositiory.save(user);
            logger.info("User admin:admin was added to the database");
        }
    }
}
