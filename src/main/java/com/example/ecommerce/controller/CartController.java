package com.example.ecommerce.controller;

import com.example.ecommerce.model.CartItem;
import com.example.ecommerce.repository.CartItemRepository;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<?> getCart(@AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(cartItemRepository.findByUserId(user.getId()));
    }

    @PostMapping
    public ResponseEntity<?> addToCart(@AuthenticationPrincipal UserPrincipal user,
                                     @RequestBody CartItem cartItem) {
        cartItem.setUser(user);
        return ResponseEntity.ok(cartItemRepository.save(cartItem));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeFromCart(@AuthenticationPrincipal UserPrincipal user,
                                          @PathVariable Long id) {
        cartItemRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateQuantity(@AuthenticationPrincipal UserPrincipal user,
                                          @PathVariable Long id,
                                          @RequestBody CartItem cartItem) {
        CartItem existing = cartItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        existing.setQuantity(cartItem.getQuantity());
        return ResponseEntity.ok(cartItemRepository.save(existing));
    }
}
