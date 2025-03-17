package com.example.ecommerce;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@Slf4j
@SpringBootApplication
public class EcommerceApplication {
    public static void main(String[] args) {
        log.info("Starting E-commerce Application...");
        SpringApplication.run(EcommerceApplication.class, args);
        log.info("E-commerce Application is now running!");
    }
}