package com.example.ecommerce.config;

import com.example.ecommerce.model.Product;
import com.example.ecommerce.model.User;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        log.info("Starting data seeding...");

        if (productRepository.count() == 0) {
            log.info("No products found in database. Starting to seed demo products...");

            Product product1 = new Product();
            product1.setName("Premium Headphones");
            product1.setDescription("High-quality wireless headphones with noise cancellation");
            product1.setPrice(new BigDecimal("199.99"));
            product1.setImageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e");
            product1.setStock(50);
            Product savedProduct1 = productRepository.save(product1);
            log.info("Created product: {} with ID: {}", savedProduct1.getName(), savedProduct1.getId());

            Product product2 = new Product();
            product2.setName("Smart Watch");
            product2.setDescription("Feature-rich smartwatch with health tracking");
            product2.setPrice(new BigDecimal("299.99"));
            product2.setImageUrl("https://images.unsplash.com/photo-1523275335684-37898b6baf30");
            product2.setStock(30);
            Product savedProduct2 = productRepository.save(product2);
            log.info("Created product: {} with ID: {}", savedProduct2.getName(), savedProduct2.getId());

            Product product3 = new Product();
            product3.setName("Laptop Pro");
            product3.setDescription("Powerful laptop for professionals");
            product3.setPrice(new BigDecimal("1299.99"));
            product3.setImageUrl("https://images.unsplash.com/photo-1496181133206-80ce9b88a853");
            product3.setStock(20);
            Product savedProduct3 = productRepository.save(product3);
            log.info("Created product: {} with ID: {}", savedProduct3.getName(), savedProduct3.getId());

            log.info("Finished seeding products. Total products created: {}", productRepository.count());
        } else {
            log.info("Products already exist in database. Count: {}", productRepository.count());
        }

        if (userRepository.count() == 0) {
            log.info("No users found. Creating admin user...");

            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRoles(Set.of("ROLE_ADMIN", "ROLE_USER"));
            User savedAdmin = userRepository.save(admin);
            log.info("Created admin user: {} with ID: {}", savedAdmin.getUsername(), savedAdmin.getId());
        } else {
            log.info("Users already exist in database. Count: {}", userRepository.count());
        }

        log.info("Data seeding completed successfully!");
    }
}