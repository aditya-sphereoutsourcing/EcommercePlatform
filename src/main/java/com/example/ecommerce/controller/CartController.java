package com.example.ecommerce.controller;

import com.example.ecommerce.model.CartItem;
import com.example.ecommerce.model.Product;
import com.example.ecommerce.model.User;
import com.example.ecommerce.repository.CartItemRepository;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.UserRepository;
import com.example.ecommerce.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getCart(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.debug("Fetching cart for user: {}", userPrincipal.getId());
        return ResponseEntity.ok(cartItemRepository.findByUserId(userPrincipal.getId()));
    }

    @PostMapping
    public ResponseEntity<?> addToCart(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                     @RequestBody CartItem cartItem) {
        log.debug("Adding item to cart for user: {}", userPrincipal.getId());

        Product product = productRepository.findById(cartItem.getProduct().getId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if the product is already in the cart
        CartItem existingItem = cartItemRepository.findByUserIdAndProductId(
            userPrincipal.getId(), 
            product.getId()
        );

        if (existingItem != null) {
            // Update quantity if the item already exists
            existingItem.setQuantity(existingItem.getQuantity() + cartItem.getQuantity());
            log.debug("Updating existing cart item quantity: {}", existingItem.getQuantity());
            return ResponseEntity.ok(cartItemRepository.save(existingItem));
        }

        // Create new cart item
        cartItem.setUser(user);
        cartItem.setProduct(product);
        log.debug("Creating new cart item with quantity: {}", cartItem.getQuantity());
        return ResponseEntity.ok(cartItemRepository.save(cartItem));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeFromCart(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                          @PathVariable Long id) {
        log.debug("Removing item {} from cart for user: {}", id, userPrincipal.getId());
        CartItem cartItem = cartItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        // Verify the cart item belongs to the user
        if (!cartItem.getUser().getId().equals(userPrincipal.getId())) {
            return ResponseEntity.status(403).body("Not authorized to remove this item");
        }

        cartItemRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateQuantity(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                          @PathVariable Long id,
                                          @RequestBody CartItem cartItem) {
        log.debug("Updating quantity for item {} in cart for user: {}", id, userPrincipal.getId());
        CartItem existing = cartItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        // Verify the cart item belongs to the user
        if (!existing.getUser().getId().equals(userPrincipal.getId())) {
            return ResponseEntity.status(403).body("Not authorized to update this item");
        }

        if (cartItem.getQuantity() < 1) {
            return ResponseEntity.badRequest().body("Quantity must be at least 1");
        }

        existing.setQuantity(cartItem.getQuantity());
        return ResponseEntity.ok(cartItemRepository.save(existing));
    }
}