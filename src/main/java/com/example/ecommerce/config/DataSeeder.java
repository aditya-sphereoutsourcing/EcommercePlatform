package com.example.ecommerce.config;

import com.example.ecommerce.model.Product;
import com.example.ecommerce.model.User;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (productRepository.count() == 0) {
            // Add demo products
            Product product1 = new Product();
            product1.setName("Premium Headphones");
            product1.setDescription("High-quality wireless headphones with noise cancellation");
            product1.setPrice(new BigDecimal("199.99"));
            product1.setImageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e");
            product1.setStock(50);
            productRepository.save(product1);

            Product product2 = new Product();
            product2.setName("Smart Watch");
            product2.setDescription("Feature-rich smartwatch with health tracking");
            product2.setPrice(new BigDecimal("299.99"));
            product2.setImageUrl("https://images.unsplash.com/photo-1523275335684-37898b6baf30");
            product2.setStock(30);
            productRepository.save(product2);

            Product product3 = new Product();
            product3.setName("Laptop Pro");
            product3.setDescription("Powerful laptop for professionals");
            product3.setPrice(new BigDecimal("1299.99"));
            product3.setImageUrl("https://images.unsplash.com/photo-1496181133206-80ce9b88a853");
            product3.setStock(20);
            productRepository.save(product3);
        }

        if (userRepository.count() == 0) {
            // Add admin user
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRoles(Set.of("ROLE_ADMIN", "ROLE_USER"));
            userRepository.save(admin);
        }
    }
}
