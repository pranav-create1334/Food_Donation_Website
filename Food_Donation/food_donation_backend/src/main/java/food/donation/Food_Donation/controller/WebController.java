package food.donation.Food_Donation.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controller for serving the React frontend SPA.
 * This handles all non-API routes and forwards them to index.html
 * for client-side routing.
 */
@Controller
public class WebController {

    /**
     * Forward root path to index.html
     */
    @GetMapping({"/", "/index.html"})
    public String index() {
        return "forward:/index.html";
    }

    /**
     * Forward /app path to index.html for the main application
     */
    @GetMapping("/app")
    public String app() {
        return "forward:/index.html";
    }

    /**
     * Forward any other non-API paths to index.html for SPA routing
     */
    @GetMapping("/{path:[^\\.]*}")
    public String forward() {
        return "forward:/index.html";
    }
}