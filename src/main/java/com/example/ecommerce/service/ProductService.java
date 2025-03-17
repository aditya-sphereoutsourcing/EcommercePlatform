package com.example.ecommerce.service;

import com.example.ecommerce.model.Product;
import com.example.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> getAllProducts() {
        log.debug("Fetching all products");
        List<Product> products = productRepository.findAll();
        log.debug("Found {} products", products.size());
        return products;
    }

    public Product getProduct(Long id) {
        log.debug("Fetching product with ID: {}", id);
        return productRepository.findById(id)
            .orElseThrow(() -> {
                log.error("Product not found with ID: {}", id);
                return new RuntimeException("Product not found");
            });
    }

    public Product createProduct(Product product) {
        log.debug("Creating new product: {}", product.getName());
        Product savedProduct = productRepository.save(product);
        log.debug("Created product with ID: {}", savedProduct.getId());
        return savedProduct;
    }

    public Product updateProduct(Long id, Product product) {
        log.debug("Updating product with ID: {}", id);
        Product existingProduct = getProduct(id);

        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setImageUrl(product.getImageUrl());
        existingProduct.setStock(product.getStock());

        Product updatedProduct = productRepository.save(existingProduct);
        log.debug("Updated product: {}", updatedProduct.getName());
        return updatedProduct;
    }

    public void deleteProduct(Long id) {
        log.debug("Deleting product with ID: {}", id);
        productRepository.deleteById(id);
        log.debug("Deleted product with ID: {}", id);
    }
}