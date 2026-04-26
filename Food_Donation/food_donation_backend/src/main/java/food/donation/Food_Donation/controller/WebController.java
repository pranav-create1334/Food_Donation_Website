package food.donation.Food_Donation.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Controller for serving the React frontend SPA.
 * This handles all non-API routes and returns a simple message
 * since the frontend is deployed separately on Vercel.
 */
@Controller
public class WebController {

    /**
     * Root endpoint - returns API status
     */
    @GetMapping("/")
    @ResponseBody
    public String root() {
        return "Food Donation API is running. Frontend is available at: https://food-donation-website-ai8d7gyub-prs-projects-fa9db43c.vercel.app";
    }

    /**
     * App endpoint - returns API status with frontend link
     */
    @GetMapping("/app")
    @ResponseBody
    public String app() {
        return "Food Donation API is running. Frontend is available at: https://food-donation-website-ai8d7gyub-prs-projects-fa9db43c.vercel.app";
    }

    /**
     * API status endpoint
     */
    @GetMapping("/api/status")
    @ResponseBody
    public String status() {
        return "{\"status\":\"ok\",\"message\":\"Food Donation API is running\"}";
    }
}